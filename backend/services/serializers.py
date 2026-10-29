from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, ServiceListing, ServiceSampleImage

User = get_user_model()


# -------------------------------------------------------------
# 1. CATEGORY & GALLERY SERIALIZERS
# -------------------------------------------------------------
class CategorySerializer(serializers.ModelSerializer):
    """Marketplace category with Lucide icon identifier."""
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon_name']


class ServiceSampleImageSerializer(serializers.ModelSerializer):
    """Supplementary portfolio sample images."""
    class Meta:
        model = ServiceSampleImage
        fields = ['id', 'image', 'caption', 'created_at']
        read_only_fields = ['id', 'created_at']


# -------------------------------------------------------------
# 2. EMBEDDED PROVIDER SERIALIZER
# -------------------------------------------------------------
class ProviderSummarySerializer(serializers.ModelSerializer):
    """Student provider card details embedded in listings."""
    avatar = serializers.ImageField(source='profile.avatar', read_only=True)
    institution_name = serializers.CharField(source='profile.institution.name', read_only=True)
    institution_short_code = serializers.CharField(source='profile.institution.short_code', read_only=True)
    department = serializers.CharField(source='profile.department', read_only=True)
    level = serializers.CharField(source='profile.level', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'avatar',
            'institution_name',
            'institution_short_code',
            'department',
            'level',
        ]


# -------------------------------------------------------------
# 3. LISTING READ SERIALIZERS (CATALOG & DETAIL)
# -------------------------------------------------------------
class ServiceListingListSerializer(serializers.ModelSerializer):
    """Lightweight serializer optimized for 16:9 marketplace discovery cards."""
    provider = ProviderSummarySerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = ServiceListing
        fields = [
            'id',
            'title',
            'skill_tag',
            'starting_price',
            'turnaround_time',
            'cover_image',
            'is_active',
            'category',
            'provider',
            'created_at',
        ]


class ServiceListingDetailSerializer(serializers.ModelSerializer):
    """Comprehensive serializer for service detail and purchasing screens."""
    provider = ProviderSummarySerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    gallery_images = ServiceSampleImageSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceListing
        fields = [
            'id',
            'title',
            'skill_tag',
            'description',
            'starting_price',
            'turnaround_time',
            'cover_image',
            'gallery_images',
            'is_active',
            'category',
            'provider',
            'created_at',
            'updated_at',
        ]


# -------------------------------------------------------------
# 4. LISTING WRITE SERIALIZER (CREATE / UPDATE)
# -------------------------------------------------------------
class ServiceListingCreateUpdateSerializer(serializers.ModelSerializer):
    """Handles listing creation and updates by authenticated students."""
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    starting_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('500.00')
    )

    class Meta:
        model = ServiceListing
        fields = [
            'id',
            'title',
            'category_id',
            'skill_tag',
            'description',
            'starting_price',
            'turnaround_time',
            'cover_image',
            'is_active',
        ]
        read_only_fields = ['id']