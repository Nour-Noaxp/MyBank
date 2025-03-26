from django import forms
from django.forms import ModelForm
from .models import Account, Budget

class AccountForm(ModelForm):
  # budget = forms.models.CharField(choices=AccountKind.choices, disabled=True)
  # budget = forms.CharField(disabled=True)
  class Meta:
    model = Account
    fields = ("name", "kind", "working_balance")
