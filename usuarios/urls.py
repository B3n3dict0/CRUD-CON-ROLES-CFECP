from django.urls import path, include
from . import views

urlpatterns = [
    path('menu/', views.menu_usuario, name='menu_usuario'),

    # Incluir todas las rutas de operativo y directivo
    path('operativo/', include('operativo.urls')),   # Incluye operativo
    path('directivo/', include('directivo.urls')),   # Incluye directivo
]