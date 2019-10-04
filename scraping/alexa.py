# pylint: disable=all
# Django boilerplate
from os import environ
environ.setdefault('DJANGO_SETTINGS_MODULE', 'voxsnapvad.settings')
import django  # noqa: E402
django.setup()
# END Django boilerplate
# pylint: enable=all

from typing import Iterable, Mapping, Type, Union  # noqa: E402
from urllib.parse import (ParseResult, parse_qsl, urlencode,
                          urlparse)  # noqa: E402
import json  # noqa: E402
import re  # noqa: E402

from bs4 import BeautifulSoup as Soup, Tag  # noqa: E402
from scrapy.http.response.html import HtmlResponse  # noqa: E402
from scrapy_djangoitem import DjangoItem  # noqa: E402
import dateparser  # noqa: E402
import scrapy  # noqa: E402

from util import try_get  # noqa: E402
from vad.models import (AlexaAuthor, AlexaCategory, AlexaLanguage, AlexaReview,
                        AlexaSkill, AlexaSkillUtterance)  # noqa: E402

ALEXA_SKILLS_NODE_ID = 13727921011
ALEXA_SKILLS_START_URI = ('https://www.amazon.com/alexa-skills/b/?'
                          f'node={ALEXA_SKILLS_NODE_ID}')

HTML5LIB = 'html5lib'

CATEGORY_SELECTOR = '#leftNav > ul:nth-child(2) > ul > div > li > span > a'
BREADCRUMB_SELECTOR = ('#wayfinding-breadcrumbs_feature_div ul li a, '
                       '#wayfinding-breadcrumbs_container ul li a')
# Only on the first page when using 'Featured' sorting
LISTING_LIMIT_SELECTOR = '.pagnDisabled'
LISTING_LIMIT_SELECTOR_ALT = '.a-disabled'  # index 1 on other page
LISTING_LINK_SELECTOR = '#search h2 a'
LISTING_LINK_SELECTOR_FIRST = '#mainResults a.s-access-detail-page'
NEXT_PAGE_SELECTOR = ('#pagnNextLink ::attr(href), .a-pagination .a-last a ::attr(href)')

KEY_HREF = 'href'
KEY_URL = 'url'
KEY_REVIEWS_URL = 'reviews_url'

ATTR_HREF = '::attr(href)'


class AlexaSkillItem(DjangoItem):
    django_model = AlexaSkill


class AlexaLanguageItem(DjangoItem):
    django_model = AlexaLanguage


class AlexaReviewItem(DjangoItem):
    django_model = AlexaReview


class AlexaSkillUtteranceItem(DjangoItem):
    django_model = AlexaSkillUtterance


class AlexaAuthorItem(DjangoItem):
    django_model = AlexaAuthor


class AlexaCategoryItem(DjangoItem):
    django_model = AlexaCategory


class AlexaSkillsPipeline:
    def __init__(self):
        self.cache = {}

    def handle_unique(self, item: scrapy.Item, key: str, cache_key: str,
                      itemClass: Type, modelClass: Type):
        existing = None
        if cache_key not in self.cache:
            self.cache[cache_key] = {}
        if isinstance(item, itemClass):
            if item[key] in self.cache[cache_key]:
                existing = self.cache[cache_key][item[key]]
            else:
                try:
                    existing = modelClass.objects.get(**{key: item[key]})
                except modelClass.DoesNotExist:
                    pass
        if existing:
            self.cache[cache_key][item[key]] = existing
            item._instance = existing  # HACK

    def process_item(self, item: scrapy.Item, spider: scrapy.Spider):
        self.handle_unique(item, 'display_name', 'languages',
                           AlexaLanguageItem, AlexaLanguage)
        self.handle_unique(item, 'name', 'authors', AlexaAuthorItem,
                           AlexaAuthor)
        self.handle_unique(item, 'asin', 'skills', AlexaSkillItem, AlexaSkill)
        self.handle_unique(item, 'name', 'categories', AlexaCategoryItem,
                           AlexaCategory)

        try:
            item.save()
        except django.db.IntegrityError:
            if spider.settings['ALEXA_RAISE_DROPITEM']:
                raise scrapy.exceptions.DropItem()

        return item


def strip_tracking(url):
    parsed: ParseResult = urlparse(url)
    path = re.sub(r'/ref=lp_[^/\?]+([/\?])?', r'\1', parsed.path)
    query_tuple = []
    acceptable = ('i', 'ie', 'rh', 'pageNumber', 'node', 's', 'page')
    for k, value in parse_qsl(parsed.query):
        if k in acceptable:
            query_tuple.append((k, value))
    query = urlencode(query_tuple)
    url = f'https://{parsed.netloc}{path}?{query}'
    return url


