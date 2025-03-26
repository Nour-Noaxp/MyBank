from django import forms
from django.forms import ModelForm
from .models import Account
from .models import Category

class AccountForm(ModelForm):
  class Meta:
    model = Account
    fields = ("budget", "name", "kind", "working_balance")

class CategoryForm(ModelForm):
  class Meta:
    model = Category
    fields = ("budget", "name", "activity", "available")
