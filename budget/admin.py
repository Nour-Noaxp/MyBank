from django.contrib import admin
from .models import Budget, Account, Category, Transaction

# Register your models here.
admin.site.register(Budget)
admin.site.register(Account)
admin.site.register(Category)
admin.site.register(Transaction)
