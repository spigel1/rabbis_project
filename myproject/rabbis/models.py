from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=255)
    birth_year = models.IntegerField(blank=True, null=True)
    notable_offspring = models.TextField(blank=True, null=True)
    wife = models.CharField(max_length=255, blank=True, null=True)
    father = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    lifespan = models.IntegerField(blank=True, null=True)

    @property
    def death_year(self):
        return self.birth_year + self.lifespan if self.birth_year and self.lifespan else None

    def __str__(self):
        return self.name
class SpousalRelationship(models.Model):
    husband = models.ForeignKey(Person, related_name='husbands', on_delete=models.CASCADE)
    wife = models.ForeignKey(Person, related_name='wives', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.husband} - {self.wife}"
