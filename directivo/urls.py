from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # Integrantes y reuniones
    path("reunion/", views.reunion_main, name="reunion_main"),
    path("agregar-integrante/", views.agregar_integrante, name="agregar_integrante"),
    
    # Acuerdos directivo
    path('', views.directivo_view, name='directivo_index'),  # para /usuarios/directivo/
    path('historial-acuerdo/', views.historial_acuerdo_directivo, name='historial_acuerdo_directivo'),
    path('crear-acuerdo/', views.crear_acuerdo_directivo, name='crear_acuerdo_directivo'),
]