from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, PlanterProfile, ROLE_PLANTER


@receiver(post_save, sender=User)
def create_planter_profile_for_planter(sender, instance: User, created, **kwargs):
    """
    Ensure a PlanterProfile exists for users with role=PLANTER.
    This will create on user creation or when role is changed to PLANTER.
    """
    if instance.role == ROLE_PLANTER:
        PlanterProfile.objects.get_or_create(user=instance)
    else:
        # do not auto-delete profiles; keep data unless explicitly removed
        pass