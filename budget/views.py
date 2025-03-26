from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Account
from .models import Budget
from .forms import AccountForm

def homepage_view(request):
  return render(request, "homepage.html")

def account_create_view(request):
  form = AccountForm
  budget = Budget.objects.first()
  kinds = Account.AccountKind.choices
  if request.method == "POST":
    form = AccountForm(request.POST)
    if form.is_valid():
      form.save()
      messages.success(request, "Account Successfully Created!")
      return redirect("account-show")
  return render(request, "account_create.html", {"form": form, "budget": budget, "kinds": kinds})

def account_show_view(request, account_id):
  account = get_object_or_404(Account, pk=account_id)
  account = Account.objects.get(pk=account_id)
  return render(request, "account_show.html", {"account": account})

def accounts_list_view(request):
  accounts = Account.objects.all()
  return render(request, "accounts_list.html", {"accounts": accounts})

def account_edit_view(request, account_id):
  account = get_object_or_404(Account, pk=account_id)
  form = AccountForm(request.POST or None, instance=account)
  if form.is_valid():
    form.save()
    messages.success(request, "Account Successfully Updated!")
    return redirect("accounts-list")
  return render(request, "account_edit.html", {"account": account, "form": form})

def account_delete_view(request, account_id):
  account = get_object_or_404(Account, pk=account_id)
  account.delete()
  messages.success(request, "Account Successfully Deleted!")
  return redirect("accounts-list")
