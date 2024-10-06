from django.shortcuts import render, get_object_or_404, redirect
from .models import Person
from .forms import PersonForm
from django.contrib import messages
from .forms import ExcelUploadForm
from rabbis.utils import import_from_excel
import json
from django.core.serializers.json import DjangoJSONEncoder

# View to display all rabbis
def rabbi_list(request):
    rabbis = Person.objects.all()
    return render(request, 'rabbis/rabbi_list.html', {'rabbis': rabbis})

# View to display details of a specific rabbi
def rabbi_detail(request, rabbi_id):
    rabbi = Person.objects.get(id=rabbi_id)
    return render(request, 'rabbis/rabbi_detail.html', {'rabbi': rabbi})

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
