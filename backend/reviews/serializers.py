from datetime import timedelta
from django.apps import apps
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from .models import OrderReview

User = get_user_model()
ServiceRequest = apps.get_model('requests', 'ServiceRequest')


class ReviewerSummarySerializer(serializers.ModelSerializer):
    """Public details of the student who authored the review."""
    avatar = serializers.ImageField(source='profile.avatar', read_only=True)
    department = serializers.CharField(source='profile.department', read_only=True)
    institution_short_code = serializers.CharField(source='profile.institution.short_code', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'avatar',
            'department',
            'institution_short_code',
        ]


class OrderReviewReadSerializer(serializers.ModelSerializer):
    """Public read serializer for reviews shown on service detail pages."""
    reviewer = ReviewerSummarySerializer(read_only=True)
    service_id = serializers.IntegerField(source='service.id', read_only=True)
    service_title = serializers.CharField(source='service.title', read_only=True)

    class Meta:
        model = OrderReview
        fields = [
            'id',
            'service_id',
            'service_title',
            'reviewer',
            'rating',
            'standout_tags',
            'comment',
            'is_verified',
            'created_at',
            'updated_at',
        ]


class OrderReviewCreateSerializer(serializers.ModelSerializer):
    """
    Serializer to submit a review for a completed order.
    Enforces completion status, customer authority, and single-review constraints.
    """
    request_id = serializers.PrimaryKeyRelatedField(
        queryset=ServiceRequest.objects.all(),
        source='request',
        write_only=True
    )

    class Meta:
        model = OrderReview
        fields = [
            'id',
            'request_id',
            'rating',
            'standout_tags',
            'comment',
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        service_request = attrs['request']
        user = self.context['request'].user

        # 1. Authority Guard: Only the customer who hired the service can review it
        if service_request.customer != user:
            raise serializers.ValidationError({
                "request_id": "You can only review orders where you were the hiring customer."
            })

        # 2. Completion Guard: Must be completed
        if service_request.status != 'completed':
            raise serializers.ValidationError({
                "request_id": f"Cannot review an order with status '{service_request.status}'. "
                              "Reviews can only be submitted for completed orders."
            })

        # 3. Duplicate Prevention: Only one review per order
        if hasattr(service_request, 'review'):
            raise serializers.ValidationError({
                "request_id": "A review has already been submitted for this completed order."
            })

        # 4. Standout tags format check
        standout_tags = attrs.get('standout_tags', [])
        if not isinstance(standout_tags, list):
            raise serializers.ValidationError({
                "standout_tags": "Standout tags must be provided as a list of strings."
            })

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        service_request = validated_data['request']

        return OrderReview.objects.create(
            reviewer=user,
            service=service_request.service,
            is_verified=True,
            **validated_data
        )


class OrderReviewUpdateSerializer(serializers.ModelSerializer):
    """
    Allows the reviewer to edit their review within 24 hours of posting.
    """
    class Meta:
        model = OrderReview
        fields = [
            'rating',
            'standout_tags',
            'comment',
        ]

    def validate(self, attrs):
        instance = self.instance

        # 24-hour editing window guard
        if timezone.now() > instance.created_at + timedelta(hours=24):
            raise serializers.ValidationError(
                "This review can no longer be edited. The 24-hour editing window has expired."
            )

        standout_tags = attrs.get('standout_tags')
        if standout_tags is not None and not isinstance(standout_tags, list):
            raise serializers.ValidationError({
                "standout_tags": "Standout tags must be provided as a list of strings."
            })

        return attrs