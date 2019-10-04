from rest_framework import serializers

from .models import (AlexaAuthor, AlexaCategory, AlexaLanguage, AlexaReview,
                     AlexaSkill, Category, Device, GoogleAssistantAction,
                     GoogleAssistantAuthor, GoogleAssistantReview, VoiceApp, AlexaDevice, GoogleAssistantDevice)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class VoiceAppSerializer(serializers.HyperlinkedModelSerializer):

    alexa_skill_review = serializers.SerializerMethodField()
    google_assistant_action_review = serializers.SerializerMethodField()
    class Meta:
        model = VoiceApp
        fields = ('id', 'url', 'created_at', 'updated_at', 'alexa_skill', 'google_assistant_action', 'alexa_skill_review', 'google_assistant_action_review')
        depth = 2

    def get_alexa_skill_review(self, app):
        device_param = self.context['request'].query_params.get('device', None)
        category_param = self.context['request'].query_params.get('category', None)
        if (device_param == 'alexa'):
            if (category_param == '-1'):
                skills = AlexaSkill.objects.filter(id=app.alexa_skill_id)
                return AlexaSkillSerializer(skills, many=True).data
            else:
                skills = AlexaSkill.objects.filter(id=app.alexa_skill_id).filter(category_id=category_param)
                return AlexaSkillSerializer(skills, many=True).data
        elif (device_param == 'google'):
            return []
        elif (device_param == 'unspecification'):
            if (category_param == '-1'):
                skills = AlexaSkill.objects.filter(id=app.alexa_skill_id)
                return AlexaSkillSerializer(skills, many=True).data
            else:
                skills = AlexaSkill.objects.filter(id=app.alexa_skill_id).filter(category_id=category_param)
                return AlexaSkillSerializer(skills, many=True).data
        else:
            return []


    def get_google_assistant_action_review(self, app):
        device_param = self.context['request'].query_params.get('device', None)
        category_param = self.context['request'].query_params.get('category', None)
        if (device_param == 'google'):
            if (category_param == '-1'):
                actions = GoogleAssistantAction.objects.filter(id=app.google_assistant_action_id)
                return GoogleAssistantActionSerializer(actions, many=True).data
            else:
                actions = GoogleAssistantAction.objects.filter(id=app.google_assistant_action_id).filter(category_id=category_param)
                return GoogleAssistantActionSerializer(actions, many=True).data
        elif (device_param == 'alexa'):
            return []
        elif (device_param == 'unspecification'):
            if (category_param == '-1'):
                actions = GoogleAssistantAction.objects.filter(id=app.google_assistant_action_id)
                return GoogleAssistantActionSerializer(actions, many=True).data
            else:
                actions = GoogleAssistantAction.objects.filter(id=app.google_assistant_action_id).filter(category_id=category_param)
                return GoogleAssistantActionSerializer(actions, many=True).data
        else:
            return []


class AlexaReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlexaReview
        fields = '__all__'


class AlexaSkillSerializer(serializers.ModelSerializer):
    utterances = serializers.StringRelatedField(many=True)
    supported_languages = serializers.StringRelatedField(many=True)
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = AlexaSkill
        fields = '__all__'
        depth = 2

    def get_reviews(self, skill):
        skill_reviews = AlexaReview.objects.filter(skill=skill.id)
        return AlexaReviewSerializer(skill_reviews, many=True).data


class AlexaCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AlexaCategory
        fields = ('id', 'url', 'name', 'created_at', 'updated_at')


class AlexaLanguageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AlexaLanguage
        fields = '__all__'


class AlexaAuthorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AlexaAuthor
        fields = '__all__'


class AlexaDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlexaDevice
        fields = '__all__'


class GoogleAssistantAuthorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GoogleAssistantAuthor
        fields = '__all__'


class GoogleAssistantActionSerializer(serializers.ModelSerializer):
    # available_devices = serializers.StringRelatedField(many=True)
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = GoogleAssistantAction
        fields = '__all__'
        depth = 2

    def get_reviews(self, action):
        action_review = GoogleAssistantReview.objects.filter(action=action.id)
        return GoogleAssistantReviewSerializer(action_review, many=True).data


class GoogleAssistantDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoogleAssistantDevice
        fields = '__all__'


class GoogleAssistantReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoogleAssistantReview
        fields = '__all__'

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'

# class DeviceSerializer(serializers.ModelSerializer):
#     alexa_devices = serializers.SerializerMethodField()
#     google_assistant_devices = serializers.SerializerMethodField()
#     class Meta:
#         model = Device
#         fields = ('id', 'alexa_devices', 'google_assistant_devices')
#         depth = 2

#     def get_alexa_devices(self, app):
#         skills = AlexaDevice.objects.all()
#         return AlexaDeviceSerializer(skills, many=True).data

#     def get_google_assistant_devices(self, app):
#         actions = GoogleAssistantDevice.objects.all()
#         return GoogleAssistantDeviceSerializer(actions, many=True).data
