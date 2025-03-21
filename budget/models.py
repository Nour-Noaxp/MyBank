from django.db import models

class Budget(models.Model):
  name = models.CharField(max_length=50, null=False)
  ready_to_assign = models.IntegerField(default=0)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  def __str__(self):
      return self.name

class Account(models.Model):
  budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
  name = models.CharField(max_length=50, null=False)

  class AccountType(models.TextChoices):
    CASH_ACCOUNTS = "Cash Account"
    CREDIT_ACCOUNTS = "Credit Accounts"
    MORTGAGES_AND_LOANS = "Mortgages and Loans"
    TRACKING_ACCOUNTS = "Tracking Accounts"

  type = models.CharField(max_length=20, choices=AccountType.choices, default=AccountType.CASH_ACCOUNTS)
  working_balance = models.IntegerField(default=0)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.name

class Category(models.Model):
  budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
  name = models.CharField(max_length=50, null=False)
  activity = models.IntegerField(default=0)
  available = models.IntegerField(default=0)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  
  def __str__(self):
    return self.name

class Transaction(models.Model):
  account = models.ForeignKey(Account, on_delete=models.CASCADE)
  category = models.ForeignKey(Category, blank=True, null=True, on_delete=models.SET_NULL)
  date = models.DateTimeField(null=False)
  payee = models.CharField(max_length=50)
  memo = models.CharField(max_length=100)
  outflow = models.IntegerField(default=0)
  inflow = models.IntegerField(default=0)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
