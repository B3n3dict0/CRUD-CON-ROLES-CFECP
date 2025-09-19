from django.shortcuts import render

# Create your views here.

def operativo_view(request):
    context = {'fecha_actual': datetime.now()}
    return render(request, 'operativo/reunion_main.html', context)

def crear_acuerdo_operativo(request):
    return render(request, 'operativo/partials/crear_acuerdo_operativo.html')

def historial_acuerdo_operativo(request):
    acuerdos = AcuerdoOperativa.objects.all().order_by('-creado_en')
    return render(request, 'operativo/partials/historial_acuerdo_operativo.html', {'acuerdos': acuerdos})

@csrf_exempt
def guardar_matriz_acuerdos_operativa(request):
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

            AcuerdoOperativa.objects.create(
                numerador=int(datos.get('numerador', 0)),
                tipo_unidad=datos.get('tipo_unidad', ''),
                descripcion=datos.get('descripcion', ''),
                unidad_parada=unidad_parada,
                pendiente=pendiente,
                fecha_limite=fecha_limite,
                responsable=responsable,
                porcentaje_avance=int(datos.get('porcentaje_avance', 0))
            )
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# INTEGRANTES Y REUNIONES
# ------------------------
def reunion_main(request):
    integrantes = Integrante.objects.all()
    return render(request, "operativo/reunion_main.html", {"integrantes": integrantes})

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