let contadorOperativa = 1;

function agregarFilaOperativa() {
    const tbody = document.getElementById("acuerdos-body-operativa");
    const row = document.createElement("tr");
    row.setAttribute("data-row", contadorOperativa);

    row.innerHTML = `
        <td><input type="number" name="numerador_${contadorOperativa}" value="${contadorOperativa}" readonly></td>
        <td>
            <select name="tipo_unidad_${contadorOperativa}" required>
                <option value="" disabled selected>Selecciona una unidad</option>
                <option value="Unidad 1">Unidad 1</option>
                <option value="Unidad 2">Unidad 2</option>
                <option value="Unidad 3">Unidad 3</option>
            </select>
        </td>
        <td><textarea name="descripcion_${contadorOperativa}" required></textarea></td>
        <td><input type="checkbox" name="unidad_parada_${contadorOperativa}"></td>
        <td><input type="date" name="fecha_limite_${contadorOperativa}" required></td>
        <td><input type="checkbox" name="pendiente_${contadorOperativa}" checked></td>
        <td>
            <select name="responsable_${contadorOperativa}" class="select-responsable">
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
            <input type="text" name="responsable_manual_${contadorOperativa}" placeholder="Nuevo responsable" style="display:none;">
        </td>
        <td><input type="number" name="porcentaje_avance_${contadorOperativa}" min="0" max="100" required></td>
        <td><button type="button" onclick="eliminarFilaOperativa(this)">Eliminar</button></td>
    `;

    tbody.appendChild(row);

    const select = row.querySelector(".select-responsable");
    const manual = row.querySelector(`[name='responsable_manual_${contadorOperativa}']`);
    select.addEventListener("change", function () {
        manual.style.display = select.value === "nuevo" ? "inline-block" : "none";
    });

    contadorOperativa++;
}

function eliminarFilaOperativa(btn) {
    btn.closest("tr").remove();
}

function eliminarTodoOperativa() {
    document.getElementById("acuerdos-body-operativa").innerHTML = "";
    contadorOperativa = 1;
}

function guardarTodoOperativa() {
    const filas = document.querySelectorAll("#acuerdos-body-operativa tr");
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

    fetch("/guardar-matriz-acuerdos-operativa/", {
        method: "POST",
        headers: {
            "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Todos los acuerdos operativos guardados correctamente");
            eliminarTodoOperativa();
        } else {
            alert("Error al guardar: " + data.error);
        }
    })
    .catch(err => {
        console.error("Error al enviar los acuerdos operativos:", err);
        alert("Error al guardar acuerdos. Revisa la consola.");
    });
}
