from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.operativo_view, name='operativo_index'),  # /usuarios/operativo/
    path('historial-acuerdo/', views.historial_acuerdo_operativo, name='historial_acuerdo_operativo'),
    path('crear-acuerdo/', views.crear_acuerdo_operativo, name='crear_acuerdo_operativo'),

    # Integrantes y reuniones
    path("reunion/", views.reunion_main, name="reunion_main"),
    path("agregar-integrante/", views.agregar_integrante, name="agregar_integrante"),

]