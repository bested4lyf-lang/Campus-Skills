from django.contrib import admin
from .models import Category, ServiceListing, ServiceSampleImage


class ServiceSampleImageInline(admin.TabularInline):
    model = ServiceSampleImage
    extra = 1
    fields = ('image', 'caption', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon_name')
    search_fields = ('name', 'icon_name')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ServiceListing)
class ServiceListingAdmin(admin.ModelAdmin):
    inlines = (ServiceSampleImageInline,)
    list_display = (
        'title',
        'provider',
        'category',
        'starting_price',
        'turnaround_time',
        'is_active',
        'created_at',
    )
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = (
        'title',
        'description',
        'skill_tag',
        'provider__username',
        'provider__email',
    )
    list_editable = ('is_active',)
    date_hierarchy = 'created_at'


@admin.register(ServiceSampleImage)
class ServiceSampleImageAdmin(admin.ModelAdmin):
    list_display = ('listing', 'caption', 'created_at')
    search_fields = ('listing__title', 'caption')
    readonly_fields = ('created_at',)