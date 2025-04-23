from django.db.models.signals import post_save
from .models import Account, Budget, Transaction
from django.dispatch import receiver


@receiver(post_save, sender=Account)
def update_budget(sender, instance, **kwargs):
    budget = Budget.objects.first()
    budget.ready_to_assign += instance.working_balance
    budget.save()


@receiver(post_save, sender=Transaction)
def update_category_and_account(sender, instance, **kwargs):
    if instance.outflow > 0:
        instance.category.available -= instance.outflow
        instance.category.activity -= instance.outflow
        instance.account.working_balance -= instance.outflow
        instance.category.save()
        instance.account.save()
    elif instance.inflow > 0:
        budget = instance.account.budget
        instance.account.working_balance += instance.inflow
        budget.ready_to_assign += instance.inflow
        instance.account.save()
        budget.save()
