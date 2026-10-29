from django.urls import path
from .views import (
    CategoryListView,
    ServiceListingListCreateView,
    ServiceListingDetailView,
    ServiceGalleryUploadView,
    ServiceGalleryDeleteView,
)

app_name = 'services'

urlpatterns = [
    # Categories Endpoint
    path('categories/', CategoryListView.as_view(), name='category_list'),

    # Listings Endpoints
    path('', ServiceListingListCreateView.as_view(), name='listing_list_create'),
    path('<int:pk>/', ServiceListingDetailView.as_view(), name='listing_detail'),

    # Portfolio Gallery Endpoints
    path('<int:pk>/gallery/', ServiceGalleryUploadView.as_view(), name='gallery_upload'),
    path('gallery/<int:pk>/', ServiceGalleryDeleteView.as_view(), name='gallery_delete'),
]