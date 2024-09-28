from django.shortcuts import render
from .models import Person

# View to display all rabbis
def rabbi_list(request):
    rabbis = Person.objects.all()
    return render(request, 'rabbis/rabbi_list.html', {'rabbis': rabbis})

# View to display details of a specific rabbi
def rabbi_detail(request, rabbi_id):
    rabbi = Person.objects.get(id=rabbi_id)
    return render(request, 'rabbis/rabbi_detail.html', {'rabbi': rabbi})
