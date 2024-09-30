from django.contrib import admin
from .models import Person

class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'birth_year', 'lifespan', 'unique_id')  # Notable offspring handled separately
    search_fields = ['name']
    filter_horizontal = ('wife', 'notable_offspring')  # Enables better multi-select in admin

admin.site.register(Person, PersonAdmin)
