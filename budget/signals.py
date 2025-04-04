from .models import Category, Budget


def update_category_and_budget(category_id, amount):
    category = Category.objects.get(id=category_id)
    budget = Budget.objects.first()

    category.available = category.available + amount
    budget.ready_to_assign = budget.ready_to_assign - amount
    category.save()
    budget.save()
