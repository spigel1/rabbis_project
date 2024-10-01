from django import forms
from .models import Person

class PersonForm(forms.ModelForm):
    wife = forms.ModelMultipleChoiceField(
        queryset=Person.objects.all(),
        required=False,
        widget=forms.SelectMultiple
    )
    
    notable_offspring = forms.ModelMultipleChoiceField(
        queryset=Person.objects.all(),
        required=False,
        widget=forms.SelectMultiple
    )

    class Meta:
        model = Person
        fields = ['name', 'birth_year', 'lifespan', 'wife', 'father', 'notable_offspring']  # Include all relevant fields

class ExcelUploadForm(forms.Form):
    file = forms.FileField(label='Select an Excel file')