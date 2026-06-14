from django.urls import path
from . import views

app_name = "plantations"

urlpatterns = [
    # Projects
    path("projects/", views.PlantationProjectListCreateView.as_view(), name="projects_list_create"),
    path("projects/<int:id>/", views.PlantationProjectDetailView.as_view(), name="projects_detail"),
    path("my-projects/", views.MyProjectsView.as_view(), name="my_projects"),
    # Resource needs
    path("resource-needs/", views.ResourceNeedListCreateView.as_view(), name="resource_needs_list_create"),
    path("resource-needs/<int:id>/", views.ResourceNeedDetailView.as_view(), name="resource_needs_detail"),
    # Supports
    path("supports/", views.ProjectSupportCreateView.as_view(), name="support_create"),
    path("my-supports/", views.MySupportsView.as_view(), name="my_supports"),
    path("project-supports/", views.ProjectSupportsForPlanterView.as_view(), name="project_supports"),
    # Confirmations
    path("confirmations/", views.ReceiptConfirmationCreateView.as_view(), name="confirmation_create"),
    path("confirmations/<int:id>/", views.ReceiptConfirmationDetailView.as_view(), name="confirmation_detail"),
    # Updates
    path("updates/", views.PlantationUpdateCreateView.as_view(), name="update_create"),
    path("updates/<int:id>/", views.PlantationUpdateDetailView.as_view(), name="update_detail"),
    path("projects/<int:project_id>/updates/", views.ProjectUpdatesListView.as_view(), name="project_updates"),
]