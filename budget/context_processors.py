from .models import Account


def global_variables(request):
    return {
        "accounts": Account.objects.all(),
    }
