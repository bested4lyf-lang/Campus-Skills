from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models



class OrderReview(models.Model):
    """
    Verified customer review and rating tied strictly to a completed ServiceRequest.
    """
    request = models.OneToOneField(
        'requests.ServiceRequest',
        on_delete=models.CASCADE,
        related_name='review'
    )
    service = models.ForeignKey(
        'services.ServiceListing',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='written_reviews'
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating score from 1 (lowest) to 5 (highest) stars"
    )
    standout_tags = models.JSONField(
        default=list,
        blank=True,
        help_text="Standout quality chips, e.g. ['Clear communication', 'On time', 'Great quality']"
    )
    comment = models.TextField(
        max_length=500,
        blank=True,
        help_text="Student's written feedback or testimonial (max 500 characters)"
    )
    is_verified = models.BooleanField(
        default=True,
        help_text="Verified badge indicating this review comes from a completed platform order"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review ({self.rating}★) for {self.service.title} by {self.reviewer.username}"