from django.db import models
from django.core.exceptions import ValidationError


class Budget(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False)
    ready_to_assign = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Account(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, blank=False, null=False)

    class AccountKind(models.TextChoices):
        CHECKING = "Checking"
        SAVINGS = "Savings"
        ASSET = "Asset"

    kind = models.CharField(
        max_length=20, choices=AccountKind.choices, default=AccountKind.CHECKING
    )
    working_balance = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, blank=False, null=False)
    activity = models.IntegerField(default=0)
    available = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Transaction(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    category = models.ForeignKey(
        Category, blank=True, null=True, on_delete=models.CASCADE
    )
    date = models.DateTimeField(blank=False, null=False)
    payee = models.CharField(max_length=50, blank=False, null=False)
    memo = models.CharField(max_length=100, blank=True, null=True)
    outflow = models.IntegerField(default=0)
    inflow = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transaction {self.date.strftime('%d/%m/%Y, %H:%M:%S')}"

    def clean(self):
        if self.category and not self.outflow:
            raise ValidationError("You need to provide an outflow for the category")
        if self.outflow and not self.category:
            raise ValidationError("You need to provide a category for the outflow")
        if not self.outflow and not self.inflow:
            raise ValidationError("You need to provide an inflow or an outflow")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @staticmethod
    def get_pretty_errors(error_dict):
        pretty_errors = []

        for field, messages in error_dict.items():
            for msg in messages:
                if field == "__all__":
                    pretty_errors.append(msg)
                else:
                    msg = msg.replace("This field", f"{field.capitalize()} field")
                    msg = msg.replace(
                        "“” value has an invalid format. It must be in YYYY-MM-DD HH:MM[:ss[.uuuuuu]][TZ] format.",
                        "Date field cannot be blank",
                    )

                    pretty_errors.append(msg)
        return pretty_errors
