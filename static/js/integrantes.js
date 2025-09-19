document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("integrantesSelect");
    const addBtn = document.getElementById("addIntegrante");
    const lista = document.getElementById("listaIntegrantes");

    // CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Crear li dinámicamente
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

    // Agregar integrante
    addBtn.addEventListener("click", function () {
        const rol = select.value;

        fetch("/agregar-integrante/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ rol: rol }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    lista.appendChild(crearItem(rol));
                } else {
                    alert(data.message);
                }
            });
    });

    // Eliminar integrante
    function eliminarIntegrante(e) {
        const rol = e.target.dataset.rol;

        fetch("/eliminar-integrante/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ rol: rol }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    e.target.parentElement.remove();
                } else {
                    alert(data.message);
                }
            });
    }

    // Agregar evento eliminar a los ya cargados desde Django
    document.querySelectorAll(".eliminar-btn").forEach((btn) => {
        btn.addEventListener("click", eliminarIntegrante);
    });
});
