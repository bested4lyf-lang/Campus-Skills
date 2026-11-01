from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import OrderReview
from .serializers import (
    OrderReviewCreateSerializer,
    OrderReviewReadSerializer,
    OrderReviewUpdateSerializer,
)

User = get_user_model()


class IsReviewerOrReadOnly(permissions.BasePermission):
    """
    Allows read permissions to any request, but write/edit permissions
    strictly to the student author of the review.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.reviewer == request.user


class OrderReviewCreateView(generics.CreateAPIView):
    """
    POST /api/reviews/
    Submit a verified rating and review for a completed order.
    """
    serializer_class = OrderReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        review = write_serializer.save()

        read_serializer = OrderReviewReadSerializer(review, context={'request': request})
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)


class OrderReviewDetailUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET /api/reviews/<id>/
      Read a single review.
    PATCH /api/reviews/<id>/
      Edit rating, tags, or comment within 24 hours of posting (Reviewer only).
    """
    queryset = OrderReview.objects.select_related(
        'reviewer',
        'reviewer__profile',
        'reviewer__profile__institution',
        'service'
    ).all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsReviewerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return OrderReviewUpdateSerializer
        return OrderReviewReadSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        write_serializer = self.get_serializer(instance, data=request.data, partial=partial)
        write_serializer.is_valid(raise_exception=True)
        updated_instance = write_serializer.save()

        read_serializer = OrderReviewReadSerializer(updated_instance, context={'request': request})
        return Response(read_serializer.data)


class ServiceReviewListView(generics.ListAPIView):
    """
    GET /api/reviews/service/<service_id>/
    Public listing of verified reviews for a specific service.
    """
    serializer_class = OrderReviewReadSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        service_id = self.kwargs.get('service_id')
        return OrderReview.objects.filter(
            service_id=service_id
        ).select_related(
            'reviewer',
            'reviewer__profile',
            'reviewer__profile__institution',
            'service'
        )


class ProviderReviewListView(generics.ListAPIView):
    """
    GET /api/reviews/provider/<username>/
    Public portfolio feed of all verified reviews received by a student provider.
    """
    serializer_class = OrderReviewReadSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs.get('username')
        provider = get_object_or_404(User, username=username)
        return OrderReview.objects.filter(
            service__provider=provider
        ).select_related(
            'reviewer',
            'reviewer__profile',
            'reviewer__profile__institution',
            'service'
        )