# -*- coding: utf-8 -*-

# See https://doc.scrapy.org/en/latest/topics/settings.html
# See https://doc.scrapy.org/en/latest/topics/downloader-middleware.html
# See https://doc.scrapy.org/en/latest/topics/spider-middleware.html

BOT_NAME = 'alexa_skills'

SPIDER_MODULES = ['scraping']
NEWSPIDER_MODULE = 'scraping'

CRAWLERA_ENABLED = True
CRAWLERA_APIKEY = '06fbd839cbd74f63a5532668ea39e7de'
CRAWLERA_URL = 'http://robvoxsnap.crawlera.com:8010'

# User agent
USER_AGENT = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 '
              '(KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36')

# Ignore robots.txt rules
ROBOTSTXT_OBEY = False

# Configure maximum concurrent requests performed by Scrapy (default: 16)
CONCURRENT_REQUESTS = 1

# Configure a delay for requests for the same website (default: 0)
#DOWNLOAD_DELAY = 30
CONCURRENT_REQUESTS_PER_DOMAIN = 1
AUTOTHROTTLE_ENABLED = False
DOWNLOAD_TIMEOUT = 600

# Disable cookies
COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
TELNETCONSOLE_ENABLED = False

# Override the default request headers:
DEFAULT_REQUEST_HEADERS = {
    'Accept': ('text/html,application/xhtml+xml,application/xml;'
               'q=0.9,*/*;q=0.8'),
    'Accept-Language':
    'en',
    'Accept-Encoding':
    'gzip, deflate',
}

RETRY_HTTP_CODES = [500, 503, 504, 400, 403, 404, 408]
RETRY_ENABLED = True
RETRY_TIMES = 100

# Disable referer
REFERER_ENABLED = False

DOWNLOADER_MIDDLEWARES = {
    'scrapy_crawlera.CrawleraMiddleware': 610
}

# Enable or disable extensions
# See https://doc.scrapy.org/en/latest/topics/extensions.html
EXTENSIONS = {
    'scrapy_jsonrpc.webservice.WebService': 500,
    'scrapy.extensions.closespider.CloseSpider': None
}

# Configure item pipelines
# See https://doc.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
    'scraping.alexa.AlexaSkillsPipeline': 300,
}

# HTTP cache
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 86400
HTTPCACHE_IGNORE_HTTP_CODES = RETRY_HTTP_CODES
HTTPCACHE_STORAGE = 'scrapy.extensions.httpcache.DbmCacheStorage'

# Log level
LOG_LEVEL = 'INFO'

# If True, the pipeline will raise a DropItem exception on IntegrityError
ALEXA_RAISE_DROPITEM = True
# If True, scrape reviews
ALEXA_SCRAPE_REVIEWS = False

# Enable JSON-RPC back-end
JSONRPC_ENABLED = True

# Ignore errors and keep on truckin'
CLOSESPIDER_ERRORCOUNT = 0
