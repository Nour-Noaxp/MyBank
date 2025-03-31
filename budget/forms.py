from django.forms import ModelForm
from .models import Account, Category


class AccountForm(ModelForm):
    class Meta:
        model = Account
        fields = ("name", "kind", "working_balance")


class CategoryForm(ModelForm):
    class Meta:
        model = Category
        fields = ("name",)
