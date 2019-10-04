from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

from .models import (AlexaAuthor, AlexaCategory, AlexaLanguage, AlexaReview,
                     AlexaSkill, Category, Device, GoogleAssistantAction,
                     GoogleAssistantAuthor, GoogleAssistantReview, VoiceApp, AlexaDevice, GoogleAssistantDevice)

from .serializer import (DeviceSerializer, VoiceAppSerializer, AlexaReviewSerializer, AlexaSkillSerializer,
                     AlexaCategorySerializer, AlexaLanguageSerializer, AlexaAuthorSerializer, GoogleAssistantAuthorSerializer,
                     GoogleAssistantActionSerializer, GoogleAssistantReviewSerializer, CategorySerializer, AlexaDeviceSerializer, GoogleAssistantDeviceSerializer)



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class VoiceAppViewSet(viewsets.ModelViewSet):

    queryset = VoiceApp.objects.all()
    serializer_class = VoiceAppSerializer
    def get_queryset(self):
        device = self.request.query_params.get('device', None)
        category = self.request.query_params.get('category', None)
        searchText = self.request.query_params.get('searchText', '')
        if (device and device == 'alexa'):
            if (category == '-1'):
                queryset = VoiceApp.objects.exclude(alexa_skill_id__isnull=True).filter(alexa_skill__title__icontains=searchText)
            else:
                queryset = VoiceApp.objects.exclude(alexa_skill_id__isnull=True).filter(alexa_skill__category_id=category).filter(alexa_skill__title__icontains=searchText)
        elif (device and device == 'google'):
            if (category == '-1'):
                queryset = VoiceApp.objects.exclude(google_assistant_action_id__isnull=True).filter(google_assistant_action__name__icontains=searchText)
            else:
                queryset = VoiceApp.objects.exclude(google_assistant_action_id__isnull=True).filter(google_assistant_action__category_id=category).filter(google_assistant_action__name__icontains=searchText)
        else:
            if (category == '-1'):
                queryset = VoiceApp.objects.all().filter(alexa_skill__title__icontains=searchText) | VoiceApp.objects.all().filter(google_assistant_action__name__icontains=searchText)
            else:
                queryset = (VoiceApp.objects.all().filter(google_assistant_action__category_id=category) | VoiceApp.objects.all().filter(alexa_skill__category_id=category)) & (VoiceApp.objects.all().filter(alexa_skill__title__icontains=searchText) | VoiceApp.objects.all().filter(google_assistant_action__name__icontains=searchText))

        return queryset


class AlexaReviewViewSet(viewsets.ModelViewSet):
    queryset = AlexaReview.objects.all()
    serializer_class = AlexaReviewSerializer


class AlexaSkillViewSet(viewsets.ModelViewSet):
    queryset = AlexaSkill.objects.all()
    serializer_class = AlexaSkillSerializer


class LargeResultsSetPagination(PageNumberPagination):
    page_size = None
    page_size_query_param = 'page_size'
    max_page_size = None


class AlexaCategoryViewSet(viewsets.ModelViewSet):
    queryset = AlexaCategory.objects.all()
    pagination_class = LargeResultsSetPagination
    serializer_class = AlexaCategorySerializer


class AlexaLanguageViewSet(viewsets.ModelViewSet):
    queryset = AlexaLanguage.objects.all()
    serializer_class = AlexaLanguageSerializer


class AlexaAuthorViewSet(viewsets.ModelViewSet):
    queryset = AlexaAuthor.objects.all()
    serializer_class = AlexaAuthorSerializer


class AlexaDeviceViewSet(viewsets.ModelViewSet):
    queryset = AlexaDevice.objects.all()
    serializer_class = AlexaDeviceSerializer


class GoogleAssistantAuthorViewSet(viewsets.ModelViewSet):
    queryset = GoogleAssistantAuthor.objects.all()
    serializer_class = GoogleAssistantAuthorSerializer


class GoogleAssistantDeviceViewSet(viewsets.ModelViewSet):
    queryset = GoogleAssistantDevice.objects.all()
    serializer_class = GoogleAssistantDeviceSerializer


class GoogleAssistantActionViewSet(viewsets.ModelViewSet):
    queryset = GoogleAssistantAction.objects.order_by('-updated_at')
    serializer_class = GoogleAssistantActionSerializer


class GoogleAssistantReviewViewSet(viewsets.ModelViewSet):
    queryset = GoogleAssistantReview.objects.all()
    serializer_class = GoogleAssistantReviewSerializer
