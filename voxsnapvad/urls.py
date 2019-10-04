"""voxsnapvad URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.urls import re_path as url
from rest_framework import routers

from vad.views import (AlexaAuthorViewSet, AlexaCategoryViewSet,
                       AlexaLanguageViewSet, AlexaSkillViewSet,
                       CategoryViewSet, DeviceViewSet,
                       GoogleAssistantActionViewSet,
                       GoogleAssistantAuthorViewSet, VoiceAppViewSet, AlexaReviewViewSet, AlexaDeviceViewSet, GoogleAssistantDeviceViewSet)

router = routers.DefaultRouter()  # pylint: disable=invalid-name
alexa_router = routers.DefaultRouter()  # pylint: disable=invalid-name
google_router = routers.DefaultRouter()  # pylint: disable=invalid-name

router.register(r'apps', VoiceAppViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'devices', DeviceViewSet)
router.register(r'addNewApp', DeviceViewSet)
alexa_router.register(r'authors', AlexaAuthorViewSet)
alexa_router.register(r'reviews', AlexaReviewViewSet)
alexa_router.register(r'categories', AlexaCategoryViewSet)
alexa_router.register(r'languages', AlexaLanguageViewSet)
alexa_router.register(r'skills', AlexaSkillViewSet)
alexa_router.register(r'devices', AlexaDeviceViewSet)
google_router.register(r'actions', GoogleAssistantActionViewSet)
google_router.register(r'authors', GoogleAssistantAuthorViewSet)
google_router.register(r'devices', GoogleAssistantDeviceViewSet)

urlpatterns = [
    url(r'^api/alexa/', include(alexa_router.urls)),
    url(r'^api/google/', include(google_router.urls)),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/',
        include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls),
]
