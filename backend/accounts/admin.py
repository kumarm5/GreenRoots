from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User, PlanterProfile


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = ("id", "email", "username", "first_name", "last_name", "role", "is_active", "date_joined")
    list_filter = ("role", "is_active", "date_joined")
    search_fields = ("email", "username", "first_name", "last_name")
    ordering = ("-date_joined",)


@admin.register(PlanterProfile)
class PlanterProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "location", "state", "total_trees_planted", "years_of_experience", "created_at")
    list_filter = ("state",)
    search_fields = ("user__email", "location", "state")
