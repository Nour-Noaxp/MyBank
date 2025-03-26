from django import template

register = template.Library()

@register.filter(name="add_class")
def add_class(value, arg):
    if hasattr(value, "as_widget"):
        return value.as_widget(attrs={"class": arg})
    return value

@register.filter(name="humanize_underscore")
def humanize_underscore(value):
    return value.replace("_", " ").title()

@register.filter(name="is_dict")
def is_dict(value):
    return isinstance(value, dict)
