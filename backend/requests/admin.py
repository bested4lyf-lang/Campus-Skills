from django.contrib import admin
from .models import ServiceRequest, RequestAttachment


class RequestAttachmentInline(admin.TabularInline):
    model = RequestAttachment
    extra = 0
    fields = ('file', 'file_name', 'uploaded_at')
    readonly_fields = ('uploaded_at',)


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    inlines = (RequestAttachmentInline,)
    list_display = (
        'id',
        'service',
        'customer',
        'provider',
        'agreed_price',
        'status',
        'campus_location',
        'needed_by',
        'created_at',
    )
    list_filter = ('status', 'created_at', 'needed_by')
    search_fields = (
        'id',
        'service__title',
        'customer__username',
        'customer__email',
        'provider__username',
        'provider__email',
        'campus_location',
        'project_brief',
    )
    autocomplete_fields = ['service', 'customer', 'provider']
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'


@admin.register(RequestAttachment)
class RequestAttachmentAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'request', 'uploaded_at')
    search_fields = ('file_name', 'request__service__title')
    readonly_fields = ('uploaded_at',)