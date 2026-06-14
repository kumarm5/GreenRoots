from rest_framework.permissions import BasePermission
from .models import PlantationProject, ResourceNeed, ProjectSupport


class IsPlanter(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, "role", None) == "PLANTER")


class IsSupporter(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, "role", None) == "SUPPORTER")


class IsProjectOwner(BasePermission):
    """
    Object-level permission to allow only owners (planter.user) of a project to edit/delete.
    For resources/supports/updates that belong to a project, ensures the requesting user is the planter owner.
    """

    def has_object_permission(self, request, view, obj):
        # obj may be a PlantationProject, ResourceNeed, ProjectSupport, PlantationUpdate, ReceiptConfirmation
        if isinstance(obj, PlantationProject):
            return obj.planter.user_id == request.user.id
        if isinstance(obj, ResourceNeed):
            return obj.project.planter.user_id == request.user.id
        if isinstance(obj, ProjectSupport):
            return obj.resource_need.project.planter.user_id == request.user.id
        if hasattr(obj, "project"):
            # handles PlantationUpdate
            return obj.project.planter.user_id == request.user.id
        if hasattr(obj, "project_support"):
            # handles ReceiptConfirmation -> check owner of related project via support
            return obj.project_support.resource_need.project.planter.user_id == request.user.id
        return False

    def has_permission(self, request, view):
        # allow generic permission checks to pass; object-level will handle real checks
        return bool(request.user and request.user.is_authenticated and getattr(request.user, "role", None) == "PLANTER")