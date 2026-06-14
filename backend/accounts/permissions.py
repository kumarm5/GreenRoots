from rest_framework.permissions import BasePermission


class IsPlanter(BasePermission):
    """
    Allows access only to users with role PLANTER.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "PLANTER")


class IsSupporter(BasePermission):
    """
    Allows access only to users with role SUPPORTER.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "SUPPORTER")