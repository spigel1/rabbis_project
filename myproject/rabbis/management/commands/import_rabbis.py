import pandas as pd
from django.core.management.base import BaseCommand
from rabbis.models import Person

class Command(BaseCommand):
    help = 'Import rabbis data from Excel'

    def handle(self, *args, **kwargs):
        file_path = r'C:\Users\USER\OneDrive\שולחן העבודה\שימוש תלמידי חכמים\האדם עד 12 השבטים לצורך נסיונות.xlsx'
        df = pd.read_excel(file_path)

        print(df.head())  # Print the first few rows of the DataFrame for debugging

        for index, row in df.iterrows():
            print(f"Processing row {index}: {row['name']}")

            # Look up father and wife
            father = Person.objects.filter(name=row['father']).first() if pd.notna(row['father']) else None
            wife = Person.objects.filter(name=row['wife']).first() if pd.notna(row['wife']) else None
            
            print(f"Father: {father}, Wife: {wife}")

            # Create or update the Person
            try:
                person, created = Person.objects.get_or_create(
                    name=row['name'],
                    defaults={
                        'birth_year': row.get('birth_year'),
                        'lifespan': row.get('lifespan'),
                        'wife': wife,
                        'father': father
                    }
                )

                if not person:
                    print(f"Failed to create or retrieve person for {row['name']}")
                    continue  # Skip to the next iteration if person is None

                print(f"Created: {created}, Person ID: {person.id}")

                # Handle notable offspring relationships
                if pd.notna(row['notable_offspring']):
                    notable_offspring_names = row['notable_offspring'].split(",")  # Assuming they are comma-separated
                    for child_name in notable_offspring_names:
                        child_name = child_name.strip()
                        child = Person.objects.filter(name=child_name).first()
                        if child:
                            person.notable_offspring.add(child)
                        else:
                            print(f"Child not found: {child_name}")

                person.save()
            except Exception as e:
                print(f"Error while processing {row['name']}: {e}")

        self.stdout.write(self.style.SUCCESS('Successfully imported people data.'))
