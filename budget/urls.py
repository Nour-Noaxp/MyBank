from django.urls import path
from . import views

urlpatterns = [
    path("", views.dashboard_view, name="dashboard"),
    path("homepage", views.dashboard_view, name="dashboard"),
    path("dashboard", views.dashboard_view, name="dashboard"),
    path("accounts", views.accounts_list_view, name="accounts-list"),
    path("accounts/new", views.account_create_view, name="account-create"),
    path("accounts/<account_id>", views.account_show_view, name="account-show"),
    path("accounts/<account_id>/edit", views.account_edit_view, name="account-edit"),
    path(
        "accounts/<account_id>/delete", views.account_delete_view, name="account-delete"
    ),
    path("categories", views.categories_list_view, name="categories-list"),
    path("categories/new", views.category_create_view, name="category-create"),
    path("categories/<category_id>", views.category_show_view, name="category-show"),
    path(
        "categories/<category_id>/edit", views.category_edit_view, name="category-edit"
    ),
    path(
        "categories/<category_id>/delete",
        views.category_delete_view,
        name="category-delete",
    ),
]
