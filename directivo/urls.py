urlpatterns = [
# Integrantes y reuniones
    path("reunion/", views.reunion_main, name="reunion_main"),
    path("agregar-integrante/", views.agregar_integrante, name="agregar_integrante"),
    path("eliminar-integrante/", views.eliminar_integrante, name="eliminar_integrante"),
]