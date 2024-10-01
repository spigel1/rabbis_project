from django.urls import path
from . import views
from .views import upload_excel

urlpatterns = [
    path('', views.rabbi_list, name='rabbi_list'),
    path('<int:rabbi_id>/', views.rabbi_detail, name='rabbi_detail'),
    path('upload/', upload_excel, name='upload_excel'),
]
