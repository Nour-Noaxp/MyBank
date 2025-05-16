from django.db.models.signals import post_save, pre_delete
from .models import Account, Budget, Transaction
from django.dispatch import receiver


@receiver(post_save, sender=Account)
def update_budget(sender, instance, created, **kwargs):
    print("post save Transaction signal triggered!")
    budget = Budget.objects.first()
    if created:
        budget.ready_to_assign += instance.working_balance
        budget.save()


@receiver(post_save, sender=Transaction)
def update_category_and_account(sender, instance, created, **kwargs):
    print("post save Transaction signal triggered!")
    if created:
        print(
            f"new transaction created with inflow : {instance.inflow} and outflow of : {instance.outflow}"
        )
        if instance.outflow > 0:
            print(f"this outflow amount will be reduced : {instance.outflow}")
            category = instance.category
            category.available -= instance.outflow
            category.activity -= instance.outflow
            print(
                f"account working balance before : {instance.account.working_balance}"
            )
            instance.account.working_balance -= instance.outflow
            print(f"account working balance after : {instance.account.working_balance}")
            category.save()
            instance.account.save()
        elif instance.inflow > 0:
            print(
                f"this inflow amount will be added : {instance.inflow}", instance.inflow
            )
            budget = instance.account.budget
            print(
                f"account working balance before : {instance.account.working_balance}"
            )
            instance.account.working_balance += instance.inflow
            print(f"account working balance after : {instance.account.working_balance}")
            budget.ready_to_assign += instance.inflow
            instance.account.save()
            budget.save()


@receiver(pre_delete, sender=Transaction)
def delete_transaction(sender, instance, **kwargs):
    print("pre_delete Transaction signal triggered!")
    if instance.outflow > 0:
        print(f"this outflow amount will be added : {instance.outflow}")
        category = instance.category
        category.available += instance.outflow
        category.activity += instance.outflow
        print(f"account working balance before : {instance.account.working_balance}")
        instance.account.working_balance += instance.outflow
        print(f"account working balance after : {instance.account.working_balance}")
        category.save()
        instance.account.save()
    elif instance.inflow > 0:
        print(f"this inflow amount will be reduced : {instance.inflow}")
        budget = instance.account.budget
        print(f"account working balance before : {instance.account.working_balance}")
        instance.account.working_balance -= instance.inflow
        print(f"account working balance after : {instance.account.working_balance}")
        budget.ready_to_assign -= instance.inflow
        instance.account.save()
        budget.save()
