from copy import copy
from http.cookiejar import CookieJar
from typing import (IO, Any, Callable, Iterable, Iterator, Mapping,
                    MutableMapping, Optional, Sequence, Tuple, Union, cast)
import collections.abc
import itertools
import json
import re

from bs4 import BeautifulSoup as Soup
import requests

RPC_CALL_APP_CATEGORY_LIST = 'hGdcCf'
RPC_CALL_GET_APP_INFO = 'CHQjJe'
RPC_CALL_GET_REVIEWS = 'C2PVld'

RPC_DOMAIN = 'assistant.google.com'
RPC_BATCHEXECUTE_PATH = ('/_/AssistantAgentdirectoryWebServerUi/data/'
                         'batchexecute')

CATEGORIES_SELECTOR = ('#yDmH0d > c-wiz > div > div > div > div.MUd2qe.YQ5Csb'
                       '> div.vW7mGd.XM6wle.mkDbPd.gvIOmf.GRgMcd.Y3eu4c > span'
                       '> c-wiz > div > ul > li > a')

WIZ_GLOBAL_DATA_KEY_AT = 'SNlM0e'
WIZ_GLOBAL_DATA_KEY_F_SID = 'FdrFJe'


def json_parts(s: str, jsondecoder: json.JSONDecoder) -> Iterator[Any]:
    """Parse the JSON contained within the response. The response is a series
    of lines with lengths and JSON data (which can be across multiple
    lines)."""
    expected_len = None
    start_index = 0
    for line in s.split('\n'):
        orig_len = len(line) + 1  # count the newline
        stripped_line = line.strip()
        if expected_len is None and re.match(r'\d+', stripped_line):
            expected_len = int(stripped_line)
        elif expected_len:
            json_piece = s[start_index:expected_len + start_index - 1]
            yield jsondecoder.raw_decode(json_piece)[0]
            expected_len = None
        start_index += orig_len


def generate_f_req(
        rpc_call,
        payload: Iterable[Union[str, int, None, Iterable[Any]]] = None,
        unk1: Optional[Any] = None,
        unk2: str = '1') -> str:
    """Structure of f.req:

    array of array of RPC ID + arguments in JSON

        [[["rpc call name", "arguments in JSON format (array)", null,
        "some integer (1 or 2)?" or "generic"], ...]]
    """
    return json.dumps([[[
        rpc_call,
        json.dumps(payload),
        unk1,
        unk2,
    ]]])


class UnexpectedPayloadSignature(Exception):
    pass


class LazyWizGlobalData(collections.abc.Mapping):
    def __init__(
            self,
            cookies: Optional[Union[Mapping[str, str], CookieJar]] = None):
        self.cookies = cookies
        self.data = None

    def _init_data(self):
        if self.data:
            return
        session = requests.Session()
        r = session.get(f'https://{RPC_DOMAIN}/explore', cookies=self.cookies)
        r.raise_for_status()
        soup = Soup(r.content, 'html5lib')
        script = soup.select_one('[data-id="_gd"]')
        code = re.sub(r'^window.WIZ_global_data\s?=\s?', '', script.text)
        self.data = json.JSONDecoder().raw_decode(code)[0]

    def __getitem__(self, key: str) -> str:
        self._init_data()
        return self.data[key]

    def __contains__(self, key: str) -> bool:
        self._init_data()
        return key in self.data

    def __iter__(self) -> Iterator[str]:
        self._init_data()
        return iter(self.data)

    def __len__(self) -> int:
        self._init_data()
        return len(self.data)


