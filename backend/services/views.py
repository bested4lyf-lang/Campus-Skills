from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import generics, parsers, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import apply_service_filters
from .models import Category, ServiceListing, ServiceSampleImage
from .permissions import IsProviderOrReadOnly
from .serializers import (
    CategorySerializer,
    ServiceListingCreateUpdateSerializer,
    ServiceListingDetailSerializer,
    ServiceListingListSerializer,
    ServiceSampleImageSerializer,
)


class CategoryListView(generics.ListAPIView):
    """
    GET /api/services/categories/
    Public read-only listing of campus service categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ServiceListingListCreateView(generics.ListCreateAPIView):
    """
    GET /api/services/
      Discover active services. Supports ?category=, ?search=, ?min_price=,
      ?max_price=, ?institution=, and ?my_services=true.

    POST /api/services/
      Create a new service listing. Provider is set to the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_queryset(self):
        queryset = ServiceListing.objects.select_related(
            'category',
            'provider',
            'provider__profile',
            'provider__profile__institution'
        ).all()
        return apply_service_filters(queryset, self.request.query_params, self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ServiceListingCreateUpdateSerializer
        return ServiceListingListSerializer

    def create(self, request, *args, **kwargs):
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        listing = write_serializer.save(provider=request.user)

        # Return full detail payload with nested provider and campus data
        read_serializer = ServiceListingDetailSerializer(listing, context={'request': request})
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)


class ServiceListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/services/<id>/
      Full service detail with portfolio gallery and provider details.

    PUT/PATCH /api/services/<id>/
      Update listing. Restricted strictly to listing owner.

    DELETE /api/services/<id>/
      Delete listing. Restricted strictly to listing owner.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsProviderOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_queryset(self):
        return ServiceListing.objects.select_related(
            'category',
            'provider',
            'provider__profile',
            'provider__profile__institution'
        ).prefetch_related('gallery_images').all()

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ServiceListingCreateUpdateSerializer
        return ServiceListingDetailSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        write_serializer = self.get_serializer(instance, data=request.data, partial=partial)
        write_serializer.is_valid(raise_exception=True)
        updated_instance = write_serializer.save()

        read_serializer = ServiceListingDetailSerializer(updated_instance, context={'request': request})
        return Response(read_serializer.data)


class ServiceGalleryUploadView(APIView):
    """
    POST /api/services/<id>/gallery/
    Upload a supplementary portfolio sample image to an existing listing.
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request, pk):
        listing = get_object_or_404(ServiceListing, pk=pk)
        if listing.provider != request.user:
            return Response(
                {"error": "You do not have permission to add portfolio images to this listing."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ServiceSampleImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(listing=listing)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ServiceGalleryDeleteView(APIView):
    """
    DELETE /api/services/gallery/<id>/
    Remove an individual portfolio sample image from a listing.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        sample = get_object_or_404(ServiceSampleImage, pk=pk)
        if sample.listing.provider != request.user:
            return Response(
                {"error": "You do not have permission to delete this image."},
                status=status.HTTP_403_FORBIDDEN
            )
        sample.delete()
        return Response({"message": "Gallery image deleted."}, status=status.HTTP_200_OK)