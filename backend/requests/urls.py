from django.urls import path
from .views import (
    ServiceRequestListCreateView,
    ServiceRequestDetailView,
    ServiceRequestStatusTransitionView,
    RequestAttachmentUploadView,
)

app_name = 'requests'

urlpatterns = [
    # List (Activity Hub feeds) & Create Order
    path('', ServiceRequestListCreateView.as_view(), name='request_list_create'),

    # Order Detail
    path('<int:pk>/', ServiceRequestDetailView.as_view(), name='request_detail'),

    # State Machine Transition (accept, reject, complete)
    path('<int:pk>/status/', ServiceRequestStatusTransitionView.as_view(), name='request_status_transition'),

    # Project Brief Attachments
    path('<int:pk>/attachments/', RequestAttachmentUploadView.as_view(), name='request_attachment_upload'),
]