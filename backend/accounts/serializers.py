from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import ActiveSession, Institution, StudentProfile

User = get_user_model()


# -------------------------------------------------------------
# 1. INSTITUTION & SUMMARY SERIALIZERS
# -------------------------------------------------------------
class InstitutionSerializer(serializers.ModelSerializer):
    """Serializer for campus university options."""
    class Meta:
        model = Institution
        fields = ['id', 'name', 'short_code', 'state']


class StudentProfileSummarySerializer(serializers.ModelSerializer):
    """Embedded public profile details."""
    institution = InstitutionSerializer(read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            'id',
            'institution',
            'department',
            'level',
            'bio',
            'avatar',
            'whatsapp_number',
            'whatsapp_visibility',
            'skills',
            'is_deactivated',
        ]


class UserSummarySerializer(serializers.ModelSerializer):
    """Safe user representation returned on auth and profile lookups."""
    profile = StudentProfileSummarySerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_student',
            'profile',
        ]


# -------------------------------------------------------------
# 2. AUTHENTICATION SERIALIZERS
# -------------------------------------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    """
    Student registration serializer.
    Creates User and linked StudentProfile in a single atomic transaction.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    institution_id = serializers.PrimaryKeyRelatedField(
        queryset=Institution.objects.all(),
        source='institution',
        required=False,
        allow_null=True
    )
    department = serializers.CharField(max_length=150, required=True)
    level = serializers.CharField(max_length=50, required=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'institution_id',
            'department',
            'level',
        ]

    def create(self, validated_data):
        institution = validated_data.pop('institution', None)
        department = validated_data.pop('department')
        level = validated_data.pop('level')
        password = validated_data.pop('password')

        with transaction.atomic():
            user = User.objects.create_user(
                password=password,
                is_student=True,
                **validated_data
            )
            StudentProfile.objects.create(
                user=user,
                institution=institution,
                department=department,
                level=level,
            )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Enhanced JWT login serializer.
    Allows login via username OR email, and attaches student profile to the response.
    """
    def validate(self, attrs):
        login_input = attrs.get('username')
        if login_input and '@' in login_input:
            user_obj = User.objects.filter(email__iexact=login_input).first()
            if user_obj:
                attrs['username'] = user_obj.username

        data = super().validate(attrs)
        user_serializer = UserSummarySerializer(self.user)
        data['user'] = user_serializer.data
        return data


# -------------------------------------------------------------
# 3. PROFILE & SETTINGS SERIALIZERS
# -------------------------------------------------------------
class StudentProfileUpdateSerializer(serializers.ModelSerializer):
    """Update public student profile and basic name fields."""
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    institution_id = serializers.PrimaryKeyRelatedField(
        queryset=Institution.objects.all(),
        source='institution',
        required=False,
        allow_null=True
    )

    class Meta:
        model = StudentProfile
        fields = [
            'first_name',
            'last_name',
            'institution_id',
            'department',
            'level',
            'bio',
            'avatar',
            'whatsapp_number',
            'skills',
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            for attr, val in user_data.items():
                setattr(user, attr, val)
            user.save()
        return super().update(instance, validated_data)


class PrivacySettingsSerializer(serializers.ModelSerializer):
    """Manage WhatsApp visibility and deactivation toggle."""
    class Meta:
        model = StudentProfile
        fields = ['whatsapp_visibility', 'is_deactivated']


class ChangePasswordSerializer(serializers.Serializer):
    """Validate current password and set new password securely."""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password]
    )

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, attrs):
        if attrs['old_password'] == attrs['new_password']:
            raise serializers.ValidationError({
                "new_password": "New password cannot be the same as the current password."
            })
        return attrs


class ActiveSessionSerializer(serializers.ModelSerializer):
    """Read-only view of active user sessions."""
    class Meta:
        model = ActiveSession
        fields = ['id', 'device_label', 'ip_address', 'location', 'last_active']
        read_only_fields = ['id', 'ip_address', 'location', 'last_active']


class DeleteAccountSerializer(serializers.Serializer):
    """Safeguard confirmation for permanent account deletion."""
    password = serializers.CharField(required=True, write_only=True)
    confirm_text = serializers.CharField(required=True, write_only=True)

    def validate_confirm_text(self, value):
        if value != "DELETE":
            raise serializers.ValidationError("You must type 'DELETE' to confirm account deletion.")
        return value

    def validate_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect password.")
        return value