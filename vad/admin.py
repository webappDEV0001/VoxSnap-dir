from django.contrib import admin
from django.db.models.base import ModelBase

import vad.models


def admin_site_register_models_from_module(module, ignore_classes=None):
    """module must be module not a string"""
    if not ignore_classes:
        ignore_classes = []
    for key, name in sorted(module.__dict__.items()):
        if key in ignore_classes:
            continue

        clz = getattr(module, key)

        if (not clz or not isinstance(clz, ModelBase) or clz._meta.swapped
                or clz._meta.abstract):
            continue

        admin.site.register(name)


@admin.register(vad.models.GoogleAssistantAction)
class GoogleAssistantActionAdmin(admin.ModelAdmin):
    search_fields = ('name', 'description', 'available_devices__display_name',
                     'author__name')
    list_display = ('name', 'author', 'category', 'updated_at')
    ordering = ('-updated_at', )


@admin.register(vad.models.GoogleAssistantAuthor)
class GoogleAssistantAuthorAdmin(admin.ModelAdmin):
    search_fields = ('name', )
    ordering = ('-updated_at', )
    list_display = ('name', 'updated_at')


@admin.register(vad.models.GoogleAssistantReview)
class GoogleAssistantReviewAdmin(admin.ModelAdmin):
    search_fields = ('username', 'text', 'action__name')
    ordering = ('-updated_at', )
    list_display = ('__str__', 'rating', 'username', 'action', 'updated_at')
    sortable_by = ('__str__', 'rating', 'username', 'action', 'updated_at')


admin_site_register_models_from_module(vad.models,
                                       ignore_classes=frozenset([
                                           'GoogleAssistantAction',
                                           'GoogleAssistantAuthor',
                                           'GoogleAssistantReview'
                                       ]))
