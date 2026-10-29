from decimal import Decimal, InvalidOperation
from django.db.models import Q


def apply_service_filters(queryset, params, user=None):
    """
    Applies multi-criteria filtering to the ServiceListing queryset.
    """
    # 1. Filter by University / Campus
    institution = params.get('institution')
    if institution:
        if institution.isdigit():
            queryset = queryset.filter(provider__profile__institution_id=int(institution))
        else:
            queryset = queryset.filter(
                Q(provider__profile__institution__short_code__iexact=institution) |
                Q(provider__profile__institution__name__icontains=institution)
            )

    # 2. Filter by Category (slug or id)
    category = params.get('category')
    if category:
        if category.isdigit():
            queryset = queryset.filter(category_id=int(category))
        else:
            queryset = queryset.filter(category__slug__iexact=category)

    # 3. Case-insensitive Keyword Search
    search = params.get('search')
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(skill_tag__icontains=search) |
            Q(provider__username__icontains=search)
        )

    # 4. Price Bounds (in Nigerian Naira)
    min_price = params.get('min_price')
    if min_price:
        try:
            queryset = queryset.filter(starting_price__gte=Decimal(min_price))
        except (InvalidOperation, ValueError):
            pass

    max_price = params.get('max_price')
    if max_price:
        try:
            queryset = queryset.filter(starting_price__lte=Decimal(max_price))
        except (InvalidOperation, ValueError):
            pass

    # 5. Dashboard Filter (My Listings) vs Public Discovery
    if params.get('my_services') == 'true' and user and user.is_authenticated:
        queryset = queryset.filter(provider=user)
    else:
        # Public discovery only surfaces active listings
        if params.get('my_services') != 'true':
            queryset = queryset.filter(is_active=True)

    return queryset