def is_robot_check_page(html: bytes):
    return b'Sorry, we just need to make sure you\'re not a robot.' in html


class AmazonAlexaSkillsSpider(scrapy.Spider):
    name = 'amazon_alexa_skills'
    allowed_domains = ['amazon.com']
    start_urls = [ALEXA_SKILLS_START_URI]

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(AmazonAlexaSkillsSpider,
                       cls).from_crawler(crawler, *args, **kwargs)
        spider.scrape_reviews = spider.settings['ALEXA_SCRAPE_REVIEWS']
        return spider

    def parse(self, response: HtmlResponse):
        if not self.scrape_reviews:
            self.logger.info('Not scraping reviews')

        for anchor in response.css(CATEGORY_SELECTOR):
            uri = anchor.css(ATTR_HREF).get()
            if uri:
                uri = uri + '&s=review-rank'
                #uri = uri + '&s=date-desc-rank'
                next_page = response.urljoin(uri)
                yield response.follow(strip_tracking(next_page),
                                      callback=self.parse_category_page)

    def parse_category_page(self, response: HtmlResponse):
        if is_robot_check_page(response.body):
            self.crawler.stats.inc_value('alexaskills/captcha', spider=self)
            return

        selector = ','.join(
            [LISTING_LINK_SELECTOR_FIRST, LISTING_LINK_SELECTOR])
        next_page = response.css(NEXT_PAGE_SELECTOR).get()
        if next_page:
            next_page = response.urljoin(next_page)
            yield response.follow(strip_tracking(next_page),
                                  callback=self.parse_category_page)
        else:
            self.logger.warning("NEXT PAGE NOT FOUND ON: " + response.url)
            #self.logger.warning(response.body)
        for anchor in response.css(selector):
            uri = anchor.css(ATTR_HREF).get()
            if uri:
                next_page = response.urljoin(uri)
                yield response.follow(strip_tracking(next_page),
                                      callback=self.parse_app_page)

    def parse_app_page(self, response: HtmlResponse):
        if is_robot_check_page(response.body):
            self.crawler.stats.inc_value('alexaskills/captcha', spider=self)
            return

        info = get_info(response.body)
        asin = info[KEY_URL].split('/')[-1]
        category_obj_django = None

        self.logger.info('Processing skill: %s (%s) %s', info['title'],
                         info['author'] or 'null', info['image'] or 'no img')

        if info['author']:
            author = AlexaAuthorItem(name=info['author'])
        else:
            author = None
        languages = []

        info['price'] = info['price'] or ''

        for language in info['languages']:
            lang_obj = AlexaLanguageItem(display_name=language)
            languages.append(lang_obj)
            yield lang_obj

        if info['category']:
            category_obj = AlexaCategoryItem(name=info['category'])
            yield category_obj
            category_obj_django = category_obj.save()

        is_free = 'free to enable' in info['price'].lower()
        skill = AlexaSkillItem(title=info['title'],
                               author=author.save(),
                               description=info['description'],
                               original_url=info[KEY_URL],
                               image=info['image'],
                               asin=asin,
                               is_free=is_free,
                               category=category_obj_django)
        yield skill

        skill_obj = skill.save()
        skill_obj.supported_languages.add(
            *map(lambda x: x.save(), languages))
        skill_obj.image = info['image']
        skill_obj.save()

        for utterance in info['utterances']:
            yield AlexaSkillUtteranceItem(skill=skill_obj, utterance=utterance)

        if self.scrape_reviews and info[KEY_REVIEWS_URL]:
            yield response.follow(strip_tracking(info[KEY_REVIEWS_URL]),
                                  callback=self.parse_reviews(skill))

    def parse_reviews(self, skill: AlexaSkillItem):
        def callback(response: HtmlResponse):
            if is_robot_check_page(response.body):
                self.crawler.stats.inc_value('alexaskills/captcha',
                                             spider=self)
                return

            reviews = list(get_reviews(response.body))
            skill_obj = skill.save(commit=False)

            if reviews:
                for review in reviews:
                    rating = (
                        int(re.match(r'(\d+)', review['rating']).group(1)) *
                        20)
                    found_helpful_count = None
                    if review['found_helpful']:
                        if review['found_helpful'].startswith('One person'):
                            found_helpful_count = 1
                        else:
                            found_helpful_count = int(
                                re.match(r'(\d+)',
                                         review['found_helpful']).group(1))
                    avatar_url = None
                    if not review['avatar_url'].endswith('/grey-pixel.gif'):
                        avatar_url = review['avatar_url']
                    username = None
                    if review['username']:
                        username = review['username'][:64]

                    yield AlexaReviewItem(
                        skill=skill_obj,
                        rating=rating,
                        title=review['title'][:128],
                        username=username,
                        text=review['body'],
                        avatar_url=avatar_url,
                        found_helpful_count=found_helpful_count,
                        date=dateparser.parse(
                            review['date']).strftime('%Y-%m-%d'))

                next_page_num = try_get(
                    re.search(r'pageNumber=(\d+)',
                              response.url), lambda x: int(x.group(1)) + 1)
                if next_page_num:
                    yield response.follow(re.sub(
                        r'pageNumber=\d+', f'pageNumber={next_page_num}',
                        response.url),
                                          callback=self.parse_reviews(skill))

        return callback


