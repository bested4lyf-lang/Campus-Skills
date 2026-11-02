from django.apps import apps
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Notification


@receiver(post_save, sender='requests.ServiceRequest')
def handle_service_request_notifications(sender, instance, created, **kwargs):
    """
    Auto-dispatches alerts across the ServiceRequest lifecycle.
    """
    if created:
        # Event 1: New order placed -> Alert the Provider
        customer_name = instance.customer.get_full_name() or instance.customer.username
        Notification.objects.create(
            recipient=instance.provider,
            event_type='request_received',
            title='New Request Received',
            message=f"{customer_name} submitted an order for '{instance.service.title}'.",
            deep_link='/activity?view=client_work',
        )
    else:
        # State machine transition alerts -> Alert the Customer
        provider_name = instance.provider.get_full_name() or instance.provider.username

        if instance.status == 'accepted':
            Notification.objects.create(
                recipient=instance.customer,
                event_type='request_accepted',
                title='Request Accepted',
                message=f"{provider_name} accepted your order for '{instance.service.title}'.",
                deep_link='/activity?view=my_hires',
            )
        elif instance.status == 'rejected':
            reason_text = f" Reason: {instance.rejection_reason}" if instance.rejection_reason else ""
            Notification.objects.create(
                recipient=instance.customer,
                event_type='request_rejected',
                title='Request Declined',
                message=f"Your request for '{instance.service.title}' was declined.{reason_text}",
                deep_link='/activity?view=my_hires',
            )
        elif instance.status == 'completed':
            Notification.objects.create(
                recipient=instance.customer,
                event_type='request_completed',
                title='Work Marked as Completed',
                message=f"{provider_name} completed your order for '{instance.service.title}'. Leave a verified review!",
                deep_link=f"/activity?view=my_hires&review_order={instance.id}",
            )


@receiver(post_save, sender='reviews.OrderReview')
def handle_review_notifications(sender, instance, created, **kwargs):
    """
    Alerts the provider when a customer leaves a verified review.
    """
    if created:
        reviewer_name = instance.reviewer.get_full_name() or instance.reviewer.username
        Notification.objects.create(
            recipient=instance.service.provider,
            event_type='review_received',
            title='New Review Received',
            message=f"{reviewer_name} gave you a {instance.rating}★ rating on '{instance.service.title}'.",
            deep_link=f"/services/{instance.service.id}/",
        )