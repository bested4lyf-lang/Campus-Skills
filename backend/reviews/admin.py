from django.contrib import admin
from .models import OrderReview


@admin.register(OrderReview)
class OrderReviewAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'service',
        'reviewer',
        'rating',
        'is_verified',
        'created_at',
    )
    list_filter = ('rating', 'is_verified', 'created_at')
    search_fields = (
        'service__title',
        'reviewer__username',
        'reviewer__email',
        'comment',
    )
    autocomplete_fields = ['request', 'service', 'reviewer']
    readonly_fields = ('is_verified', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'