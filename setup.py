"""Module for Voxsnap voice apps directory."""
from setuptools import find_packages, setup

SCRAPYJSONRPC_VERSION = 'v0.3.6'
SCRAPYJSONRPC_ARCHIVE = ('https://github.com/robd003/scrapy-jsonrpc/archive/'
                         f'{SCRAPYJSONRPC_VERSION}.zip')

setup(
    name='voxsnap-vad',
    version='0.0.1',
    author='Andrew Udvare',
    author_email='z@udva.re',
    packages=find_packages(),
    url='https://github.com/voxsnap/voxsnap-vad',
    license='LICENSE.txt',
    description='Voxsnap voice apps directory.',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    install_requires=[
        'beautifulsoup4>=4.7.1',
        'html5lib>=1.0.1',
        'Scrapy>=1.6.0',
        'scrapy-djangoitem>=1.1.1',
        'dateparser>=0.7.1',
        'Django>=2.2.2',
        'djangorestframework>=3.10.2',
        'psycopg2>=2.8.3',
        'requests>=2.22.0',
        f'scrapy-jsonrpc @ {SCRAPYJSONRPC_ARCHIVE}',
    ],
    entry_points={
        'console_scripts': [
            # 'name-of-script = module.name:function_name',
        ]
    },
    test_suite='voxsnap_vad.test',
    tests_require=['coveralls', 'nose'],
    classifiers=['Programming Language :: Python :: 3'],
)
