from rest_framework import serializers
from django.db import transaction
from .models import (
    PlantationProject,
    ResourceNeed,
    ProjectSupport,
    ReceiptConfirmation,
    PlantationUpdate,
)
from accounts.models import PlanterProfile, User


class PlanterSummarySerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = PlanterProfile
        fields = ["id", "user_id", "user_email", "first_name", "last_name", "location", "state", "total_trees_planted"]


class ResourceNeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceNeed
        fields = ["id", "project", "name", "description", "quantity", "priority", "reason", "is_fulfilled", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at", "is_fulfilled"]

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value


class PlantationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantationUpdate
        fields = ["id", "project", "message", "photo", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class ProjectSupportSerializer(serializers.ModelSerializer):
    supporter_id = serializers.IntegerField(source="supporter.id", read_only=True)

    class Meta:
        model = ProjectSupport
        fields = [
            "id",
            "supporter",
            "supporter_id",
            "resource_need",
            "quantity",
            "estimated_value",
            "status",
            "tracking_number",
            "sent_date",
            "expected_delivery",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at", "supporter"]

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        # optionally validate against need.quantity - existing supports, handled in view or business logic
        return value

    def create(self, validated_data):
        # supporter must already be set in view
        return super().create(validated_data)


class ReceiptConfirmationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceiptConfirmation
        fields = ["id", "project_support", "quantity_received", "condition", "notes", "photo_proof", "confirmed_at"]
        read_only_fields = ["id", "confirmed_at"]

    def validate_quantity_received(self, value):
        if value < 0:
            raise serializers.ValidationError("quantity_received must be non-negative.")
        return value


class PlantationProjectListSerializer(serializers.ModelSerializer):
    planter = PlanterSummarySerializer(read_only=True)

    class Meta:
        model = PlantationProject
        fields = [
            "id",
            "title",
            "description",
            "plantation_type",
            "location",
            "state",
            "target_trees",
            "trees_planted",
            "cover_photo",
            "status",
            "created_at",
            "updated_at",
            "planter",
        ]


class PlantationProjectDetailSerializer(serializers.ModelSerializer):
    planter = PlanterSummarySerializer(read_only=True)
    resource_needs = ResourceNeedSerializer(many=True, read_only=True)
    recent_updates = serializers.SerializerMethodField()

    class Meta:
        model = PlantationProject
        fields = [
            "id",
            "title",
            "description",
            "plantation_type",
            "location",
            "state",
            "target_trees",
            "trees_planted",
            "cover_photo",
            "status",
            "created_at",
            "updated_at",
            "planter",
            "resource_needs",
            "recent_updates",
        ]

    def get_recent_updates(self, obj):
        qs = obj.updates.all().order_by("-created_at")[:5]
        return PlantationUpdateSerializer(qs, many=True).data