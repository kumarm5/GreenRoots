# GreenRoots — Backend (Django)

Backend for the GreenRoots tree-plantation platform (Django 5 + DRF + Token Auth).

## Summary
Provides:
- accounts app: custom User, PlanterProfile, token auth, registration/login APIs.
- plantations app: projects, resource needs, supports, confirmations, updates, admin, API endpoints.
- Management commands to seed test data.

## Requirements
- Python 3.10+ (match your environment)
- Django 5.x
- djangorestframework >= 3.15
- djangorestframework-authtoken
- django-filter
- Pillow (for ImageFields)

Install (recommended inside venv):
```bash
python -m venv .venv
.\.venv\Scripts\activate    # Windows PowerShell/CMD
pip install -r requirements.txt
```

Example requirements (if not present):
- django
- djangorestframework
- djangorestframework-authtoken
- django-filter
- pillow

## Configuration
Edit `GreenRoots/settings.py` and ensure:
- AUTH_USER_MODEL = "accounts.User"
- INSTALLED_APPS includes `rest_framework`, `rest_framework.authtoken`, `django_filters`, `accounts`, `plantations`
- REST_FRAMEWORK uses TokenAuthentication and sensible defaults:
```py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework.authentication.TokenAuthentication"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
}
```
- MEDIA_URL and MEDIA_ROOT set:
```py
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
```

## Database setup & migrations
From project root (where manage.py lives):
```bash
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
```

## Create superuser
```bash
python manage.py createsuperuser
```

## Seed test data
Two management commands are available:

1. Seed accounts (supporters + planters)
```bash
python manage.py seed_accounts --supporters 5 --planters 3
# use --clear to remove previous seeded users (emails starting with seed_)
```

2. Seed plantations (projects, needs, supports, confirmations, updates)
```bash
python manage.py seed_plantations --projects-per-planter 2 --needs-per-project 3 --supports-per-need 2
# use --clear to wipe plantation data before seeding
```

Seeded users use password: `password123` (change in commands if you desire).

## Run development server
```bash
python manage.py runserver
```

To serve media files in development, ensure project `urls.py` has:
```py
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ... your urls
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## APIs (summary)
Base URL: `/api/`

Accounts (token authentication)
- POST /api/accounts/register/ — register (returns token + user)
- POST /api/accounts/login/ — login (returns token + user)
- POST /api/accounts/logout/ — logout (delete token)
- GET /api/accounts/me/ — current user
- GET/PATCH /api/accounts/my-profile/ — planter profile (planter only)

Plantations
- GET /api/plantations/projects/ — list (filters: plantation_type, state, status; search: title, location; paginated)
- GET /api/plantations/projects/{id}/ — project details (includes planter summary, resource needs, recent updates)
- POST /api/plantations/projects/ — create (planter only)
- PATCH/DELETE /api/plantations/projects/{id}/ — owner only
- GET /api/plantations/my-projects/ — projects owned by logged-in planter

Resource Needs
- GET/POST /api/plantations/resource-needs/
- PATCH/DELETE /api/plantations/resource-needs/{id}/ — owner only

Supports
- POST /api/plantations/supports/ — supporters only
- GET /api/plantations/my-supports/ — supporter only
- GET /api/plantations/project-supports/ — planter only (supports for planter's projects)

Confirmations
- POST /api/plantations/confirmations/ — planter only (one per support)
- GET /api/plantations/confirmations/{id}/

Updates
- POST /api/plantations/updates/ — planter only
- PATCH/DELETE /api/plantations/updates/{id}/ — owner only
- GET /api/plantations/projects/{id}/updates/ — public

Authentication: Token header:
```
Authorization: Token <token>
```

## Admin
- Register/deregister users, planter profiles, projects, needs, supports, confirmations, updates in Django admin.
- Use search, filters and inlines provided by admin configuration.

## Testing
Run test suite:
```bash
python manage.py test
```

## Swagger / API docs
If Swagger or DRF schemas are configured in project URLs, those endpoints will expose the APIs. Add drf-yasg or drf-spectacular if needed.

## Notes & best practices
- Validate important fields (e.g. trees_planted <= target_trees).
- Use select_related / prefetch_related in views for queryset optimization (already applied in views).
- Use Token Authentication for API clients or switch to JWT for mobile/production scenarios.
- Protect media storage and configure S3 / cloud storage for production.
- Rotate seeded passwords / remove seed accounts in production.

## Troubleshooting
- Migration issues: run `python manage.py makemigrations accounts plantations` then `migrate`.
- Missing MEDIA directory: create `media/` in project root or set MEDIA_ROOT to an existing path.
- If signals not creating PlanterProfile, ensure `accounts.apps.AccountsConfig` is used in INSTALLED_APPS.

For further changes (tests, CI, Docker, deploy), extend this README with environment and deployment instructions.