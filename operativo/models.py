from django.db import models

# Create your models here.
class AcuerdoOperativa(models.Model):
    numerador = models.IntegerField()
    tipo_unidad = models.CharField(max_length=100)  
    descripcion = models.TextField()
    unidad_parada = models.BooleanField(default=False)
    fecha_limite = models.DateField()
    pendiente = models.BooleanField(default=True)
    responsable = models.CharField(max_length=100)
    porcentaje_avance = models.PositiveIntegerField()  # solo números positivos

    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'acuerdos_operativa'  # asegura que sea una tabla separada
        ordering = ['numerador']

    def __str__(self):
        return f"{self.numerador} - {self.descripcion[:20]}"
    

class Integrante(models.Model):
    rol = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'integrantes_operativo'  # <- tabla diferente

    def __str__(self):
        return self.rol

