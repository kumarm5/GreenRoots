from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from django.db.models import Prefetch

from .models import (
    PlantationProject,
    ResourceNeed,
    ProjectSupport,
    ReceiptConfirmation,
    PlantationUpdate,
)
from .serializers import (
    PlantationProjectListSerializer,
    PlantationProjectDetailSerializer,
    ResourceNeedSerializer,
    ProjectSupportSerializer,
    ReceiptConfirmationSerializer,
    PlantationUpdateSerializer,
)
from .permissions import IsPlanter, IsSupporter, IsProjectOwner
from accounts.models import PlanterProfile, User


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


# Projects
class PlantationProjectListCreateView(generics.ListCreateAPIView):
    queryset = PlantationProject.objects.select_related("planter__user").prefetch_related("resource_needs", "updates")
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["plantation_type", "state", "status"]
    search_fields = ["title", "location"]
    ordering = ["-created_at"]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsPlanter()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PlantationProjectListSerializer
        return PlantationProjectDetailSerializer

    def perform_create(self, serializer):
        # ensure planter belongs to request.user
        planter = PlanterProfile.objects.filter(user=self.request.user).first()
        if not planter:
            raise PermissionError("Only planters with a planter profile can create projects.")
        serializer.save(planter=planter)


class PlantationProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PlantationProject.objects.select_related("planter__user").prefetch_related(
        Prefetch("resource_needs"), Prefetch("updates")
    )
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_permissions(self):
        if self.request.method in ("PATCH", "PUT", "DELETE"):
            return [IsAuthenticated(), IsPlanter(), IsProjectOwner()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PlantationProjectDetailSerializer
        return PlantationProjectDetailSerializer

    def perform_update(self, serializer):
        # object-level permission ensures owner; model validation enforces trees limit
        serializer.save()


class MyProjectsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsPlanter]
    pagination_class = StandardResultsSetPagination
    serializer_class = PlantationProjectListSerializer

    def get_queryset(self):
        planter = PlanterProfile.objects.filter(user=self.request.user).first()
        return PlantationProject.objects.filter(planter=planter).select_related("planter__user").prefetch_related("resource_needs")


# Resource Needs
class ResourceNeedListCreateView(generics.ListCreateAPIView):
    queryset = ResourceNeed.objects.select_related("project__planter__user")
    serializer_class = ResourceNeedSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["project", "priority", "is_fulfilled"]
    search_fields = ["name", "description"]
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsPlanter()]
        return [AllowAny()]

    def perform_create(self, serializer):
        project = get_object_or_404(PlantationProject, pk=self.request.data.get("project"))
        # owner only
        if project.planter.user_id != self.request.user.id:
            raise PermissionError("Only project owner can create resource needs.")
        serializer.save(project=project)


class ResourceNeedDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ResourceNeed.objects.select_related("project__planter__user")
    serializer_class = ResourceNeedSerializer
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_permissions(self):
        if self.request.method in ("PATCH", "PUT", "DELETE"):
            return [IsAuthenticated(), IsPlanter(), IsProjectOwner()]
        return [AllowAny()]


# Project Supports
class ProjectSupportCreateView(generics.CreateAPIView):
    serializer_class = ProjectSupportSerializer
    permission_classes = [IsAuthenticated, IsSupporter]

    def perform_create(self, serializer):
        resource_need = get_object_or_404(ResourceNeed, pk=self.request.data.get("resource_need"))
        # supporters can only create supports for needs (no extra owner checks)
        serializer.save(supporter=self.request.user, resource_need=resource_need)


class MySupportsView(generics.ListAPIView):
    serializer_class = ProjectSupportSerializer
    permission_classes = [IsAuthenticated, IsSupporter]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return ProjectSupport.objects.filter(supporter=self.request.user).select_related("resource_need__project__planter__user")


class ProjectSupportsForPlanterView(generics.ListAPIView):
    serializer_class = ProjectSupportSerializer
    permission_classes = [IsAuthenticated, IsPlanter]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # supports related to planter's projects
        return ProjectSupport.objects.filter(resource_need__project__planter__user=self.request.user).select_related(
            "resource_need__project__planter__user", "supporter"
        )


# Receipt confirmations
class ReceiptConfirmationCreateView(generics.CreateAPIView):
    serializer_class = ReceiptConfirmationSerializer
    permission_classes = [IsAuthenticated, IsPlanter]

    def perform_create(self, serializer):
        support = get_object_or_404(ProjectSupport, pk=self.request.data.get("project_support"))
        # only project owner can confirm receipt
        if support.resource_need.project.planter.user_id != self.request.user.id:
            raise PermissionError("Only project owner can confirm receipts for this support.")
        # ensure one confirmation per support is enforced by OneToOneField
        serializer.save(project_support=support)


class ReceiptConfirmationDetailView(generics.RetrieveAPIView):
    serializer_class = ReceiptConfirmationSerializer
    permission_classes = [IsAuthenticated, IsPlanter]
    queryset = ReceiptConfirmation.objects.select_related("project_support__resource_need__project__planter__user")
    lookup_field = "id"
    lookup_url_kwarg = "id"


# Plantation updates
class PlantationUpdateCreateView(generics.CreateAPIView):
    serializer_class = PlantationUpdateSerializer
    permission_classes = [IsAuthenticated, IsPlanter]

    def perform_create(self, serializer):
        project = get_object_or_404(PlantationProject, pk=self.request.data.get("project"))
        if project.planter.user_id != self.request.user.id:
            raise PermissionError("Only project owner can create updates.")
        serializer.save(project=project)


class PlantationUpdateDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PlantationUpdateSerializer
    queryset = PlantationUpdate.objects.select_related("project__planter__user")
    lookup_field = "id"
    lookup_url_kwarg = "id"

    def get_permissions(self):
        if self.request.method in ("PATCH", "PUT", "DELETE"):
            return [IsAuthenticated(), IsPlanter(), IsProjectOwner()]
        return [AllowAny()]


class ProjectUpdatesListView(generics.ListAPIView):
    serializer_class = PlantationUpdateSerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        project_id = self.kwargs.get("project_id")
        return PlantationUpdate.objects.filter(project_id=project_id).select_related("project__planter__user").order_by("-created_at")
