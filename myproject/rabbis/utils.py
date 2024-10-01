import pandas as pd
from rabbis.models import Person

def import_from_excel(file):
    data = pd.read_excel(file)

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

        # Link notable offspring
        for offspring_name in notable_offspring_names:
            offspring_name = offspring_name.strip()
            offspring_person = person_mapping.get(offspring_name)
            if offspring_person:
                person.notable_offspring.add(offspring_person)

        # Link father
        if father_name:
            father_person = person_mapping.get(father_name)
            if father_person:
                person.father = father_person
                person.save()

    return 'Successfully imported people data and established relationships.'
