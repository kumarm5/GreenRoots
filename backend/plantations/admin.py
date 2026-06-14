from django.contrib import admin
from .models import (
    PlantationProject,
    ResourceNeed,
    ProjectSupport,
    ReceiptConfirmation,
    PlantationUpdate,
)
from accounts.models import PlanterProfile


class ResourceNeedInline(admin.TabularInline):
    model = ResourceNeed
    extra = 0
    readonly_fields = ("created_at", "updated_at")


class PlantationUpdateInline(admin.TabularInline):
    model = PlantationUpdate
    extra = 0
    readonly_fields = ("created_at", "updated_at")


@admin.register(PlantationProject)
class PlantationProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "planter", "plantation_type", "location", "state", "status", "target_trees", "trees_planted", "created_at")
    list_filter = ("plantation_type", "state", "status", "created_at")
    search_fields = ("title", "location", "planter__user__email", "planter__user__username")
    ordering = ("-created_at",)
    inlines = [ResourceNeedInline, PlantationUpdateInline]


@admin.register(ResourceNeed)
class ResourceNeedAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "project", "quantity", "priority", "is_fulfilled", "created_at")
    list_filter = ("priority", "is_fulfilled", "created_at")
    search_fields = ("name", "project__title")


@admin.register(ProjectSupport)
class ProjectSupportAdmin(admin.ModelAdmin):
    list_display = ("id", "supporter", "resource_need", "quantity", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("supporter__email", "resource_need__name", "resource_need__project__title")


@admin.register(ReceiptConfirmation)
class ReceiptConfirmationAdmin(admin.ModelAdmin):
    list_display = ("id", "project_support", "quantity_received", "condition", "confirmed_at")
    search_fields = ("project_support__supporter__email",)


@admin.register(PlantationUpdate)
class PlantationUpdateAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "created_at")
    search_fields = ("project__title",)
