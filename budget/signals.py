from .models import Category, Budget
import django.dispatch

budget_assign_signal = django.dispatch.Signal()


def update_category_and_budget(sender, **kwargs):
    budget = Budget.objects.first()
    category = Category.objects.get(id=kwargs.get("category_id"))
    amount = kwargs.get("amount")

    budget.ready_to_assign = budget.ready_to_assign - amount
    category.available = category.available + amount
    budget.save()
    category.save()


budget_assign.connect(update_category_and_budget)
