from django .urls import path
from . import views

urlpatterns = [
  path("", views.home, name="home"),
  path("accounts", views.list_accounts, name="list-accounts"),
  path("create_account",views.create_account, name="create-account"),
  path("show_account/<account_id>", views.show_account, name="show-account"),
  path("edit_account/<account_id>", views.edit_account, name="edit-account"),
  path("delete_account/<account_id>", views.delete_account, name="delete-account"),

  path("categories", views.list_categories, name="list-categories"),
  path("create_category",views.create_category, name="create-category"),
  path("show_category/<category_id>", views.show_category, name="show-category"),
  path("edit_category/<category_id>", views.edit_category, name="edit-category"),
  path("delete_category/<category_id>", views.delete_category, name="delete-category"),
]
