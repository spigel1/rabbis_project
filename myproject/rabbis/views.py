from django.shortcuts import render, get_object_or_404, redirect
from .models import Person
from .forms import PersonForm
from django.contrib import messages
from .forms import ExcelUploadForm
from rabbis.utils import import_from_excel
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse

# View to display all rabbis
def rabbi_list(request):
    rabbis = Person.objects.all()
    return render(request, 'rabbis/rabbi_list.html', {'rabbis': rabbis})

# View to display details of a specific rabbi
def rabbi_detail(request, rabbi_id):
    rabbi = Person.objects.get(id=rabbi_id)
    return render(request, 'rabbis/rabbi_detail.html', {'rabbi': rabbi})

def connections_data(request, rabbi_id):
    # Get the selected rabbi
    rabbi = get_object_or_404(Person, pk=rabbi_id)

    # Initialize nodes and links lists
    nodes = []
    links = []

    # Add the main rabbi as a node
    main_node = {
        "id": rabbi.id,  # Unique ID for D3
        "name": rabbi.name,
        "birth_year": rabbi.birth_year,
        "lifespan": rabbi.lifespan,
        "type": "rabbi"  # Node type to help with custom styling
    }
    nodes.append(main_node)

    # Add father (if available) as a node and create a link (parent-child relationship)
    if rabbi.father:
        father_node = {
            "id": rabbi.father.id,
            "name": rabbi.father.name,
            "birth_year": rabbi.father.birth_year,
            "lifespan": rabbi.father.lifespan,
            "type": "father"
        }
        nodes.append(father_node)
        # Create a link from father to rabbi
        links.append({
            "source": rabbi.father.id,  # ID of the father
            "target": rabbi.id,  # ID of the rabbi
            "relation": "parent"
        })

    # Add wives as nodes and create links
    for wife in rabbi.wife.all():
        wife_node = {
            "id": wife.id,
            "name": wife.name,
            "birth_year": wife.birth_year,
            "lifespan": wife.lifespan,
            "type": "wife"
        }
        nodes.append(wife_node)
        # Create a link between rabbi and wife (spouse relationship)
        links.append({
            "source": rabbi.id,  # ID of the rabbi
            "target": wife.id,  # ID of the wife
            "relation": "spouse"
        })

    # Add notable offspring as nodes and create links (parent-child relationship)
    for child in rabbi.notable_offspring.all():
        child_node = {
            "id": child.id,
            "name": child.name,
            "birth_year": child.birth_year,
            "lifespan": child.lifespan,
            "type": "child"
        }
        nodes.append(child_node)
        # Create a link between rabbi and child
        links.append({
            "source": rabbi.id,  # ID of the rabbi
            "target": child.id,  # ID of the child
            "relation": "parent"
        })

    # Return nodes and links as a JSON response for the D3 graph
    return JsonResponse({"nodes": nodes, "links": links}, safe=False)

def upload_excel(request):
    if request.method == 'POST':
        form = ExcelUploadForm(request.POST, request.FILES)
        if form.is_valid():
            excel_file = request.FILES['file']
            try:
                # Process the uploaded Excel file using the import_from_excel function
                result_message = import_from_excel(excel_file)
                messages.success(request, result_message)
            except Exception as e:
                messages.error(request, f'Error importing file: {e}')
            return redirect('upload_excel')
    else:
        form = ExcelUploadForm()
    
    return render(request, 'rabbis/upload_excel.html', {'form': form})