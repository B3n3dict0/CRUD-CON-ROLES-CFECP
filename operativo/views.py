from django.shortcuts import render
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import AcuerdoOperativa, Integrante
from django.http import HttpResponse
import os
from django.conf import settings
from pdfrw import PdfReader, PdfWriter, PageMerge
from io import BytesIO
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os
from django.http import HttpResponse
from datetime import datetime
from django.http import HttpResponse
from django.conf import settings
from docxtpl import DocxTemplate
import subprocess  # Para LibreOffice en Linux
from docx2pdf import convert 

# Vista principal
def operativo_view(request):
    context = {'fecha_actual': datetime.now()}
    return render(request, 'operativo/reunion_main.html', context)

# Crear acuerdo
def crear_acuerdo_operativo(request):
    return render(request, 'operativo/modulo/crear_acuerdo_operativo.html')

# Historial de acuerdos
def historial_acuerdo_operativo(request):
    acuerdos = AcuerdoOperativa.objects.all().order_by("-creado_en")
    return render(request, "operativo/modulo/historial_acuerdo_operativo.html", {"acuerdos": acuerdos})

# Guardar acuerdos operativos
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

            # Usar responsable manual si existe, si no el del select
            responsable = datos.get('responsable_manual').strip() if datos.get('responsable_manual') else datos.get('responsable')

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
                responsable_manual=datos.get('responsable_manual', '').strip() or None,
                porcentaje_avance=int(datos.get('porcentaje_avance', 0))
            )

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

# Integrantes y reuniones
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



# INTEGRANTES OPERATIVO
integrantes_lista = []  # Solo para ejemplo temporal

@csrf_exempt
def agregar_integrante(request):
    if request.method == "POST":
        data = json.loads(request.body)
        rol = data.get("rol")
        if rol in integrantes_lista:
            return JsonResponse({"success": False, "message": "El rol ya existe"})
        integrantes_lista.append(rol)
        return JsonResponse({"success": True})
    return JsonResponse({"success": False, "message": "Método no permitido"})



@csrf_exempt
def eliminar_integrante(request):
    if request.method == "POST":
        data = json.loads(request.body)
        rol = data.get("rol")
        if rol in integrantes_lista:
            integrantes_lista.remove(rol)
            return JsonResponse({"success": True})
        return JsonResponse({"success": False, "message": "No se encontró el rol"})
    return JsonResponse({"success": False, "message": "Método no permitido"})  


def generar_pdf_operativo(request):
    from django.http import HttpResponse
    from docxtpl import DocxTemplate
    import os, subprocess, json
    from datetime import datetime
    from docx2pdf import convert
    from django.conf import settings

    # 1️⃣ Capturar datos del POST
    fecha_actual = datetime.now().strftime("%d/%m/%Y")
    fecha_nombre = datetime.now().strftime("%Y%m%d_%H%M%S")  # para nombres únicos

    integrantes_json = request.POST.get("integrantes_guardados", "[]")
    try:
        integrantes = json.loads(integrantes_json)
    except json.JSONDecodeError:
        integrantes = []

    notas = request.POST.get("notas", "")
    reglas = request.POST.get("reglas", "")

    # 2️⃣ Rutas de archivos
    plantilla_path = os.path.join(settings.BASE_DIR, "operativo", "templates", "operativo", "plantillas", "Operativo.docx")
    backup_dir = os.path.join(settings.BASE_DIR, "operativo", "backups")
    os.makedirs(backup_dir, exist_ok=True)  # crea la carpeta si no existe
    temp_docx = os.path.join(backup_dir, f"Operativo_{fecha_nombre}.docx")
    output_pdf = os.path.join(backup_dir, f"Operativo_{fecha_nombre}.pdf")

    # 3️⃣ Llenar la plantilla Word
    if not os.path.exists(plantilla_path):
        return HttpResponse(f"No se encontró la plantilla: {plantilla_path}")

    doc = DocxTemplate(plantilla_path)
    context = {
        "fecha": fecha_actual,
        "integrantes": integrantes,
        "notas": notas,
        "acuerdos": reglas,
    }
    doc.render(context)
    doc.save(temp_docx)

    # 4️⃣ Convertir a PDF según el sistema operativo
    try:
        if os.name == "nt":  # Windows
            convert(temp_docx, output_pdf)
        else:  # Linux/Mac con LibreOffice
            subprocess.run([
                "libreoffice", "--headless", "--convert-to", "pdf", temp_docx, "--outdir",
                backup_dir
            ], check=True)
    except Exception as e:
        return HttpResponse(f"Error al convertir a PDF: {str(e)}")

    # 5️⃣ Leer PDF y devolver como descarga
    with open(output_pdf, "rb") as f:
        response = HttpResponse(f.read(), content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="Operativo_{fecha_nombre}.pdf"'
        return response
