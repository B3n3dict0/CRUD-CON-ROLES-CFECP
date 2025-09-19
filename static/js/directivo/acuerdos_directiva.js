let contadorDirectiva = 1;

function agregarFilaDirectiva() {
    const tbody = document.getElementById("acuerdos-body-directiva");
    const row = document.createElement("tr");
    row.setAttribute("data-row", contadorDirectiva);

    row.innerHTML = `
        <td><input type="number" name="numerador_${contadorDirectiva}" value="${contadorDirectiva}" readonly></td>
        <td>
            <select name="tipo_unidad_${contadorDirectiva}" required>
                <option value="" disabled selected>Selecciona una unidad</option>
                <option value="Unidad 1">Área de producción</option>
                <option value="Unidad 2">Área de mantenimiento</option>
                <option value="Unidad 3">Área de gestión de recursos humanos</option>
                <option value="Unidad 4">Área de gestión de recursos financieros</option>
                <option value="Unidad 5">Área de gestión de recursos materiales y servicios</option>
                <option value="Unidad 6">Área de seguridad</option>
                <option value="Unidad 7">Área de calidad</option>
            </select>
        </td>
        <td><textarea name="descripcion_${contadorDirectiva}" required></textarea></td>
        <td><input type="checkbox" name="unidad_parada_${contadorDirectiva}"></td>
        <td><input type="date" name="fecha_limite_${contadorDirectiva}" required></td>
        <td><input type="checkbox" name="pendiente_${contadorDirectiva}" checked></td>
        <td>
            <select name="responsable_${contadorDirectiva}" class="select-responsable">
                <option value="SUPERINTENDENTE GENERAL" selected>SUPERINTENDENTE GENERAL</option>
                <option value="SUPERINTENDENTE DE PRODUCCIÓN">SUPERINTENDENTE DE PRODUCCIÓN</option>
                <option value="SUPERINTENDENTE DE MANTENIMIENTO">SUPERINTENDENTE DE MANTENIMIENTO</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="JEFES DE DEPARTAMENTOS">JEFES DE DEPARTAMENTOS</option>
                <option value="SUPERINTENDENTE DE TURNO">SUPERINTENDENTE DE TURNO</option>
                <option value="JEFES OFICINA">JEFES DE OFICINA</option>
                <option value="SUPERVISORES">SUPERVISORES</option>
                <option value="nuevo">Otro...</option>
            </select>
            <input type="text" name="responsable_manual_${contadorDirectiva}" placeholder="Nuevo responsable" style="display:none;">
        </td>
        <td><input type="number" name="porcentaje_avance_${contadorDirectiva}" min="0" max="100" required></td>
        <td><button type="button" onclick="eliminarFilaDirectiva(this)">Eliminar</button></td>
    `;

    tbody.appendChild(row);

    const select = row.querySelector(".select-responsable");
    const manual = row.querySelector(`[name='responsable_manual_${contadorDirectiva}']`);
    select.addEventListener("change", function () {
        manual.style.display = select.value === "nuevo" ? "inline-block" : "none";
    });

    contadorDirectiva++;
}

function eliminarFilaDirectiva(btn) {
    btn.closest("tr").remove();
}

function eliminarTodoDirectiva() {
    document.getElementById("acuerdos-body-directiva").innerHTML = "";
    contadorDirectiva = 1;
}

function guardarTodoDirectiva() {
    const filas = document.querySelectorAll("#acuerdos-body-directiva tr");
    if (filas.length === 0){
        alert("No hay acuerdos para guardar.");
        return;
    }

    const formData = new FormData();
    filas.forEach(fila => {
        const inputs = fila.querySelectorAll("input, select, textarea");
        inputs.forEach(input => {
            if (input.type === "checkbox") {
                formData.append(input.name, input.checked ? "on" : "");
            } else {
                formData.append(input.name, input.value);
            }
        });
    });

    fetch("/guardar-matriz-acuerdos-directiva/", {
        method: "POST",
        headers: {
            "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Todos los acuerdos directivos guardados correctamente");
            eliminarTodoDirectiva();
        } else {
            alert("Error al guardar: " + data.error);
        }
    })
    .catch(err => {
        console.error("Error al enviar los acuerdos directivos:", err);
        alert("Error al guardar acuerdos. Revisa la consola.");
    });
}
