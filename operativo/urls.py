from django.urls import path
from . import views

urlpatterns = [
    path('', views.operativo_view, name='operativo_index'),
    path('historial-acuerdo/', views.historial_acuerdo_operativo, name='historial_acuerdo_operativo'),
    path('crear-acuerdo/', views.crear_acuerdo_operativo, name='crear_acuerdo_operativo'),

    # Guardar acuerdos operativos
    path('guardar-matriz-acuerdos-operativa/', views.guardar_matriz_acuerdos_operativa, name='guardar_matriz_acuerdos_operativa'),

    # Integrantes y reuniones
    path("reunion/", views.reunion_main, name="reunion_main"),
    path("agregar-integrante/", views.agregar_integrante, name="agregar_integrante"),
]
