from django.db.models.signals import post_save
from .models import Account, Budget, Transaction
from django.dispatch import receiver


@receiver(post_save, sender=Account)
def update_budget(sender, instance, created, **kwargs):
    budget = Budget.objects.first()
    if created:
        budget.ready_to_assign += instance.working_balance
        budget.save()


@receiver(post_save, sender=Transaction)
def update_category_and_account(sender, instance, created, **kwargs):
    account = instance.account
    if created:
        if instance.outflow > 0:
            category = instance.category
            category.available -= instance.outflow
            category.activity -= instance.outflow
            account.working_balance -= instance.outflow
            category.save()
            account.save()
        elif instance.inflow > 0:
            budget = instance.account.budget
            account.working_balance += instance.inflow
            budget.ready_to_assign += instance.inflow
            account.save()
            budget.save()