class GoogleAssistantDataClient:
    def __init__(
            self,
            locale: str = 'en_us',
            cookies: Optional[Union[Mapping[str, str], CookieJar]] = None):
        self.session = requests.Session()
        self.default_params: Mapping[str, str] = {
            'hl': locale,
            'bl':
            'boq_assistantagentdirectorywebserveruiserver_20190626.13_p0',
            'soc-app': '162',
            'soc-platform': '1',
            'soc-device': '1',
            'rt': 'c',
        }
        self.batchexecute_uri = f'https://{RPC_DOMAIN}{RPC_BATCHEXECUTE_PATH}'
        self.jsondecoder = json.JSONDecoder()
        self.cookies = cookies
        self.wiz_global_data = LazyWizGlobalData(self.cookies)

    def batchexecute(
            self,
            data: Union[None, bytes, MutableMapping[str, str], IO[Any]] = None,
            rpcids: Optional[str] = None,
            param_override: Optional[Mapping[str, str]] = None,
            use_cookies: bool = False) -> requests.Response:
        """Primary method for RPC calls."""
        params = copy(cast(MutableMapping[str, str], self.default_params))
        if rpcids:
            params['rpcids'] = rpcids
        if param_override:
            for k, v in param_override.items():
                params[k] = v
        r = cast(requests.Session, self.session).post(
            cast(str, self.batchexecute_uri),
            params=params,
            data=data,
            cookies=self.cookies if use_cookies else None)
        r.raise_for_status()
        if r.content[0:4] != b')]}\'':
            raise UnexpectedPayloadSignature('Unexpected payload signature')
        return r

    def get_categories(self) -> Iterator[Tuple[str, str, int]]:
        """Generates tuples of (URL path, category name, category ID)."""
        r = self.session.get(f'https://{RPC_DOMAIN}/explore',
                             params={'hl': self.default_params['hl']})
        r.raise_for_status()
        soup = Soup(r.content, 'html5lib')
        for anchor in soup.select(CATEGORIES_SELECTOR):
            href = anchor['href']
            yield f'/{href}', anchor.text, int(href.split('/')[-2])

    def get_app_list(self, category_id: int,
                     next_key: Optional[str] = None) -> Sequence[Any]:
        """Response indices:

        2 - locale code
        3 - unknown, maybe continuation?
        5 - category name
        8 - list of app info
        8.0.x.0 - subcategory text
        8.x.x.1 - list of apps
        8.x.x.1.x.0 - title
        8.x.x.1.x.1 - icon URL
        8.x.x.1.x.2 - main utterance
        8.x.x.1.x.3 - uid/ path
        8.x.x.1.x.4 - rating (round up to get same as website display)
        8.x.x.1.x.5 - author
        8.x.x.1.x.6 - description
        """
        f_req = generate_f_req(RPC_CALL_APP_CATEGORY_LIST,
                               payload=[
                                   category_id, None, next_key or '', None,
                                   None, None, None, None,
                                   cast(Mapping[str, str],
                                        self.default_params)['hl']
                               ])
        r = self.batchexecute(data={'f.req': f_req},
                              rpcids=RPC_CALL_APP_CATEGORY_LIST)
        return json.loads(list(json_parts(r.text, self.jsondecoder))[0][0][2])

    def get_app_list_for_intent(self,
                                intent: str,
                                next_key: Optional[str] = None
                                ) -> Sequence[Any]:
        """Example intent: GetInfoAboutArtsAndCulture.

        `next_key` is the `retvalue[3]` in the response. This is required for
        pagination.
        """
        nones = [None for x in range(5)]
        f_req = generate_f_req(
            RPC_CALL_APP_CATEGORY_LIST,
            payload=[None, None, next_key or ''] + nones + [
                cast(Mapping[str, str], self.default_params)['hl'],
                [None, intent]
            ],
            unk2='generic')
        r = self.batchexecute(
            data={'f.req': f_req},
            param_override={
                'f.sid': self.wiz_global_data[WIZ_GLOBAL_DATA_KEY_F_SID]
            },
            rpcids=RPC_CALL_APP_CATEGORY_LIST)
        return json.loads(list(json_parts(r.text, self.jsondecoder))[0][0][2])

    def get_app_info(self, uid: str) -> Sequence[Any]:
        """Response indices:

        1 - title
        2 - related picture URI
        3 - app icon URI
        5 - description
        6 - category
        8 - sample questions
        10 - company
        14 - categories array ["name", URI, path]
        18 - array of booleans, unknown purpose
        19 - path of the app
        25 - index 4 is the ratings
        26 - app ID?
        28 - avaialble devices (array of arrays)
        41 - sample questions in different structure"""
        uid = uid.split('/')[-1]
        f_req = generate_f_req(RPC_CALL_GET_APP_INFO,
                               payload=[
                                   None, f'uid/{uid}', None, None,
                                   cast(Mapping[str, str],
                                        self.default_params)['hl']
                               ])
        r = self.batchexecute(data={'f.req': f_req},
                              rpcids=RPC_CALL_GET_APP_INFO)
        return json.loads(list(json_parts(r.text, self.jsondecoder))[0][0][2])

    def get_reviews(self, uid: str,
                    next_key: Optional[str] = None) -> Sequence[Any]:
        """Requires logged in state to actually receive data. Specifically,
        this requires cookies `HSID`, `SID`, `SSID`.

        `next_key` can be found near the end of the response.
        """
        uid = uid.split('/')[-1]
        f_req = generate_f_req(
            RPC_CALL_GET_REVIEWS,
            payload=[f'uid/{uid}', [next_key] if next_key else []],
            unk2='generic')
        r = self.batchexecute(
            data={
                'f.req': f_req,
                'at': self.wiz_global_data[WIZ_GLOBAL_DATA_KEY_AT]
            },
            rpcids=RPC_CALL_GET_REVIEWS,
            use_cookies=True,
            param_override={
                'f.sid': self.wiz_global_data[WIZ_GLOBAL_DATA_KEY_F_SID]
            },
        )
        return json.loads(list(json_parts(r.text, self.jsondecoder))[0][0][2])


def get_x_recursive(method: Callable[[Union[str, int], Optional[str]], Any],
                    arg: Union[int, str],
                    next_key_getter: Callable[[Any], Optional[str]],
                    next_key: Optional[str] = None) -> Iterator[Any]:
    """
    `method` is the bound method to call (or callable).

    `arg` is the first argument to `method`.

    `next_key_getter` should be a callable for getting the next key string
    from the response.

    `next_key` is for internal use.
    """
    resp = method(arg, next_key)
    yield resp
    nnk = next_key_getter(resp)
    if not nnk:
        return
    yield from get_x_recursive(method, arg, next_key_getter, next_key=nnk)


