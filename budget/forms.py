from django import forms
from django.forms import ModelForm
from .models import Budget, Account, Category


class AccountForm(ModelForm):
    class Meta:
        model = Account
        fields = ("name", "kind", "working_balance")


class CategoryForm(ModelForm):
    class Meta:
        model = Category
        fields = ("name",)


class AssignForm(ModelForm):
    budget = Budget.objects.first()
    amount = forms.IntegerField(required=True, label="Assign:")
    category = forms.ModelChoiceField(
        queryset=Category.objects.filter(budget=budget), required=True
    )

    def save(self, commit=True):
        form = form.save(commit=False)
        form.category = self.cleaned_data["category"]
        form.amount = self.cleaned_data["amount"]
        category = form.category
        budget = category.budget
        if commit:
            category.available += form.amount
            category.save()
            budget.ready_to_assign -= form.amount
            budget.save()
        return form
