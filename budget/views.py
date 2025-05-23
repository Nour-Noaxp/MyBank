from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .models import Account, Budget, Category, Transaction
from .forms import AccountForm, CategoryForm
import json


def dashboard_view(request):
    budget = Budget.objects.first()
    categories = Category.objects.filter(budget=budget)
    ready_to_assign = budget.ready_to_assign
    data_categories = Category.auto_assign()
    nbr_fully_fundable_categories = len(data_categories["fully_fundable_categories"])
    nbr_partially_fundable_category = len(
        data_categories["partially_fundable_category"]
    )
    return render(
        request,
        "dashboard.html",
        {
            "categories": categories,
            "ready_to_assign": ready_to_assign,
            "data_categories": data_categories,
            "nbr_fully_fundable_categories": nbr_fully_fundable_categories,
            "nbr_partially_fundable_category": nbr_partially_fundable_category,
        },
    )


def budget_assign_view(request):
    budget = Budget.objects.first()
    if request.method == "POST":
        category_id = request.POST.get("category")
        category = Category.objects.get(id=category_id)
        amount = int(request.POST.get("amount"))
        category.available = category.available + amount
        budget.ready_to_assign = budget.ready_to_assign - amount
        category.save()
        budget.save()
        messages.success(
            request, "Budget Successfully Assigned to {}".format(category.name)
        )
        return redirect("dashboard")
    messages.error(request, "Invalid data, please verify the amount and category")
    return redirect("dashboard")


def budget_auto_assign_view(request):
    budget = Budget.objects.first()
    ready_to_assign = budget.ready_to_assign
    data_categories = Category.auto_assign()
    if data_categories["fully_fundable_categories"]:
        for category in data_categories["fully_fundable_categories"]:
            ready_to_assign += category.available
            category.available -= category.available
            category.save()
    if data_categories["partially_fundable_category"]:
        category = data_categories["partially_fundable_category"][0]
        category.available += ready_to_assign
        ready_to_assign -= ready_to_assign
        category.save()
    budget.ready_to_assign = ready_to_assign
    budget.save()
    return redirect("dashboard")


def account_create_view(request):
    form = AccountForm
    budget = Budget.objects.first()
    if request.method == "POST":
        form = AccountForm(request.POST)
        if form.is_valid():
            account = form.save(commit=False)
            account.budget = budget
            form.save()
            messages.success(request, "Account Successfully Created!")
            return redirect("account-show", account_id=account.id)
    return render(request, "account_create.html", {"form": form})


def account_show_view(request, account_id):
    budget = Budget.objects.first()
    account = get_object_or_404(Account, pk=account_id)
    transactions = Transaction.objects.filter(account=account).order_by("-date")
    categories = Category.objects.filter(budget=budget)
    return render(
        request,
        "account_show.html",
        {"account": account, "transactions": transactions, "categories": categories},
    )


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


def transaction_create_view(request, account_id):
    account = get_object_or_404(Account, pk=account_id)
    if request.method == "POST":
        try:
            fetch_data = json.loads(request.body)
            transaction = Transaction(
                account=account,
                date=fetch_data.get("date"),
                payee=fetch_data.get("payee"),
                category_id=fetch_data.get("category_id") or None,
                memo=fetch_data.get("memo"),
                outflow=fetch_data.get("outflow") or 0,
                inflow=fetch_data.get("inflow") or 0,
            )
            transaction.save()
            data = {
                "success": True,
                "transaction": model_to_dict(transaction),
                "working_balance": account.working_balance,
            }
            if transaction.category:
                data["transaction"]["category"] = model_to_dict(transaction.category)
            else:
                data["transaction"]["category"] = None

            return JsonResponse(data)

        except ValidationError as ve:
            pretty_errors = Transaction.get_pretty_errors(ve.message_dict)
            return JsonResponse(
                {"success": False, "errors": pretty_errors},
            )
    return JsonResponse(
        {"success": False, "message": "Error with request method"},
        status=400,
    )


def transaction_edit_view(request, account_id, transaction_id):
    account = get_object_or_404(Account, pk=account_id)
    transaction = get_object_or_404(
        Transaction, pk=transaction_id, account_id=account_id
    )
    if request.method == "POST":
        try:
            fetch_data = json.loads(request.body)
            new_transaction = Transaction(
                account=account,
                date=fetch_data.get("date"),
                payee=fetch_data.get("payee"),
                category_id=fetch_data.get("category_id") or None,
                memo=fetch_data.get("memo"),
                outflow=fetch_data.get("outflow") or 0,
                inflow=fetch_data.get("inflow") or 0,
            )
            new_transaction.save()
            transaction.delete()
            account.refresh_from_db()

            data = {
                "success": True,
                "transaction": model_to_dict(new_transaction),
                "working_balance": account.working_balance,
            }

            if new_transaction.category:
                data["transaction"]["category"] = model_to_dict(
                    new_transaction.category
                )
            else:
                data["transaction"]["category"] = None

            return JsonResponse(data)

        except ValidationError as ve:
            pretty_errors = Transaction.get_pretty_errors(ve.message_dict)
            return JsonResponse(
                {"success": False, "errors": pretty_errors},
            )
    return JsonResponse(
        {"success": False, "message": "Error with request method"},
        status=400,
    )


def transaction_delete_view(request, account_id, transaction_id):
    if request.method == "DELETE":
        try:
            transaction = get_object_or_404(
                Transaction, pk=transaction_id, account_id=account_id
            )
            transaction.delete()
            data = {
                "success": True,
                "message": "Transaction deleted with success",
                "transaction_id": transaction_id,
                "working_balance": transaction.account.working_balance,
            }
            return JsonResponse(data)

        except ValidationError as ve:
            return JsonResponse(
                {"success": False, "errors": ve.message_dict},
            )
    return JsonResponse(
        {"success": False, "errors": "Error whith request method"},
        status=400,
    )


def category_create_view(request):
    form = CategoryForm
    budget = Budget.objects.first()
    if request.method == "POST":
        form = CategoryForm(request.POST)
        if form.is_valid():
            category = form.save(commit=False)
            category.budget = budget
            form.save()
            messages.success(request, "Category Successfully Created!")
            return redirect("category-show", category_id=category.id)
    return render(request, "category_create.html", {"form": form})


def category_show_view(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    return render(request, "category_show.html", {"category": category})


def categories_list_view(request):
    categories = Category.objects.all()
    return render(request, "categories_list.html", {"categories": categories})


def category_edit_view(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    form = CategoryForm(request.POST or None, instance=category)
    if form.is_valid():
        form.save()
        messages.success(request, "Category Successfully Updated!")
        return redirect("categories-list")
    return render(request, "category_edit.html", {"category": category, "form": form})


def category_delete_view(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    category.delete()
    messages.success(request, "Category Successfully Deleted!")
    return redirect("categories-list")
