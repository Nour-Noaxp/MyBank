from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Account
from .models import Category
from .forms import AccountForm
from .forms import CategoryForm

def home(request):
  return render(request, "home.html")

def create_account(request):
  form = AccountForm
  if request.method == "POST":
    form = AccountForm(request.POST)
    if form.is_valid():
      account=form.save()
      messages.success(request, "Account Successfully Created!")
      return redirect("show-account", account_id=account.id)
  return render(request, "create_account.html", {"form": form})

def show_account(request, account_id):
  account = Account.objects.get(pk=account_id)
  return render(request, "show_account.html", {"account": account})

def list_accounts(request):
  accounts = Account.objects.all()
  return render(request, "accounts.html", {"accounts": accounts})

def edit_account(request, account_id):
  account = Account.objects.get(pk=account_id)
  form = AccountForm(request.POST or None, instance=account)
  if form.is_valid():
    form.save()
    messages.success(request, "Account Successfully Updated!")
    return redirect("list-accounts")
  return render(request, "edit_account.html", {"account": account, "form": form, "account_id": account.id})

def delete_account(request, account_id):
  account = Account.objects.get(pk=account_id)
  account.delete()
  messages.success(request, "Account Successfully Deleted!")
  return redirect("list-accounts")


def create_category(request):
  form = CategoryForm
  if request.method == "POST":
    form = CategoryForm(request.POST)
    if form.is_valid():
      category = form.save()
      messages.success(request, "Category Successfully Created!")
      return redirect("show-category", category_id=category)
  return render(request,"create_category.html", {"form": form})

def show_category(request, category_id):
  category = Category.objects.get(pk=category_id)
  return render(request, "show_category.html", {"category": category})

def list_categories(request):
  categories = Category.objects.all()
  return render(request, "categories.html", {"categories":categories})

def edit_category(request, category_id):
  category = Category.objects.get(pk=category_id)
  form = CategoryForm(request.POST or None, instance=category)
  if form.is_valid():
    form.save()
    messages.success(request, "Category Successfully Updated!")
    return redirect("list-categories")
  return render(request, "edit_category.html", {"category": category, "form": form, "category_id": category.id})

def delete_category(request, category_id):
  category = Category.objects.get(pk=category_id)
  category.delete()
  messages.success("Category Successfully Deleted!")
  return redirect("list-categories")
