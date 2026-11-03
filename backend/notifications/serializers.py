from django.utils import timezone
from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for in-app alert notifications in the top bar bell dropdown.
    """
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id',
            'event_type',
            'title',
            'message',
            'deep_link',
            'is_read',
            'created_at',
            'time_ago',
        ]
        read_only_fields = [
            'id',
            'event_type',
            'title',
            'message',
            'deep_link',
            'created_at',
        ]

    def get_time_ago(self, obj):
        """
        Calculates exact seconds (0-59s) before transitioning to minutes, hours, and days.
        """
        now = timezone.now()
        diff = now - obj.created_at
        seconds = max(0, int(diff.total_seconds()))

        # Under 10 seconds
        if seconds < 10:
            return "Just now"

        # 10 to 59 seconds
        if seconds < 60:
            return f"{seconds} seconds ago"

        # Minutes
        minutes = seconds // 60
        if minutes == 1:
            return "1 minute ago"
        if minutes < 60:
            return f"{minutes} minutes ago"

        # Hours
        hours = minutes // 60
        if hours == 1:
            return "1 hour ago"
        if hours < 24:
            return f"{hours} hours ago"

        # Days
        days = hours // 24
        if days == 1:
            return "Yesterday"
        if days < 7:
            return f"{days} days ago"

        return obj.created_at.strftime("%b %d, %Y")