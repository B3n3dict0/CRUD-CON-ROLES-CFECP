from django.shortcuts import render
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from operativo.models import AcuerdoOperativa
from .models import AcuerdoDirectiva, Integrante

# Create your views here.
def directivo_view(request):
    context = {'fecha_actual': datetime.now()}
    return render(request, 'directivo/reunion_main.html', context)

def crear_acuerdo_directivo(request):
    return render(request, 'directivo/modulo/crear_acuerdo_directivo.html')

def historial_acuerdo_directivo(request):
    acuerdos = AcuerdoDirectiva.objects.all().order_by("-creado_en")
    return render(request, "directivo/modulo/historial_acuerdo_directivo.html", {"acuerdos": acuerdos})


@csrf_exempt
def guardar_matriz_acuerdos_directiva(request):
    if request.method != "POST":
        return JsonResponse({'success': False, 'error': 'Método no permitido'})

    filas = {}
    for key, value in request.POST.items():
        if '_' not in key:
            continue
        prefix, index = key.rsplit('_', 1)
        filas.setdefault(index, {})[prefix] = value

    try:
        for datos in filas.values():
            unidad_parada = datos.get('unidad_parada', '') == 'on'
            pendiente = datos.get('pendiente', '') == 'on'
            responsable = datos.get('responsable_manual') if datos.get('responsable_manual') else datos.get('responsable')

            fecha_limite = datos.get('fecha_limite')
            if fecha_limite:
                fecha_limite = datetime.strptime(fecha_limite, "%Y-%m-%d").date()

            AcuerdoDirectiva.objects.create(
                numerador=int(datos.get('numerador', 0)),
                tipo_unidad=datos.get('tipo_unidad', ''),
                descripcion=datos.get('descripcion', ''),
                unidad_parada=unidad_parada,
                pendiente=pendiente,
                fecha_limite=fecha_limite,
                responsable=datos.get('responsable', ''),
                responsable_manual=datos.get('responsable_manual', '').strip() or None,
                porcentaje_avance=int(datos.get('porcentaje_avance', 0))
            )
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
    

# INTEGRANTES Y REUNIONES
# ------------------------
def reunion_main(request):
    integrantes = Integrante.objects.all()
    return render(request, "directivo/reunion_main.html", {"integrantes": integrantes})

@csrf_exempt
def agregar_integrante(request):
    if request.method == "POST":
        data = json.loads(request.body)
        rol = data.get("rol")
        integrante, creado = Integrante.objects.get_or_create(rol=rol)
        if creado:
            return JsonResponse({"success": True, "rol": rol})
        else:
            return JsonResponse({"success": False, "message": "Ya existe este integrante"})
        

# Lista temporal para directiva
integrantes_directiva_lista = []

@csrf_exempt
def agregar_integrante_directiva(request):
    if request.method == "POST":
        data = json.loads(request.body)
        rol = data.get("rol")
        if rol in integrantes_directiva_lista:
            return JsonResponse({"success": False, "message": "El rol ya existe"})
        integrantes_directiva_lista.append(rol)
        return JsonResponse({"success": True})
    return JsonResponse({"success": False, "message": "Método no permitido"})

@csrf_exempt
def eliminar_integrante_directiva(request):
    if request.method == "POST":
        data = json.loads(request.body)
        rol = data.get("rol")
        if rol in integrantes_directiva_lista:
            integrantes_directiva_lista.remove(rol)
            return JsonResponse({"success": True})
        return JsonResponse({"success": False, "message": "No se encontró el rol"})
    return JsonResponse({"success": False, "message": "Método no permitido"})