def unwrapped_main():
    # pylint: disable=all
    from datetime import datetime
    from http.cookiejar import MozillaCookieJar
    from os import environ
    environ.setdefault('DJANGO_SETTINGS_MODULE', 'voxsnapvad.settings')
    import sys  # noqa: E402
    # Django boilerplate
    import django  # noqa: E402
    django.setup()
    from vad.models import (Category, GoogleAssistantAction,
                            GoogleAssistantAuthor, GoogleAssistantDevice,
                            GoogleAssistantReview, GoogleAssistantUtterance)
    # END Django boilerplate
    # pylint: enable=all

    try:
        cookie_jar = MozillaCookieJar(sys.argv[1])
        cookie_jar.load()
    except IndexError:
        cookie_jar = None

    yyyymmddhhmm = '%Y-%m-%d %H:%M'

    client = GoogleAssistantDataClient(cookies=cookie_jar)

    def get_index_3_cb(x: Sequence[Any]) -> Sequence[Any]:
        return x[3]

    def get_reviews_next_key_cb(x: Sequence[Any]) -> Sequence[Any]:
        return x[0][1][0]

    def stripped_or_none(s: Optional[str]) -> Optional[str]:
        if isinstance(s, str):
            return s.strip() or None
        return None

    seen_uids = set()

    for _, __, cat_id in client.get_categories():
        intents = map(
            lambda x: x[0][3],
            itertools.chain.from_iterable(
                map(
                    lambda x: x[8],
                    filter(
                        lambda x: x and x[8],
                        get_x_recursive(client.get_app_list, cat_id,
                                        get_index_3_cb)))))

        for intent in intents:
            print(f'├─┬ {intent}')
            uids = map(
                get_index_3_cb,
                itertools.chain.from_iterable(
                    map(
                        lambda x: x[8][0][0][1],
                        filter(
                            lambda x: x[8][0][0][1],
                            get_x_recursive(client.get_app_list_for_intent,
                                            intent, get_index_3_cb)))))

            for uid in uids:
                if uid in seen_uids:
                    continue
                seen_uids.add(uid)
                info = client.get_app_info(uid)
                author_name, author_email = info[4][10]
                author_name = stripped_or_none(author_name)
                author_email = stripped_or_none(author_email)
                category_name = info[4][14][0][0]
                system_name = info[2]
                app_name = info[4][1]
                utterances = info[4][8]
                devices = info[4][28]

                try:
                    author = GoogleAssistantAuthor.objects.get(
                        name=author_name, email=author_email)
                except GoogleAssistantAuthor.DoesNotExist:
                    author = GoogleAssistantAuthor(name=author_name,
                                                   email=author_email)
                    author.save()

                try:
                    category = Category.objects.get(name=category_name)
                except Category.DoesNotExist:
                    category = Category(name=category_name)
                    category.save()

                print(f'│ ├── {app_name} ({system_name})')

                try:
                    action: GoogleAssistantAction = (
                        GoogleAssistantAction.objects.get(
                            system_name=system_name))
                except GoogleAssistantAction.DoesNotExist:
                    action = GoogleAssistantAction(
                        system_name=system_name,
                        original_url=(
                            f'https://assistant.google.com/services/a/{uid}'))

                action.populate_from_api_info(info, uid)
                action.category = category
                action.author = author
                action.save()

                for device_name, image_url, unk1, unk2 in devices:
                    try:
                        device = GoogleAssistantDevice.objects.get(
                            image_url=image_url)
                    except GoogleAssistantDevice.DoesNotExist:
                        device = GoogleAssistantDevice(
                            display_name=device_name, image_url=image_url)
                        device.save()

                    action.available_devices.add(device)
                action.save()

                for utterance in utterances:
                    try:
                        utterance = GoogleAssistantUtterance.objects.get(
                            action=action, utterance=utterance)
                    except GoogleAssistantUtterance.DoesNotExist:
                        utterance = GoogleAssistantUtterance(
                            action=action, utterance=utterance)
                        utterance.save()

                if cookie_jar:
                    reviews = list(
                        itertools.chain.from_iterable(
                            get_x_recursive(client.get_reviews, uid,
                                            get_reviews_next_key_cb)))
                    if reviews[0][0] is None:
                        reviews[0][0] = []
                    for (rating, comment, username, uniqid, timestamp,
                         avatar_url) in reviews[0][0]:
                        try:
                            review = GoogleAssistantReview.objects.get(
                                unique_id=uniqid)
                        except GoogleAssistantReview.DoesNotExist:
                            date_created = datetime.fromtimestamp(
                                timestamp / 1e6).strftime(yyyymmddhhmm)
                            review = GoogleAssistantReview(
                                action=action,
                                rating=rating,
                                username=username,
                                unique_id=uniqid,
                                text=comment,
                                avatar_url=avatar_url,
                                updated_at=date_created,
                                created_at=date_created)
                            review.save()


def main():
    try:
        unwrapped_main()
    except KeyboardInterrupt:
        print('')


if __name__ == '__main__':
    main()
