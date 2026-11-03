from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path

from accounts.views import BankPayoutInfoView, SupportedBanksListView


def api_health(request):
    return JsonResponse({
        "status": "online",
        "project": "CampusSkill API",
        "version": "1.0.0"
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', api_health, name='api-health'),
    # Accounts & Authentication Endpoints
    path('api/auth/', include('accounts.urls')),
    # Marketplace & Services Endpoints
    path('api/services/', include('services.urls')),
    # Orders & State Machine Endpoints
    path('api/requests/', include('requests.urls')),
    # Reviews & Ratings Endpoints
    path('api/reviews/', include('reviews.urls')),
    # Notifications Endpoints
    path('api/notifications/', include('notifications.urls')),
    # Direct Payout Endpoints
    path('api/payouts/bank-details/', BankPayoutInfoView.as_view(), name='payout-details'),
    path('api/payouts/banks/', SupportedBanksListView.as_view(), name='payout-banks'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)