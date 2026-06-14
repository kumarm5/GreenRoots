from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone

from accounts.models import PlanterProfile

PLANTATION_FARM = "FARM"
PLANTATION_COMMUNITY = "COMMUNITY"
PLANTATION_SCHOOL = "SCHOOL"
PLANTATION_ROADSIDE = "ROADSIDE"
PLANTATION_PARK = "PARK"

PLANTATION_TYPE_CHOICES = [
    (PLANTATION_FARM, "Farm"),
    (PLANTATION_COMMUNITY, "Community"),
    (PLANTATION_SCHOOL, "School"),
    (PLANTATION_ROADSIDE, "Roadside"),
    (PLANTATION_PARK, "Park"),
]

STATUS_DRAFT = "DRAFT"
STATUS_ACTIVE = "ACTIVE"
STATUS_COMPLETED = "COMPLETED"

STATUS_CHOICES = [
    (STATUS_DRAFT, "Draft"),
    (STATUS_ACTIVE, "Active"),
    (STATUS_COMPLETED, "Completed"),
]


PRIORITY_LOW = "LOW"
PRIORITY_MEDIUM = "MEDIUM"
PRIORITY_HIGH = "HIGH"

PRIORITY_CHOICES = [
    (PRIORITY_LOW, "Low"),
    (PRIORITY_MEDIUM, "Medium"),
    (PRIORITY_HIGH, "High"),
]


SUPPORT_PENDING = "PENDING"
SUPPORT_IN_TRANSIT = "IN_TRANSIT"
SUPPORT_DELIVERED = "DELIVERED"

SUPPORT_STATUS_CHOICES = [
    (SUPPORT_PENDING, "Pending"),
    (SUPPORT_IN_TRANSIT, "In Transit"),
    (SUPPORT_DELIVERED, "Delivered"),
]


CONDITION_GOOD = "GOOD"
CONDITION_ACCEPTABLE = "ACCEPTABLE"
CONDITION_DAMAGED = "DAMAGED"

CONDITION_CHOICES = [
    (CONDITION_GOOD, "Good"),
    (CONDITION_ACCEPTABLE, "Acceptable"),
    (CONDITION_DAMAGED, "Damaged"),
]


class PlantationProject(models.Model):
    planter = models.ForeignKey(PlanterProfile, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    plantation_type = models.CharField(max_length=32, choices=PLANTATION_TYPE_CHOICES)
    location = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    target_trees = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    trees_planted = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    cover_photo = models.ImageField(upload_to="plantation_covers/", blank=True, null=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "plantation project"
        verbose_name_plural = "plantation projects"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["plantation_type"]),
            models.Index(fields=["state"]),
            models.Index(fields=["status"]),
        ]

    def clean(self):
        if self.trees_planted > self.target_trees:
            raise ValidationError({"trees_planted": "trees_planted cannot exceed target_trees."})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.id})"


class ResourceNeed(models.Model):
    project = models.ForeignKey(PlantationProject, on_delete=models.CASCADE, related_name="resource_needs")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    priority = models.CharField(max_length=16, choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM)
    reason = models.TextField(blank=True)
    is_fulfilled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "resource need"
        verbose_name_plural = "resource needs"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} for project {self.project_id}"


from django.conf import settings


class ProjectSupport(models.Model):
    supporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="supports")
    resource_need = models.ForeignKey(ResourceNeed, on_delete=models.CASCADE, related_name="supports")
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    estimated_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=32, choices=SUPPORT_STATUS_CHOICES, default=SUPPORT_PENDING)
    tracking_number = models.CharField(max_length=255, blank=True)
    sent_date = models.DateField(null=True, blank=True)
    expected_delivery = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "project support"
        verbose_name_plural = "project supports"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Support({self.supporter_id}) -> Need({self.resource_need_id})"


class ReceiptConfirmation(models.Model):
    project_support = models.OneToOneField(ProjectSupport, on_delete=models.CASCADE, related_name="confirmation")
    quantity_received = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    condition = models.CharField(max_length=16, choices=CONDITION_CHOICES)
    notes = models.TextField(blank=True)
    photo_proof = models.ImageField(upload_to="confirmations/", blank=True, null=True)
    confirmed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "receipt confirmation"
        verbose_name_plural = "receipt confirmations"
        ordering = ["-confirmed_at"]

    def clean(self):
        if self.quantity_received > self.project_support.quantity:
            raise ValidationError({"quantity_received": "Cannot confirm more than was sent in the support."})

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Confirmation for support {self.project_support_id}"


class PlantationUpdate(models.Model):
    project = models.ForeignKey(PlantationProject, on_delete=models.CASCADE, related_name="updates")
    message = models.TextField()
    photo = models.ImageField(upload_to="project_updates/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "plantation update"
        verbose_name_plural = "plantation updates"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Update({self.id}) for Project({self.project_id})"
