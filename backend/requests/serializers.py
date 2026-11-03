from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework import serializers

from services.models import ServiceListing
from services.serializers import CategorySerializer
from .models import ServiceRequest, RequestAttachment

User = get_user_model()


# -------------------------------------------------------------
# 1. ATTACHMENT SERIALIZER
# -------------------------------------------------------------
class RequestAttachmentSerializer(serializers.ModelSerializer):
    """File attachment linked to a project brief."""
    class Meta:
        model = RequestAttachment
        fields = ['id', 'file', 'file_name', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


# -------------------------------------------------------------
# 2. PRIVACY-AWARE CONTACT SERIALIZER
# -------------------------------------------------------------
class OrderStudentContactSerializer(serializers.ModelSerializer):
    """Student profile snapshot with conditional WhatsApp contact visibility."""
    avatar = serializers.ImageField(source='profile.avatar', read_only=True)
    institution_short_code = serializers.CharField(source='profile.institution.short_code', read_only=True)
    department = serializers.CharField(source='profile.department', read_only=True)
    whatsapp_number = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'avatar',
            'institution_short_code',
            'department',
            'whatsapp_number',
        ]

    def get_whatsapp_number(self, obj):
        profile = getattr(obj, 'profile', None)
        if not profile or not profile.whatsapp_number:
            return ""

        # If user made their contact fully public
        if profile.whatsapp_visibility == 'public':
            return profile.whatsapp_number

        # If user restricted contact to accepted requests only
        if profile.whatsapp_visibility == 'accepted_only':
            service_request = self.context.get('service_request')
            if service_request and service_request.status in ['accepted', 'completed']:
                return profile.whatsapp_number

        return ""


# -------------------------------------------------------------
# 3. EMBEDDED SERVICE SNAPSHOT
# -------------------------------------------------------------
class ServiceListingSnapshotSerializer(serializers.ModelSerializer):
    """Lightweight summary of the service being booked."""
    category = CategorySerializer(read_only=True)

    class Meta:
        model = ServiceListing
        fields = ['id', 'title', 'skill_tag', 'cover_image', 'category']


# -------------------------------------------------------------
# 4. ORDER CREATION SERIALIZER
# -------------------------------------------------------------
class ServiceRequestCreateSerializer(serializers.ModelSerializer):
    """Handles order placement and brief submission by customer."""
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=ServiceListing.objects.filter(is_active=True),
        source='service',
        write_only=True
    )
    agreed_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        min_value=Decimal('500.00')
    )

    class Meta:
        model = ServiceRequest
        fields = [
            'id',
            'service_id',
            'agreed_price',
            'project_brief',
            'needed_by',
            'campus_location',
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        service = attrs['service']
        user = self.context['request'].user

        # Self-request prevention guard
        if service.provider == user:
            raise serializers.ValidationError({
                "service_id": "You cannot book or order your own service listing."
            })

        # Default agreed_price to service starting price if omitted
        if not attrs.get('agreed_price'):
            attrs['agreed_price'] = service.starting_price

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        service = validated_data['service']
        return ServiceRequest.objects.create(
            customer=user,
            provider=service.provider,
            **validated_data
        )


# -------------------------------------------------------------
# 5. ORDER DETAIL & PIPELINE READ SERIALIZER
# -------------------------------------------------------------
class ServiceRequestDetailSerializer(serializers.ModelSerializer):
    """Full order view for customer 'My Hires' and provider 'Client Work' tabs."""
    service = ServiceListingSnapshotSerializer(read_only=True)
    customer = serializers.SerializerMethodField()
    provider = serializers.SerializerMethodField()
    attachments = RequestAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceRequest
        fields = [
            'id',
            'service',
            'customer',
            'provider',
            'agreed_price',
            'project_brief',
            'needed_by',
            'campus_location',
            'status',
            'rejection_reason',
            'attachments',
            'created_at',
            'updated_at',
        ]

    def get_customer(self, obj):
        serializer = OrderStudentContactSerializer(
            obj.customer,
            context={'service_request': obj, 'request': self.context.get('request')}
        )
        return serializer.data

    def get_provider(self, obj):
        serializer = OrderStudentContactSerializer(
            obj.provider,
            context={'service_request': obj, 'request': self.context.get('request')}
        )
        return serializer.data


# -------------------------------------------------------------
# 6. STATE TRANSITION SERIALIZER
# -------------------------------------------------------------
class ServiceRequestStatusUpdateSerializer(serializers.ModelSerializer):
    """Enforces legal state machine transitions for providers."""
    status = serializers.ChoiceField(choices=['accepted', 'rejected', 'completed'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = ServiceRequest
        fields = ['status', 'rejection_reason']

    def validate(self, attrs):
        instance = self.instance
        new_status = attrs.get('status')
        current_status = instance.status

        # Strict transition rules
        if current_status == 'pending':
            if new_status not in ['accepted', 'rejected']:
                raise serializers.ValidationError(
                    f"A pending request can only transition to 'accepted' or 'rejected', not '{new_status}'."
                )
        elif current_status == 'accepted':
            if new_status != 'completed':
                raise serializers.ValidationError(
                    f"An accepted request can only transition to 'completed', not '{new_status}'."
                )
        elif current_status in ['rejected', 'completed']:
            raise serializers.ValidationError(
                f"This order is already {current_status} and its status cannot be modified."
            )

        return attrs