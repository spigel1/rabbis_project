import pandas as pd
from django.core.management.base import BaseCommand
from rabbis.models import Person

class Command(BaseCommand):
    help = 'Import rabbi data from an Excel file'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to the Excel file')

    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']
        data = pd.read_excel(file_path)

        # Create a mapping of names to Person instances for easy linking later
        person_mapping = {}

        # Step 1: Create Person entities from the Excel data
        for index, row in data.iterrows():
            name = row['name']
            birth_year = row['birth_year'] if pd.notna(row['birth_year']) else None
            lifespan = row['lifespan'] if pd.notna(row['lifespan']) else None
            notable_offspring = row['notable_offspring']
            wife = row['wife']
            father = row['father']

            # Create a new Person instance
            person, created = Person.objects.get_or_create(
                name=name,
                defaults={
                    'birth_year': birth_year,
                    'lifespan': lifespan,
                }
            )
            person_mapping[name] = person  # Store the instance in the mapping

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created entity: {person}'))

        # Step 2: Establish relationships based on the mappings
        for index, row in data.iterrows():
            name = row['name']
            notable_offspring_names = row['notable_offspring'].split(',') if isinstance(row['notable_offspring'], str) else []
            wife_names = row['wife'].split(',') if isinstance(row['wife'], str) else []
            father_name = row['father'] if isinstance(row['father'], str) else None
            
            person = person_mapping.get(name)

            # Link wives
            for wife_name in wife_names:
                wife_name = wife_name.strip()
                wife_person = person_mapping.get(wife_name)
                if wife_person:
                    person.wife.add(wife_person)
                    self.stdout.write(self.style.SUCCESS(f'Linked {person} with wife {wife_person}'))

            # Link notable offspring
            for offspring_name in notable_offspring_names:
                offspring_name = offspring_name.strip()
                offspring_person = person_mapping.get(offspring_name)
                if offspring_person:
                    person.notable_offspring.add(offspring_person)
                    self.stdout.write(self.style.SUCCESS(f'Linked {person} with notable offspring {offspring_person}'))

            # Link father
            if father_name:
                father_person = person_mapping.get(father_name)
                if father_person:
                    person.father = father_person
                    person.save()
                    self.stdout.write(self.style.SUCCESS(f'Linked {person} with father {father_person}'))

        self.stdout.write(self.style.SUCCESS('Successfully imported people data and established relationships.'))
