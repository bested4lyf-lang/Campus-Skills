from django.urls import path
from .views import (
    NotificationFeedView,
    UnreadNotificationCountView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
)

app_name = 'notifications'

urlpatterns = [
    # Notification Feed (GET /api/notifications/)
    path('', NotificationFeedView.as_view(), name='feed'),

    # Navbar Badge Counter (GET /api/notifications/unread-count/)
    path('unread-count/', UnreadNotificationCountView.as_view(), name='unread_count'),

    # Mark Single Notification Read (PATCH /api/notifications/<id>/read/)
    path('<int:pk>/read/', MarkNotificationReadView.as_view(), name='mark_read'),

    # Mark All Read (POST /api/notifications/mark-all-read/)
    path('mark-all-read/', MarkAllNotificationsReadView.as_view(), name='mark_all_read'),
]