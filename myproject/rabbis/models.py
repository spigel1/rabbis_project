from django.db import models
import uuid

class Person(models.Model):
    # Automatically generate a unique identifier for each person
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    name = models.CharField(max_length=255)
    birth_year = models.IntegerField(blank=True, null=True)
    lifespan = models.IntegerField(blank=True, null=True)
    
    # Use ForeignKey to relate people more reliably
    wife = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='husbands')
    father = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    notable_offspring = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='perants')

    @property
    def death_year(self):
        return self.birth_year + self.lifespan if self.birth_year and self.lifespan else None

    def __str__(self):
        return self.name
