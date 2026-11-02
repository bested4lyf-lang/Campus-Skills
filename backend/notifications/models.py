from django.conf import settings
from django.db import models


class Notification(models.Model):
    """
    In-app alert notification delivered to a student.
    Powers the top navigation bell dropdown.
    """
    EVENT_CHOICES = (
        ('request_received', 'New Request Received'),
        ('request_accepted', 'Request Accepted'),
        ('request_rejected', 'Request Declined'),
        ('request_completed', 'Work Marked as Completed'),
        ('review_received', 'New Review Received'),
    )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    event_type = models.CharField(
        max_length=30,
        choices=EVENT_CHOICES,
        help_text="Machine identifier for the notification event"
    )
    title = models.CharField(max_length=255)
    message = models.TextField(help_text="Short explanatory description for the student")
    deep_link = models.CharField(
        max_length=255,
        default='/activity',
        help_text="Frontend route to navigate upon clicking the notification"
    )
    is_read = models.BooleanField(
        default=False,
        help_text="Tracks whether the student has viewed or cleared this alert"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Alert to {self.recipient.username}: {self.title}"