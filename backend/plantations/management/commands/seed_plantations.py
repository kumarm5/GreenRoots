from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from django.shortcuts import get_object_or_404

import random
import datetime

from django.contrib.auth import get_user_model
from accounts.models import PlanterProfile
from plantations.models import (
    PlantationProject,
    ResourceNeed,
    ProjectSupport,
    ReceiptConfirmation,
    PlantationUpdate,
)

User = get_user_model()

PLANTATION_TYPES = [t[0] for t in PlantationProject._meta.get_field("plantation_type").choices]
STATUS_CHOICES = [s[0] for s in PlantationProject._meta.get_field("status").choices]
PRIORITIES = [p[0] for p in ResourceNeed._meta.get_field("priority").choices]
SUPPORT_STATUSES = [s[0] for s in ProjectSupport._meta.get_field("status").choices]
CONDITIONS = [c[0] for c in ReceiptConfirmation._meta.get_field("condition").choices]


def sample_text(prefix, idx):
    return f"{prefix} sample text #{idx}"


class Command(BaseCommand):
    help = "Seed plantations data (projects, needs, supports, confirmations, updates)"

    def add_arguments(self, parser):
        parser.add_argument("--projects-per-planter", type=int, default=2)
        parser.add_argument("--needs-per-project", type=int, default=3)
        parser.add_argument("--supports-per-need", type=int, default=2)
        parser.add_argument("--updates-per-project", type=int, default=2)
        parser.add_argument("--clear", action="store_true", help="Delete existing seeded plantation data before creating")

    @transaction.atomic
    def handle(self, *args, **options):
        ppp = options["projects_per_planter"]
        npp = options["needs_per_project"]
        spp = options["supports_per_need"]
        upp = options["updates_per_project"]
        clear = options["clear"]

        # optional clear
        if clear:
            ReceiptConfirmation.objects.all().delete()
            ProjectSupport.objects.all().delete()
            ResourceNeed.objects.all().delete()
            PlantationUpdate.objects.all().delete()
            PlantationProject.objects.all().delete()
            self.stdout.write(self.style.WARNING("Cleared existing plantation data"))

        planters = PlanterProfile.objects.select_related("user").all()
        supporters = User.objects.filter(role="SUPPORTER").all()
        if not planters:
            self.stdout.write(self.style.ERROR("No planters found. Run seed_accounts first."))
            return
        if not supporters:
            self.stdout.write(self.style.ERROR("No supporters found. Run seed_accounts first."))
            return

        created_projects = 0
        created_needs = 0
        created_supports = 0
        created_confirmations = 0
        created_updates = 0

        for planter in planters:
            for p_i in range(ppp):
                target = random.randint(50, 1000)
                planted = random.randint(0, target)
                proj = PlantationProject.objects.create(
                    planter=planter,
                    title=f"Seed Project {planter.user.username} #{p_i+1}",
                    description=f"Description for project {p_i+1}",
                    plantation_type=random.choice(PLANTATION_TYPES),
                    location="Village " + str(random.randint(1, 100)),
                    state="State " + str(random.randint(1, 20)),
                    target_trees=target,
                    trees_planted=planted,
                    status=random.choice(STATUS_CHOICES),
                )
                created_projects += 1

                # resource needs
                for n_i in range(npp):
                    qty = random.randint(1, 200)
                    need = ResourceNeed.objects.create(
                        project=proj,
                        name=f"Need {n_i+1} for {proj.title}",
                        description="Needed for planting",
                        quantity=qty,
                        priority=random.choice(PRIORITIES),
                    )
                    created_needs += 1

                    # supports by random supporters
                    for s_i in range(spp):
                        supp = random.choice(list(supporters))
                        # ensure supporters only create supports and quantity <= need.quantity
                        q = random.randint(1, max(1, need.quantity // max(1, spp)))
                        support = ProjectSupport.objects.create(
                            supporter=supp,
                            resource_need=need,
                            quantity=q,
                            estimated_value=round(q * random.uniform(1.0, 20.0), 2),
                            status=random.choice(SUPPORT_STATUSES),
                            sent_date=(timezone.now() - datetime.timedelta(days=random.randint(0, 10))).date(),
                            expected_delivery=(timezone.now() + datetime.timedelta(days=random.randint(1, 20))).date(),
                        )
                        created_supports += 1

                        # optionally create confirmation for some supports if status indicates delivered
                        if support.status == "DELIVERED" and random.random() < 0.5:
                            rc = ReceiptConfirmation.objects.create(
                                project_support=support,
                                quantity_received=min(support.quantity, random.randint(0, support.quantity)),
                                condition=random.choice(CONDITIONS),
                                notes="Auto-confirmation generated by seeder",
                            )
                            created_confirmations += 1

                # updates
                for u_i in range(upp):
                    update = PlantationUpdate.objects.create(
                        project=proj,
                        message=f"Update {u_i+1} for {proj.title}",
                    )
                    created_updates += 1

        self.stdout.write(self.style.SUCCESS(
            f"Created {created_projects} projects, {created_needs} needs, {created_supports} supports, {created_confirmations} confirmations, {created_updates} updates."
        ))