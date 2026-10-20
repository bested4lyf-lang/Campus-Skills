from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ActiveSessionListView,
    ChangePasswordView,
    CustomTokenObtainPairView,
    DeleteAccountView,
    InstitutionListView,
    LogoutView,
    PrivacySettingsView,
    RegisterView,
    UserProfileView,
)

app_name = 'accounts'

urlpatterns = [
    # Authentication & Session Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Profile & Settings
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('settings/privacy/', PrivacySettingsView.as_view(), name='privacy_settings'),
    path('sessions/', ActiveSessionListView.as_view(), name='active_sessions'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete_account'),

    # Meta / Onboarding
    path('institutions/', InstitutionListView.as_view(), name='institution_list'),
]