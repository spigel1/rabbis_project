from django.shortcuts import render, get_object_or_404, redirect
from .models import Person
from .forms import PersonForm

# View to display all rabbis
def rabbi_list(request):
    rabbis = Person.objects.all()
    return render(request, 'rabbis/rabbi_list.html', {'rabbis': rabbis})

# View to display details of a specific rabbi
def rabbi_detail(request, rabbi_id):
    rabbi = Person.objects.get(id=rabbi_id)
    return render(request, 'rabbis/rabbi_detail.html', {'rabbi': rabbi})

# View to handle creation
def create_person(request):
    if request.method == 'POST':
        form = PersonForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('person_list')  # Redirect after successful creation
    else:
        form = PersonForm()
    return render(request, 'rabbis/create_person.html', {'form': form})

# View to handle editing
def edit_person(request, pk):
    person = get_object_or_404(Person, pk=pk)
    if request.method == 'POST':
        form = PersonForm(request.POST, instance=person)
        if form.is_valid():
            form.save()
            return redirect('person_detail', pk=person.pk)
    else:
        form = PersonForm(instance=person)
    return render(request, 'rabbis/edit_person.html', {'form': form})