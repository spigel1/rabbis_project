import pandas as pd
from django.core.management.base import BaseCommand
from rabbis.models import Person

class Command(BaseCommand):
    help = 'Import people data from Excel'

    def handle(self, *args, **kwargs):
        file_path = r'C:\Users\USER\OneDrive\שולחן העבודה\שימוש תלמידי חכמים\האדם עד 12 השבטים לצורך נסיונות.xlsx'
        df = pd.read_excel(file_path)

        print(df.head())  # Print the first few rows for debugging

        for index, row in df.iterrows():
            print(f"Processing row {index}: {row['name']}")

            # Look up father
            father = Person.objects.filter(name=row['father']).first() if pd.notna(row['father']) else None
            
            # Create or update the Person
            try:
                # Create or retrieve the person
                person, created = Person.objects.get_or_create(
                    name=row['name'],
                    defaults={
                        'birth_year': row.get('birth_year'),
                        'lifespan': row.get('lifespan'),
                        'father': father
                    }
                )

                if not person:
                    print(f"Failed to create or retrieve person for {row['name']}")
                    continue  # Skip this row if person is not created
                
                print(f"Created: {created}, Person ID: {person.id}")

                # Handle multiple wives (assuming comma-separated in Excel)
                if pd.notna(row['wife']):
                    wife_names = row['wife'].split(",")  # Split the wife names by comma
                    for wife_name in wife_names:
                        wife_name = wife_name.strip()
                        wife = Person.objects.filter(name=wife_name).first()
                        if wife:
                            person.wife.add(wife)  # Add wife to the ManyToManyField
                        else:
                            print(f"Wife not found: {wife_name}")

                # Handle notable offspring relationships (assuming comma-separated in Excel)
                if pd.notna(row['notable_offspring']):
                    notable_offspring_names = row['notable_offspring'].split(",")  # Split by comma
                    for child_name in notable_offspring_names:
                        child_name = child_name.strip()
                        child = Person.objects.filter(name=child_name).first()
                        if child:
                            person.notable_offspring.add(child)  # Add offspring to ManyToManyField
                        else:
                            print(f"Notable offspring not found: {child_name}")

                # Save the person
                person.save()
            except Exception as e:
                print(f"Error while processing {row['name']}: {e}")

        self.stdout.write(self.style.SUCCESS('Successfully imported people data.'))
