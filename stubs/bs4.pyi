from typing import Iterable, List


class Tag:
    strings: Iterable[str]
    contents: Iterable[str]
    next_sibling: 'Tag'
    string: str

    def __getitem__(self, key: str) -> str:
        pass

    def select_one(self, selector: str) -> 'Tag':
        pass

    def find_next_sibling(self, s: str):
        pass


class BeautifulSoup:
    def __init__(self, s: str, lib: str):
        pass

    def select(self, selector: str) -> List[Tag]:
        pass

    def select_one(self, selector: str) -> Tag:
        pass
