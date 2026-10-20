from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import ActiveSession, Institution, StudentProfile
from .serializers import (
    ActiveSessionSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    DeleteAccountSerializer,
    InstitutionSerializer,
    PrivacySettingsSerializer,
    RegisterSerializer,
    StudentProfileSummarySerializer,
    StudentProfileUpdateSerializer,
    UserSummarySerializer,
)


def get_client_ip(request):
    """Utility to extract client IP address."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '127.0.0.1')


def record_active_session(user, request):
    """Helper to record or audit active login sessions."""
    ip = get_client_ip(request)
    device_label = request.META.get('HTTP_USER_AGENT', 'Unknown Device')[:250]
    ActiveSession.objects.create(
        user=user,
        device_label=device_label,
        ip_address=ip,
        location="Lagos, NG"
    )


# -------------------------------------------------------------
# 1. AUTHENTICATION VIEWS
# -------------------------------------------------------------
class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    Registers a new student and returns JWT tokens + user profile.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        record_active_session(user, request)

        refresh = RefreshToken.for_user(user)
        user_data = UserSummarySerializer(user).data

        return Response(
            {
                "message": "Student account created successfully.",
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                "user": user_data,
            },
            status=status.HTTP_201_CREATED,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Authenticates via username/email & password. Returns JWT tokens & profile payload.
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            user_id = response.data.get('user', {}).get('id')
            if user_id:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                user = User.objects.filter(id=user_id).first()
                if user:
                    record_active_session(user, request)
        return response


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    Blacklists the student's refresh token and ends the session.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required to log out."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logged out successfully. Token invalidated."},
                status=status.HTTP_200_OK,
            )
        except Exception:
            return Response(
                {"error": "Token is invalid or already blacklisted."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ChangePasswordView(APIView):
    """
    POST /api/auth/change-password/
    Validates current password and updates to a new password.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response(
            {"message": "Password updated successfully."},
            status=status.HTTP_200_OK,
        )


# -------------------------------------------------------------
# 2. PROFILE & SETTINGS VIEWS
# -------------------------------------------------------------
class UserProfileView(APIView):
    """
    GET/PUT/PATCH /api/auth/profile/
    Retrieve or update the authenticated student's profile information.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        StudentProfile.objects.get_or_create(user=request.user)
        serializer = UserSummarySerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = StudentProfile.objects.get_or_create(user=request.user)
        serializer = StudentProfileUpdateSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSummarySerializer(request.user).data)

    def patch(self, request):
        return self.put(request)


class PrivacySettingsView(generics.RetrieveUpdateAPIView):
    """
    GET/PUT/PATCH /api/auth/settings/privacy/
    Fetch or update WhatsApp visibility and deactivation toggle.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PrivacySettingsSerializer

    def get_object(self):
        profile, _ = StudentProfile.objects.get_or_create(user=self.request.user)
        return profile


class ActiveSessionListView(generics.ListAPIView):
    """
    GET /api/auth/sessions/
    List active login devices and sessions for the authenticated student.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ActiveSessionSerializer

    def get_queryset(self):
        return ActiveSession.objects.filter(user=self.request.user)


class InstitutionListView(generics.ListAPIView):
    """
    GET /api/auth/institutions/
    List universities for student onboarding dropdowns.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = InstitutionSerializer
    queryset = Institution.objects.all()


class DeleteAccountView(APIView):
    """
    DELETE /api/auth/delete-account/
    Safeguard check: rejects if uncompleted requests or pending payout balance exist.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        serializer = DeleteAccountSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user

        # Safeguard: check for active/in-flight service requests
        has_pending_requests = False
        if hasattr(user, 'received_requests'):
            has_pending_requests = user.received_requests.filter(
                status__in=['pending', 'accepted']
            ).exists()
        if not has_pending_requests and hasattr(user, 'purchased_requests'):
            has_pending_requests = user.purchased_requests.filter(
                status__in=['pending', 'accepted']
            ).exists()

        if has_pending_requests:
            return Response(
                {
                    "error": "Cannot delete account: You have pending or active service requests. "
                             "Please resolve or complete them first."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Safeguard: check for pending payout balance
        if hasattr(user, 'payout_info'):
            if user.payout_info.pending_payout_balance > 0:
                return Response(
                    {
                        "error": f"Cannot delete account: You have an awaiting payout balance of "
                                 f"₦{user.payout_info.pending_payout_balance}. Please withdraw your funds first."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        user.delete()
        return Response(
            {"message": "Your account has been deleted permanently."},
            status=status.HTTP_200_OK,
        )