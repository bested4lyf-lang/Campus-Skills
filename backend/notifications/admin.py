from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'recipient',
        'event_type',
        'title',
        'is_read',
        'created_at',
    )
    list_filter = ('event_type', 'is_read', 'created_at')
    search_fields = (
        'recipient__username',
        'recipient__email',
        'title',
        'message',
    )
    autocomplete_fields = ['recipient']
    readonly_fields = ('created_at',)
    list_editable = ('is_read',)
    date_hierarchy = 'created_at'