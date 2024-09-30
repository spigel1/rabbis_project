from django import forms
from .models import Person

class PersonForm(forms.ModelForm):
    class Meta:
        model = Person
        fields = ['name', 'birth_year', 'lifespan', 'notable_offspring', 'father', 'wife']  # Include all relevant fields
