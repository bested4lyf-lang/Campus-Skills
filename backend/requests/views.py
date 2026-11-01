from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, parsers, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ServiceRequest, RequestAttachment
from .serializers import (
    ServiceRequestCreateSerializer,
    ServiceRequestDetailSerializer,
    ServiceRequestStatusUpdateSerializer,
    RequestAttachmentSerializer,
)


class ServiceRequestListCreateView(generics.ListCreateAPIView):
    """
    GET /api/requests/
      List orders for authenticated student. Supports ?view=client_work,
      ?view=my_hires, and ?status=pending|accepted|completed|rejected.

    POST /api/requests/
      Book a service and submit project brief (with optional attachment file).
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_queryset(self):
        user = self.request.user
        view_mode = self.request.query_params.get('view')
        status_filter = self.request.query_params.get('status')

        queryset = ServiceRequest.objects.select_related(
            'service',
            'service__category',
            'customer',
            'customer__profile',
            'customer__profile__institution',
            'provider',
            'provider__profile',
            'provider__profile__institution',
        ).prefetch_related('attachments')

        # Activity Hub tab segmentation
        if view_mode == 'client_work':
            queryset = queryset.filter(provider=user)
        elif view_mode == 'my_hires':
            queryset = queryset.filter(customer=user)
        else:
            # Default: all orders where the user is either buyer or seller
            queryset = queryset.filter(Q(customer=user) | Q(provider=user))

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ServiceRequestCreateSerializer
        return ServiceRequestDetailSerializer

    def create(self, request, *args, **kwargs):
        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        service_request = write_serializer.save()

        # Handle optional initial brief attachment in multipart upload
        attachment_file = request.FILES.get('attachment')
        if attachment_file:
            RequestAttachment.objects.create(
                request=service_request,
                file=attachment_file
            )

        read_serializer = ServiceRequestDetailSerializer(
            service_request,
            context={'request': request}
        )
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)


class ServiceRequestDetailView(generics.RetrieveAPIView):
    """
    GET /api/requests/<id>/
    View full order details. Restricted strictly to the customer or provider.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ServiceRequestDetailSerializer

    def get_queryset(self):
        user = self.request.user
        return ServiceRequest.objects.filter(
            Q(customer=user) | Q(provider=user)
        ).select_related(
            'service',
            'service__category',
            'customer',
            'customer__profile',
            'customer__profile__institution',
            'provider',
            'provider__profile',
            'provider__profile__institution',
        ).prefetch_related('attachments')


class ServiceRequestStatusTransitionView(APIView):
    """
    PATCH /api/requests/<id>/status/
    Transition order state (accepted, rejected, completed).
    Restricted strictly to the service provider.
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        service_request = get_object_or_404(
            ServiceRequest.objects.select_related(
                'service',
                'customer',
                'provider',
                'customer__profile',
                'provider__profile',
            ),
            pk=pk
        )

        # Transition Authority Guard
        if service_request.provider != request.user:
            return Response(
                {
                    "error": "Authority Denied: Only the service provider can accept, decline, or complete this request."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ServiceRequestStatusUpdateSerializer(
            service_request,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        updated_request = serializer.save()

        read_serializer = ServiceRequestDetailSerializer(
            updated_request,
            context={'request': request}
        )
        return Response(read_serializer.data, status=status.HTTP_200_OK)


class RequestAttachmentUploadView(APIView):
    """
    POST /api/requests/<id>/attachments/
    Upload additional brief documents or deliverables.
    Restricted to order participants (customer or provider).
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request, pk):
        service_request = get_object_or_404(ServiceRequest, pk=pk)

        if request.user not in [service_request.customer, service_request.provider]:
            return Response(
                {"error": "You do not have permission to attach files to this order."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = RequestAttachmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(request=service_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)