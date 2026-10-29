from decimal import Decimal
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Category(models.Model):
    """Marketplace categories (e.g. Tech, Design, Tutoring, Hairdressing)."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    icon_name = models.CharField(
        max_length=50,
        blank=True,
        help_text="Lucide icon identifier (e.g., 'code', 'palette', 'camera', 'scissors')"
    )

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class ServiceListing(models.Model):
    """A freelance service or skill offered by a campus student."""
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='services'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='listings'
    )
    title = models.CharField(max_length=200)
    skill_tag = models.CharField(
        max_length=100,
        help_text="Primary skill tag (e.g., 'Graphic Design', 'Calculus Tutoring')"
    )
    description = models.TextField(max_length=1500)
    starting_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('500.00'))],
        help_text="Starting price in Nigerian Naira (₦, minimum ₦500)"
    )
    turnaround_time = models.CharField(
        max_length=100,
        default="Estimated 2-3 days",
        help_text="e.g. 'Same day', '2-3 days', 'Within 1 week'"
    )
    cover_image = models.ImageField(upload_to='service_covers/', blank=True, null=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Student can pause listing when busy with exams/classes"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - ₦{self.starting_price} ({self.provider.username})"


class ServiceSampleImage(models.Model):
    """Supplementary portfolio gallery samples for a service."""
    listing = models.ForeignKey(
        ServiceListing,
        on_delete=models.CASCADE,
        related_name='gallery_images'
    )
    image = models.ImageField(upload_to='service_gallery/')
    caption = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Gallery Image for {self.listing.title}"