from django.urls import path
from .views import (
    OrderReviewCreateView,
    OrderReviewDetailUpdateView,
    ServiceReviewListView,
    ProviderReviewListView,
)

app_name = 'reviews'

urlpatterns = [
    # Submit Review (POST /api/reviews/)
    path('', OrderReviewCreateView.as_view(), name='review_create'),

    # Retrieve or Update a Review (GET/PATCH /api/reviews/<id>/)
    path('<int:pk>/', OrderReviewDetailUpdateView.as_view(), name='review_detail_update'),

    # List reviews for a specific service (GET /api/reviews/service/<service_id>/)
    path('service/<int:service_id>/', ServiceReviewListView.as_view(), name='service_reviews'),

    # List all reviews for a student provider portfolio (GET /api/reviews/provider/<username>/)
    path('provider/<str:username>/', ProviderReviewListView.as_view(), name='provider_reviews'),
]