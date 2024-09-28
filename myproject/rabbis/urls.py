from django.urls import path
from . import views

urlpatterns = [
    path('', views.rabbi_list, name='rabbi_list'),
    path('<int:rabbi_id>/', views.rabbi_detail, name='rabbi_detail'),
]
