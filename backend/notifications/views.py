from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationFeedView(APIView):
    """
    GET /api/notifications/
    Returns the authenticated student's notifications feed with unread count.
    Supports ?limit=10 (defaults to 10 most recent).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        limit = int(request.query_params.get('limit', 10))

        queryset = Notification.objects.filter(recipient=user)
        unread_count = queryset.filter(is_read=False).count()
        recent_notifications = queryset[:limit]

        serializer = NotificationSerializer(recent_notifications, many=True)
        return Response(
            {
                "unread_count": unread_count,
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class UnreadNotificationCountView(APIView):
    """
    GET /api/notifications/unread-count/
    Lightweight endpoint for rendering the navbar bell counter badge.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        return Response({"unread_count": count}, status=status.HTTP_200_OK)


class MarkNotificationReadView(APIView):
    """
    PATCH /api/notifications/<id>/read/
    Marks a specific notification as read.
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
        notification.is_read = True
        notification.save(update_fields=['is_read'])

        return Response(
            {"message": "Notification marked as read.", "id": notification.id},
            status=status.HTTP_200_OK,
        )


class MarkAllNotificationsReadView(APIView):
    """
    POST /api/notifications/mark-all-read/
    Marks all unread notifications for the student as read in a single batch.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        updated_count = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).update(is_read=True)

        return Response(
            {"message": f"All {updated_count} notifications marked as read.", "unread_count": 0},
            status=status.HTTP_200_OK,
        )