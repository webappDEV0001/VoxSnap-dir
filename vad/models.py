from typing import Any, List, Optional

from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Device(models.Model):
    name = models.CharField(max_length=128, default='')
    description = models.TextField(null=True)
    # price = models.DecimalField(blank=True, decimal_places=2, max_digits=4, default=0)

    def __str__(self):
        return self.name

# class Device(models.Model):

#     def __str__(self):
#         return self.id


class AlexaLanguage(models.Model):
    display_name = models.CharField(max_length=128, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.display_name


class AlexaAuthor(models.Model):
    name = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class AlexaCategory(models.Model):
    name = models.CharField(max_length=64, unique=True)
    parent = models.ForeignKey('AlexaCategory', on_delete=models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class AlexaDevice(models.Model):
    name = models.CharField(max_length=128, default='Alexa Device')
    description = models.TextField(blank=True)
    price = models.DecimalField(blank=True, decimal_places=2, max_digits=4, default=0)
    display_name = models.CharField(max_length=128, unique=True)
    image_url = models.URLField(null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('display_name', 'image_url')

    def __str__(self):
        return self.display_name


class AlexaSkill(models.Model):
    title = models.CharField(max_length=128)
    description = models.TextField()
    category = models.ForeignKey(Category,
                                 on_delete=models.CASCADE,
                                 null=True)
    supported_languages = models.ManyToManyField(AlexaLanguage)
    original_url = models.URLField(unique=True)
    image = models.URLField(null=True, blank=True)
    price = models.DecimalField(blank=True,
                                decimal_places=2,
                                max_digits=4,
                                null=True)
    is_free = models.BooleanField(default=False)
    asin = models.CharField(max_length=64, unique=True)
    author = models.ForeignKey(AlexaAuthor,
                               on_delete=models.DO_NOTHING,
                               null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    #for ElasticSearch
    added_elastic = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class AlexaReview(models.Model):
    skill = models.ForeignKey(AlexaSkill, on_delete=models.CASCADE, null=True)
    rating = models.IntegerField()
    title = models.CharField(max_length=128)
    username = models.CharField(max_length=64, null=True)
    text = models.TextField()
    avatar_url = models.URLField(null=True)
    found_helpful_count = models.IntegerField(null=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class AlexaSkillUtterance(models.Model):
    skill = models.ForeignKey(AlexaSkill,
                              on_delete=models.CASCADE,
                              related_name='utterances')
    utterance = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('skill', 'utterance')

    def __str__(self):
        return self.utterance


class GoogleAssistantDevice(models.Model):
    name = models.CharField(max_length=128, default='Google Device')
    description = models.TextField(null=True)
    price = models.DecimalField(blank=True, decimal_places=2, max_digits=4, default=0)
    display_name = models.CharField(max_length=128, unique=True)
    image_url = models.URLField(null=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('display_name', 'image_url')

    def __str__(self):
        return self.display_name


class GoogleAssistantAuthor(models.Model):
    name = models.CharField(max_length=128, null=True)
    email = models.EmailField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('name', 'email')

    def __str__(self):
        if not self.name and not self.email:
            return '(no name)'
        if self.name:
            return self.name
        return self.email


class GoogleAssistantAction(models.Model):
    author = models.ForeignKey(GoogleAssistantAuthor,
                               null=True,
                               on_delete=models.DO_NOTHING)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    system_name = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=128)
    description = models.TextField()
    # available_devices = models.ManyToManyField(GoogleAssistantDevice)
    original_url = models.URLField(unique=True)
    icon_url = models.URLField(null=True, unique=True, max_length=255)
    image_url = models.URLField(null=True, unique=True, max_length=255)
    privacy_policy_url = models.URLField(null=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    #for ElasticSearch
    added_elastic = models.BooleanField(default=False)

    class Meta:
        unique_together = ('system_name', 'original_url')

    def populate_from_api_info(self, info: List[Any], uid: Optional[str]):
        self.system_name = info[2]
        self.description = info[4][5]
        self.icon_url = info[4][3]
        self.image_url = info[4][2] or None
        self.privacy_policy_url = info[4][11][:255] or None
        self.name = info[4][1]
        if uid:
            self.original_url = (
                f'https://assistant.google.com/services/a/{uid}')

    def __str__(self):
        return self.name


class GoogleAssistantUtterance(models.Model):
    action = models.ForeignKey(GoogleAssistantAction,
                               on_delete=models.CASCADE,
                               related_name='utterances')
    utterance = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('action', 'utterance')

    def __str__(self):
        return self.utterance


class GoogleAssistantReview(models.Model):
    action = models.ForeignKey(GoogleAssistantAction, on_delete=models.CASCADE)
    rating = models.IntegerField()
    username = models.CharField(max_length=64)
    avatar_url = models.URLField()
    text = models.TextField()
    unique_id = models.CharField(unique=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if len(self.text) < 30:
            return self.text
        return self.text[:30] + '...'


class VoiceApp(models.Model):
    google_assistant_action = models.ForeignKey(GoogleAssistantAction,
                                                on_delete=models.SET_NULL,
                                                null=True)
    alexa_skill = models.ForeignKey(AlexaSkill,
                                    on_delete=models.SET_NULL,
                                    null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.alexa_skill.name


class NewApp(models.Model):

    alexa_url = models.CharField(max_length=255)
    google_url = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email
