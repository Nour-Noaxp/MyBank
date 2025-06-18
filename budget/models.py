from django.db import models
from django.db.models import Sum
from django.db.models.functions import Extract
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

    @classmethod
    def auto_assign(cls):
        ready_to_assign = Budget.objects.first().ready_to_assign
        remaining_budget_for_partial_assign = 0
        underfunded_categories_qs = Category.objects.filter(available__lt=0).order_by(
            "-available"
        )
        underfunded_categories = list(underfunded_categories_qs)
        total_to_fund = -(
            underfunded_categories_qs.aggregate(total=Sum("available"))["total"] or 0
        )
        fully_fundable_categories = []
        partially_fundable_categories = []

        for category in underfunded_categories:
            amount_to_fund = -category.available
            if ready_to_assign >= amount_to_fund:
                fully_fundable_categories.append(category)
                ready_to_assign -= amount_to_fund
            elif 0 < ready_to_assign < amount_to_fund:
                partially_fundable_categories.append(category)
                remaining_budget_for_partial_assign = ready_to_assign
                break

        return {
            "underfunded_categories": list(underfunded_categories_qs),
            "total_to_fund": total_to_fund,
            "fully_fundable_categories": fully_fundable_categories,
            "partially_fundable_categories": partially_fundable_categories,
            "remaining_budget_for_partial_assign": remaining_budget_for_partial_assign,
        }

    @classmethod
    def reports_data(cls):
        data = {
            "categories": {},
            "total_spending": (
                Transaction.objects.aggregate(total=Sum("outflow"))["total"] or 0
            ),
            "average_spending": 0,
            "chart_labels": [],
            "chart_data": [],
            "chart_percentages": [],
        }

        if data["total_spending"] == 0:
            return data

        for category in Category.objects.all():
            if category.transactions.exists():
                spending = category.transactions.aggregate(Sum("outflow"))[
                    "outflow__sum"
                ]
                spending_percentage = round(spending * 100 / data["total_spending"], 2)
                data["categories"][category.name] = {
                    "spending": spending,
                    "spending_percentage": spending_percentage,
                }
                data["chart_labels"].append(category.name)
                data["chart_data"].append(spending)
                data["chart_percentages"].append(spending_percentage)

        if len(data["categories"]) > 0:
            data["average_spending"] = round(
                (data["total_spending"] / len(data["categories"])), 2
            )

        return data


class Transaction(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    category = models.ForeignKey(
        Category,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="transactions",
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

    @classmethod
    def cashflow_data(cls):
        data = {"months": [], "income": [], "spending": []}
        data_qs = (
            Transaction.objects.values(month=Extract("date", "month"))
            .annotate(income=Sum("inflow"), spending=Sum("outflow"))
            .order_by("month")
        )
        months_in_letters = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December",
        }

        clean_data = {"months": [], "income": [], "spending": []}
        data_qs_months = [elt["month"] for elt in data_qs]
        data_qs_income = [elt["income"] for elt in data_qs]
        data_qs_spending = [elt["spending"] for elt in data_qs]
        for i in range(1, 13):
            if i in data_qs_months:
                clean_data["months"].append(months_in_letters[i])
                clean_data["income"].append(data_qs_income[data_qs_months.index(i)])
                clean_data["spending"].append(data_qs_spending[data_qs_months.index(i)])
            else:
                clean_data["months"].append(months_in_letters[i])
                clean_data["income"].append(0)
                clean_data["spending"].append(0)

        months = clean_data["months"]
        income = clean_data["income"]
        spending = clean_data["spending"]

        data["months"] = months
        data["income"] = income
        data["spending"] = spending

        return data
