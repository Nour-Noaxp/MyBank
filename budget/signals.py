from django.db.models.signals import post_save
from .models import Account, Budget
from django.dispatch import receiver


@receiver(post_save, sender=Account)
def update_budget(sender, instance, **kwargs):
    budget = Budget.objects.first()
    budget.ready_to_assign = budget.ready_to_assign + instance.working_balance
    budget.save()
