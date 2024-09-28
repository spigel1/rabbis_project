import pandas as pd
from django.core.management.base import BaseCommand
from rabbis.models import Person

class Command(BaseCommand):
    help = 'Import rabbis data from Excel'

    def handle(self, *args, **kwargs):
        # Load the Excel file
        file_path = r'C:\Users\USER\OneDrive\שולחן העבודה\שימוש תלמידי חכמים\האדם עד 12 השבטים לצורך נסיונות.xlsx'
        df = pd.read_excel(file_path)

        for index, row in df.iterrows():
            # Assuming column names in Excel are 'name', 'birth_year', 'notable_offspring', 'wife', 'father', and 'lifespan'
            
            # Handle father relationship
            father = None
            if pd.notna(row['father']):  # Check if the father field has a value
                father = Person.objects.filter(name=row['father']).first()  # Match by name or adjust as needed

            # Create a Person instance
            person = Person(
                name=row['name'],
                birth_year=row['birth_year'] if pd.notna(row['birth_year']) else None,
                notable_offspring=row['notable_offspring'] if pd.notna(row['notable_offspring']) else '',
                wife=row['wife'] if pd.notna(row['wife']) else '',
                father=father,
                lifespan=row['lifespan'] if pd.notna(row['lifespan']) else None
            )
            person.save()

        self.stdout.write(self.style.SUCCESS('Successfully imported rabbis data'))
