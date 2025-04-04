from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Account, Budget, Category
from .forms import AccountForm, CategoryForm

# from .signals import update_category_and_budget
from .signals import budget_assign_signal


def dashboard_view(request):
    budget = Budget.objects.first()
    categories = Category.objects.filter(budget=budget)
    ready_to_assign = budget.ready_to_assign
    return render(
        request,
        "dashboard.html",
        {"categories": categories, "ready_to_assign": ready_to_assign},
    )


class AssignForm:
    def __init__(self):
        pass


def budget_assign_view(request):
    if request.method == "POST":
        category_id = request.POST.get("category")
        amount = int(request.POST.get("amount"))
        # update_category_and_budget(category_id, amount)
        budget_assign_signal.send(
            sender=AssignForm, category_id=category_id, amount=amount
        )
        messages.success(request, "Budget Successfully Assigned to category")
        return redirect("dashboard")
    messages.error(request, "Invalid data, please the amount and category")
    return redirect("dashboard")


def account_create_view(request):
    form = AccountForm
    budget = Budget.objects.first()
    if request.method == "POST":
        form = AccountForm(request.POST)
        if form.is_valid():
            account = form.save(commit=False)
            account.budget = budget
            budget.ready_to_assign = (
                budget.ready_to_assign + form.cleaned_data["working_balance"]
            )
            form.save()
            budget.save()
            messages.success(request, "Account Successfully Created!")
            return redirect("account-show", account_id=account.id)
    return render(request, "account_create.html", {"form": form})


def account_show_view(request, account_id):
    account = get_object_or_404(Account, pk=account_id)
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
