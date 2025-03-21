from django.shortcuts import render, redirect, HttpResponseRedirect
from django.contrib import messages
from .models import Account
from .forms import AccountForm

def home(request):
  return render(request, "home.html")

def create_account(request):
  form = AccountForm
  if request.method == "POST":
    form = AccountForm(request.POST)
    if form.is_valid():
      form.save()
      messages.success(request, "Account Successfully Created!")
      return redirect("show-account")
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
  return render(request, "edit_account.html", {"account": account, "form": form})

def delete_account(request, account_id):
  account = Account.objects.get(pk=account_id)
  account.delete()
  messages.success(request, "Account Successfully Deleted!")
  return redirect("list-accounts")
