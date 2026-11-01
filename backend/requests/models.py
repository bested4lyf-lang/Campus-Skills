# Create your models here.
import os
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from decimal import Decimal


class ServiceRequest(models.Model):
    """
    Transactional order between a student customer and a student provider.
    Governed by a strict state machine: pending -> accepted -> completed / rejected.
    """
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('accepted', 'Accepted - In Progress'),
        ('rejected', 'Declined'),
        ('completed', 'Completed'),
    )

    service = models.ForeignKey(
        'services.ServiceListing',
        on_delete=models.CASCADE,
        related_name='requests'
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='purchased_requests'
    )
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_requests'
    )
    agreed_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('500.00'))],
        help_text="Agreed service price in Nigerian Naira (₦)"
    )
    project_brief = models.TextField(
        help_text="Student's notes, custom requirements, and instructions"
    )
    needed_by = models.DateTimeField(
        help_text="Requested deadline date and time",
        null=True,
        blank=True
    )
    campus_location = models.CharField(
        max_length=255,
        blank=True,
        help_text="e.g. Faculty of Arts Amphitheatre, Moremi Hall, Library Quad"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    rejection_reason = models.TextField(
        blank=True,
        help_text="Optional note explaining why the provider declined the request"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Req #{self.id}: {self.service.title} ({self.customer.username} -> {self.provider.username}) [{self.status}]"


class RequestAttachment(models.Model):
    """Files attached to a project brief (e.g. sample designs, reference docs)."""
    request = models.ForeignKey(
        ServiceRequest,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file = models.FileField(upload_to='request_brief_files/')
    file_name = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def save(self, *args, **kwargs):
        if not self.file_name and self.file:
            self.file_name = os.path.basename(self.file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Attachment: {self.file_name or self.file.name} (Req #{self.request.id})"