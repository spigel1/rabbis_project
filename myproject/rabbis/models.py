from django.db import models
import uuid

class Person(models.Model):
    # Automatically generate a unique identifier for each person
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    # Basic person information
    name = models.CharField(max_length=255)
    birth_year = models.IntegerField(blank=True, null=True)
    lifespan = models.IntegerField(blank=True, null=True)

    # Relationships: many-to-many for wives and notable offspring, setting symmetrical=False
    wife = models.ManyToManyField('self', blank=True, related_name='husbands', symmetrical=False)
    notable_offspring = models.ManyToManyField('self', blank=True, related_name='parents', symmetrical=False)

    # ForeignKey for father since one person has only one father
    father = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')

    @property
    def death_year(self):
        # Calculate death year based on birth year and lifespan if available
        return self.birth_year + self.lifespan if self.birth_year and self.lifespan else None

    def __str__(self):
        return self.name
