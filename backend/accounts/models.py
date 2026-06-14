from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, MinValueValidator
from django.utils import timezone

ROLE_SUPPORTER = "SUPPORTER"
ROLE_PLANTER = "PLANTER"
ROLE_CHOICES = [
    (ROLE_SUPPORTER, "Supporter"),
    (ROLE_PLANTER, "Planter"),
]


class User(AbstractUser):
    email = models.EmailField("email address", unique=True)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r"^\+?\d{7,15}$",
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.",
            )
        ],
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_SUPPORTER)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email or self.username


class PlanterProfile(models.Model):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE, related_name="planter_profile")
    bio = models.TextField(blank=True)
    story = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    state = models.CharField(max_length=255, blank=True)
    profile_photo = models.ImageField(upload_to="profile_photos/", blank=True, null=True)
    total_trees_planted = models.PositiveIntegerField(default=0)
    years_of_experience = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "planter profile"
        verbose_name_plural = "planter profiles"
        ordering = ["-created_at"]

    def __str__(self):
        return f"PlanterProfile(user={self.user_id})"
