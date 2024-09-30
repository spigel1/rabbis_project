from django.contrib import admin
from .models import Person

class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'birth_year', 'lifespan', 'unique_id', 'notable_offspring')
    search_fields = ['name']
    
    # # Adding filters to help link people directly
    # filter_horizontal = ('notable_offspring',)  # For ManyToMany relationships

    # fieldsets = (
    #     (None, {
    #         'fields': ('name', 'birth_year', 'lifespan', 'wife', 'father', 'notable_offspring')
    #     }),
    # )

admin.site.register(Person, PersonAdmin)