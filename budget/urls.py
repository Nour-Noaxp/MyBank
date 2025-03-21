from django .urls import path
from . import views

urlpatterns = [
  path("", views.home, name="home"),
  path("accounts", views.list_accounts, name="list-accounts"),
  path("create_account",views.create_account, name="create-account"),
  path("show_account/<account_id>", views.show_account, name="show-account"),
  path("update_account/<account_id>", views.update_account, name="update-account"),
  path("delete_account/<account_id>", views.delete_account, name="delete-account"),
]
