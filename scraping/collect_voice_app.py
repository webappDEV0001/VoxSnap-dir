# pylint: disable=all
# Django boilerplate
from os import environ
environ.setdefault('DJANGO_SETTINGS_MODULE', 'voxsnapvad.settings')
import django  # noqa: E402
django.setup()
# END Django boilerplate
# pylint: enable=all

from typing import Iterable, Mapping, Type, Union
from urllib.parse import (ParseResult, parse_qsl, urlencode,
                          urlparse)
import json
import re

from util import try_get
from vad.models import (GoogleAssistantAction, AlexaSkill, VoiceApp)

# from fuzzywuzzy import fuzz
# from fuzzywuzzy import process
from datetime import datetime
from elasticsearch import Elasticsearch

# def unwrapped_main_():
#     tmpSkills = AlexaSkill.objects.all().values('id', 'title', 'created_at', 'updated_at')
#     # cachedSkills = json.dumps(list(tmpSkills), indent=4, sort_keys=True, default=str)
#     cachedSkills = list(tmpSkills)
#     tmpActions = GoogleAssistantAction.objects.all().values('id', 'name', 'created_at', 'updated_at')
#     cachedActions = list(tmpActions)
#     cachedActions = json.dumps(list(tmpActions), indent=4, sort_keys=True, default=str)

#     for i in range(len(cachedSkills)):
#         curSkillName = cachedSkills[i]['title']
#         curSkillID = cachedSkills[i]['id']
#         curSkillCreatedAt = cachedSkills[i]['created_at']
#         curSkillUpdatedAt = cachedSkills[i]['updated_at']

#         for j in range(len(cachedActions)):
#             curActionName = cachedActions[j]['name']
#             curActionID = cachedActions[j]['id']
#             ratio = fuzz.ratio(curSkillName, curActionName)
#             if (ratio > 95):
#                 skillAppToSave = VoiceApp(created_at=curSkillCreatedAt,
#                         updated_at = curSkillUpdatedAt,
#                         alexa_skill_id = curSkillID,
#                         google_assistant_action_id = curActionID)
#                 skillAppToSave.save()
#                 cachedActions.remove(cachedActions[j])
#                 print('Matching action was found, will duplicate it on VoiceApp as GoogleActionID')
#                 break

def unwrapped_main():
    #tmp code
    AlexaSkill.objects.all().update(added_elastic=False)
    GoogleAssistantAction.objects.all().update(added_elastic=False)
    ###
    es = Elasticsearch([{'host': 'localhost', 'port': '9200'}])
    tmpSkills = AlexaSkill.objects.filter(added_elastic=False).values('id', 'title', 'created_at', 'updated_at')
    cachedSkills = list(tmpSkills)
    #tmp code
    if es.indices.exists(index='alexa_skills'):
        es.indices.delete(index='alexa_skills', ignore=[400, 404])
    ###
    # else:
    mapping_alexa = {
        "mappings": {
            "properties": {
                "name": {
                    "type": "text"
                }
            }
        }
    }
    es.indices.create(index='alexa_skills', ignore=400, body=mapping_alexa)

    i = 0
    for i in range(len(cachedSkills)):
    # for i in range(5):
        tmpSkillName = cachedSkills[i]['title']
        tmpSkillID = cachedSkills[i]['id']
        tmpSkillCreatedAt = cachedSkills[i]['created_at']
        tmpSkillUpdatedAt = cachedSkills[i]['updated_at']
        row = {'name': tmpSkillName}
        es.index(index='alexa_skills', doc_type='_doc', id=tmpSkillID, body=row)

        skillAppToSave = VoiceApp(created_at=tmpSkillCreatedAt,
            updated_at = tmpSkillUpdatedAt,
            alexa_skill_id = tmpSkillID)
        skillAppToSave.save()
        i = i + 1

    es.indices.refresh(index="alexa_skills")

    tmpActions = GoogleAssistantAction.objects.filter(added_elastic=False).values('id', 'name', 'created_at', 'updated_at')
    cachedActions = list(tmpActions)
    i = 0
    matched_count = 0
    matched_data = []
    for i in range(len(cachedActions)):
    # for i in range(5):
        tmpActionName = cachedActions[i]['name']
        tmpActionID = cachedActions[i]['id']
        tmpActionCreatedAt = cachedActions[i]['created_at']
        tmpActionUpdatedAt = cachedActions[i]['updated_at']
        #searching from Alexa Skills
        query_body = {'query': {'match': {'name': tmpActionName}}}
        res = es.search(index='alexa_skills', body=query_body)
        if res['hits']['total']['value'] > 0 and res['hits']['hits'][0]['_score'] > 12:
            matched_count += 1
            print('\nfound same name(AlexaSkill)' + json.dumps(res['hits']['hits'][0]))
            print('\nfound same name(GoogleAction)' + tmpActionName)
            insert_str = 'Alexa: ' + res['hits']['hits'][0]['_source']['name'] + ', Google: ' + tmpActionName + ', ' + 'score: ' + str(res['hits']['hits'][0]['_score']) + '     '
            matched_data.append(insert_str)
            apps = VoiceApp.objects.filter(alexa_skill_id=res['hits']['hits'][0]['_id'])
            apps.update(google_assistant_action_id=tmpActionID)
        else:
            actionAppToSave = VoiceApp(created_at=tmpActionCreatedAt,
                updated_at = tmpActionUpdatedAt,
                google_assistant_action_id = tmpActionID)
            actionAppToSave.save()

    print('mathced count: ' + str(matched_count) + '\n')
    print('matched data: ' + json.dumps(matched_data))
    AlexaSkill.objects.all().update(added_elastic=True)
    GoogleAssistantAction.objects.all().update(added_elastic=True)

def main():
    try:
        unwrapped_main()
    except KeyboardInterrupt:
        print('')


if __name__ == '__main__':
    main()