class NoLimitFoundError(Exception):
    pass


def category_urls(html: str):
    for anchor in Soup(html, HTML5LIB).select(CATEGORY_SELECTOR):
        yield anchor[KEY_HREF]


def get_page_limit(soup: Soup):
    limit = None
    try:
        limit = (''.join(
            soup.select_one(LISTING_LIMIT_SELECTOR).contents).strip())
    except IndexError:
        try:
            limit = ''.join(
                soup.select_one(LISTING_LIMIT_SELECTOR_ALT).contents).strip()
        except IndexError:
            raise NoLimitFoundError()
    if not limit:
        raise NoLimitFoundError()
    return int(limit)


def page_urls(html: str):
    soup = Soup(html, HTML5LIB)
    anchor: Tag
    for anchor in soup.select(LISTING_LINK_SELECTOR):
        yield anchor[KEY_HREF]


def get_info(html: str) -> Mapping[str, Union[Iterable[str], str]]:
    soup = Soup(html, HTML5LIB)
    title_tag: Tag = soup.select_one('h1.a2s-title-content')
    price = try_get(soup.select_one('.a-color-price'), lambda x: x.strings)
    if price is not None:
        price = list(price)[0].strip()

    category_link = soup.select(BREADCRUMB_SELECTOR)[-1]
    category = category_link.string.strip()
    if category.lower() == 'back to results':
        category = re.sub(
            r'/s\?.*', '',
            (category_link['href'][23:].split('-Alexa-Skills')[0].replace(
                '-', ' '))) or None
    image_elem = soup.select_one('.a2s-product-image')
    image = None
    if image_elem is not None:
        image = image_elem['src']

    return dict(
        price=price,
        title=title_tag.string.strip(),
        author=re.sub(r'^by\s+', '',
                      (title_tag.find_next_sibling('span').string.strip())),
        utterances=[
            ''.join(x.strings).strip() for x in soup.select('.a2s-bubble em')
        ],
        description=''.join(
            list(soup.select('#a2s-description > span'))[0].strings).strip(),
        languages=list(
            map(
                lambda x: x.strip(), ''.join(
                    list(soup.select('#a2s-languages-supported > div'))
                    [0].strings).strip().split(','))),
        details=list(
            filter(
                lambda z: len(z) > 0,
                map(
                    lambda y: re.sub(r'\n', '', y).strip(),
                    soup.select_one(
                        '#a2s-skill-details li.a-spacing-micro').strings))),
        reviews_url=try_get(
            soup.select_one('[data-hook="see-all-reviews-link-foot"]'), lambda
            x: ('https://www.amazon.com' + x[KEY_HREF] +
                '&sortBy=recent&pageNumber=1')),
        a_state=[
            json.loads(x.string) for x in soup.select('script[type="a-state"]')
        ],
        url=soup.select_one('[rel="canonical"]')[KEY_HREF],
        category=category,
        image=image)


def get_reviews(html: str):
    soup = Soup(html, HTML5LIB)
    review: Tag
    for review in soup.select('[data-hook="review"]'):
        found_helpful = review.select_one(
            '[data-hook="helpful-vote-statement"]')
        yield dict(title=''.join(
            review.select_one('[data-hook="review-title"]').strings).strip(),
                   date=review.select_one(
                       '[data-hook="review-date"]').string.strip(),
                   username=review.select_one(
                       '[data-hook="genome-widget"] .a-profile-name').string,
                   rating=review.select_one(
                       '[data-hook="review-star-rating"]').string.strip(),
                   body='\n'.join(
                       list(
                           review.select_one(
                               '[data-hook="review-body"]').strings)).strip(),
                   found_helpful=(found_helpful.string.strip()
                                  if found_helpful else None),
                   avatar_url=review.select_one(
                       '[data-hook="genome-widget"] img')['src'])
