from django import forms
from django.forms import ModelForm
from .models import Account, Budget

class AccountForm(ModelForm):
  class Meta:
    model = Account
    fields = ("name", "kind", "working_balance")
    