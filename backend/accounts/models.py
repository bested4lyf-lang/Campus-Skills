from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models


class User(AbstractUser):
    """
    Standard Custom User.
    Every registered user is a Student.
    Both Provider and Customer capabilities are inherent to all students.
    """
    email = models.EmailField(unique=True)
    is_student = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.username} ({self.get_full_name()})"


class Institution(models.Model):
    """Campus / University registry."""
    name = models.CharField(max_length=255, unique=True)
    short_code = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=100)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class StudentProfile(models.Model):
    """Public student identity and portfolio settings."""
    WHATSAPP_VISIBILITY_CHOICES = (
        ('accepted_only', 'Only show to accepted requests'),
        ('public', 'Show on public profile'),
        ('private', 'Keep private'),
    )

    phone_regex = RegexValidator(
        regex=r'^\+?234?\d{10}$|^0\d{10}$',
        message="Phone number must be entered in the format: '+2348012345678' or '08012345678'."
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    institution = models.ForeignKey(
        Institution,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='students'
    )
    department = models.CharField(max_length=150, help_text="e.g. Mass Communication, Computer Science")
    level = models.CharField(max_length=50, help_text="e.g. 100 Level, 300 Level, Postgraduate")
    bio = models.TextField(max_length=160, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    whatsapp_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    whatsapp_visibility = models.CharField(
        max_length=20,
        choices=WHATSAPP_VISIBILITY_CHOICES,
        default='accepted_only'
    )
    skills = models.JSONField(
        default=list,
        blank=True,
        help_text="List of string skills e.g. ['Photography', 'Figma']"
    )
    is_deactivated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


class ActiveSession(models.Model):
    """Security audit: active devices and login locations."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    device_label = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    location = models.CharField(max_length=150, default="Lagos, NG")
    last_active = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_active']

    def __str__(self):
        return f"{self.user.username} - {self.device_label}"

class BankPayoutInfo(models.Model):
    """
    NUBAN bank payout information for students receiving peer payments.
    """
    SUPPORTED_BANKS = (
        # Top Commercial Tier-1 & Tier-2 Banks
        ('access', 'Access Bank'),
        ('firstbank', 'First Bank of Nigeria'),
        ('gtbank', 'Guaranty Trust Bank (GTBank)'),
        ('uba', 'United Bank for Africa (UBA)'),
        ('zenith', 'Zenith Bank'),
        ('fcmb', 'First City Monument Bank (FCMB)'),
        ('fidelity', 'Fidelity Bank'),
        ('polaris', 'Polaris Bank'),
        ('stanbic', 'Stanbic IBTC Bank'),
        ('standard_chartered', 'Standard Chartered Bank'),
        ('sterling', 'Sterling Bank'),
        ('union', 'Union Bank of Nigeria'),
        ('unity', 'Unity Bank'),
        ('wema', 'Wema Bank'),
        ('ecobank', 'Ecobank Nigeria'),
        ('keystone', 'Keystone Bank'),
        ('providus', 'Providus Bank'),
        ('titan', 'Titan Trust Bank'),
        ('heritage', 'Heritage Bank'),
        ('citibank', 'Citibank Nigeria'),
        # Popular Student Digital Neobanks & MFBs
        ('opay', 'OPay'),
        ('palmpay', 'PalmPay'),
        ('kuda', 'Kuda Bank'),
        ('moniepoint', 'Moniepoint MFB'),
        ('mintyn', 'Mintyn Bank'),
        ('fairmoney', 'FairMoney MFB'),
        ('carbon', 'Carbon'),
        ('vfd', 'VFD Microfinance Bank (VBank)'),
        # Non-Interest Islamic Banks
        ('jaiz', 'Jaiz Bank'),
        ('lotus', 'Lotus Bank'),
        ('taj', 'TAJBank'),
        ('other', 'Other Licensed Financial Institution'),
    )

    nuban_validator = RegexValidator(
        regex=r'^\d{10}$',
        message="NUBAN account number must be exactly 10 numerical digits."
    )

    student = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='payout_info'
    )
    bank_name = models.CharField(
        max_length=50,
        choices=SUPPORTED_BANKS,
        help_text="Select recipient Nigerian bank"
    )
    bank_code = models.CharField(max_length=20, blank=True)
    account_number = models.CharField(
        max_length=10,
        validators=[nuban_validator],
        help_text="10-digit NUBAN account number"
    )
    account_name = models.CharField(
        max_length=200,
        help_text="Verified name matching student bank records"
    )
    pending_payout_balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Bank Payout Information"
        verbose_name_plural = "Bank Payout Information"

    def __str__(self):
        return f"{self.student.username} - {self.get_bank_name_display()} ({self.account_number})"