from rest_framework import permissions


class IsProviderOrReadOnly(permissions.BasePermission):
    """
    Object-level permission allowing only the listing owner to edit or delete it.
    Read requests (GET, HEAD, OPTIONS) are allowed for anyone.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if the object is a ServiceListing
        if hasattr(obj, 'provider'):
            return obj.provider == request.user

        # Check if the object is a ServiceSampleImage attached to a listing
        if hasattr(obj, 'listing'):
            return obj.listing.provider == request.user

        return False