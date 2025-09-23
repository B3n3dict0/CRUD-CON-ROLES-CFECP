document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("integrantesSelectDirectiva");
    const addBtn = document.getElementById("addIntegranteDirectiva");
    const customInput = document.getElementById("nuevoRolDirectiva");
    const addCustomBtn = document.getElementById("addCustomIntegranteDirectiva");
    const lista = document.getElementById("listaIntegrantesDirectiva");
    const inputGuardado = document.getElementById("integrantesGuardadosDirectiva");

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            document.cookie.split(";").forEach(cookie => {
                const c = cookie.trim();
                if (c.startsWith(name + "=")) {
                    cookieValue = decodeURIComponent(c.substring(name.length + 1));
                }
            });
        }
        return cookieValue;
    }

    function actualizarInput() {
        const roles = Array.from(lista.querySelectorAll("li")).map(li => li.firstChild.textContent.trim());
        inputGuardado.value = JSON.stringify(roles);
    }

    function crearItem(rol) {
        const li = document.createElement("li");
        li.textContent = rol;

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.style.marginLeft = "10px";
        btnEliminar.dataset.rol = rol;
        btnEliminar.addEventListener("click", eliminarIntegrante);

        li.appendChild(btnEliminar);
        return li;
    }

    function agregarIntegranteAJAX(rol) {
        fetch(urlAgregar, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ rol: rol }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                lista.appendChild(crearItem(rol));
                actualizarInput();
            } else {
                alert(data.message);
            }
        });
    }

    function eliminarIntegrante(e) {
        const rol = e.target.dataset.rol;
        fetch(urlEliminar, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ rol: rol }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                e.target.parentElement.remove();
                actualizarInput();
            } else {
                alert(data.message);
            }
        });
    }

    addBtn.addEventListener("click", () => {
        const rol = select.value;
        agregarIntegranteAJAX(rol);
    });

    addCustomBtn.addEventListener("click", () => {
        const rol = customInput.value.trim();
        if (!rol) return alert("Ingresa un rol válido");
        agregarIntegranteAJAX(rol);
        customInput.value = "";
    });

    document.querySelectorAll(".eliminar-btn").forEach(btn => {
        btn.addEventListener("click", eliminarIntegrante);
    });

    actualizarInput();
});
