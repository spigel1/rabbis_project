from django.urls import path
from . import views

urlpatterns = [
    path('', views.rabbi_list, name='rabbi_list'),
    path('<int:rabbi_id>/', views.rabbi_detail, name='rabbi_detail'),
    path('create/', views.create_person, name='create_person'),
    path('edit/<int:pk>/', views.edit_person, name='edit_person'),
]
