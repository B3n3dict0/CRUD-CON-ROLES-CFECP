from django.db import models

class AcuerdoOperativa(models.Model):
    numerador = models.IntegerField()
    tipo_unidad = models.CharField(max_length=100)  
    descripcion = models.TextField()
    unidad_parada = models.BooleanField(default=False)
    fecha_limite = models.DateField()
    pendiente = models.BooleanField(default=True)
    responsable = models.CharField(max_length=100)
    responsable_manual = models.CharField(max_length=100, null=True, blank=True)  # ✅ Campo manual agregado
    porcentaje_avance = models.PositiveIntegerField()

    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'acuerdos_operativa'
        ordering = ['numerador']

    def __str__(self):
        return f"{self.numerador} - {self.descripcion[:20]}"

class Integrante(models.Model):
    rol = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'integrantes_operativo'

    def __str__(self):
        return self.rol
