from django .urls import path
from . import views

urlpatterns = [
  path("", views.homepage_view, name="homepage"),
  path("homepage", views.homepage_view, name="homepage"),
  path("accounts", views.accounts_list_view, name="accounts-list"),
  path("accounts/new",views.account_create_view, name="account-create"),
  path("accounts/<account_id>", views.account_show_view, name="account-show"),
  path("accounts/<account_id>/edit", views.account_edit_view, name="account-edit"),
  path("accounts/<account_id>/delete", views.account_delete_view, name="account-delete"),
]
