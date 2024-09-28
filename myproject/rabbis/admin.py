from django.contrib import admin
from .models import Person, SpousalRelationship

# Registering the Person model
admin.site.register(Person)

# Registering the SpousalRelationship model
admin.site.register(SpousalRelationship)
