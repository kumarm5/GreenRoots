from django.core.management.base import BaseCommand
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.contrib.auth import get_user_model

from rest_framework.authtoken.models import Token

import random
import string

from accounts.models import PlanterProfile

User = get_user_model()


def random_username(prefix="user"):
    return f"{prefix}_{''.join(random.choices(string.ascii_lowercase + string.digits, k=6))}"


class Command(BaseCommand):
    help = "Seed accounts: create SUPPORTER and PLANTER users and tokens"

    def add_arguments(self, parser):
        parser.add_argument("--supporters", type=int, default=3, help="Number of supporter users to create")
        parser.add_argument("--planters", type=int, default=2, help="Number of planter users to create")
        parser.add_argument("--clear", action="store_true", help="Delete existing seeded users (email starts with seed_) before creating")

    @transaction.atomic
    def handle(self, *args, **options):
        supporters = options["supporters"]
        planters = options["planters"]
        clear = options["clear"]

        created = {"supporters": [], "planters": []}

        if clear:
            qs = User.objects.filter(email__startswith="seed_")
            count = qs.count()
            qs.delete()
            self.stdout.write(self.style.WARNING(f"Deleted {count} seeded users"))

        # create supporters
        for i in range(supporters):
            username = random_username("support")
            email = f"seed_supporter_{i+1}@example.com"
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
            else:
                user = User.objects.create(
                    username=username,
                    email=email,
                    first_name="Support",
                    last_name=str(i + 1),
                    role="SUPPORTER",
                    is_active=True,
                    date_joined=timezone.now(),
                )
                user.set_password("password123")
                user.save()
            token, _ = Token.objects.get_or_create(user=user)
            created["supporters"].append({"email": user.email, "token": token.key})

        # create planters
        for i in range(planters):
            username = random_username("planter")
            email = f"seed_planter_{i+1}@example.com"
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
            else:
                user = User.objects.create(
                    username=username,
                    email=email,
                    first_name="Planter",
                    last_name=str(i + 1),
                    role="PLANTER",
                    is_active=True,
                    date_joined=timezone.now(),
                )
                user.set_password("password123")
                user.save()
            # ensure PlanterProfile exists (signals may already handle this)
            PlanterProfile.objects.get_or_create(user=user, defaults={"location": "Unknown", "state": "Unknown"})
            token, _ = Token.objects.get_or_create(user=user)
            created["planters"].append({"email": user.email, "token": token.key})

        self.stdout.write(self.style.SUCCESS(f"Created {len(created['supporters'])} supporters and {len(created['planters'])} planters"))
        for role in ("supporters", "planters"):
            for u in created[role]:
                self.stdout.write(f"{role[:-1].capitalize()}: {u['email']}  token={u['token']}")