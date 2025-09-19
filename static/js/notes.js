
// LOGICA DE INSERTAR DATOS

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("noteModal");
    const modalSectionName = document.getElementById("modalSectionName");
    const noteText = document.getElementById("noteText");
    const saveBtn = document.getElementById("saveNote");
    const cancelBtn = document.getElementById("cancelNote");
    const closeBtn = document.querySelector(".close");

    let editingNoteId = null;
    let editingNoteSection = null;

    // Abrir modal
    window.openNoteModal = (section, noteId = null) => {
        editingNoteSection = section;
        editingNoteId = noteId;

        modalSectionName.textContent = section.toUpperCase();

        if (noteId) {
            const noteItem = document.getElementById(noteId);
            noteText.value = noteItem.querySelector(".note-text").textContent;
        } else {
            noteText.value = "";
        }

        modal.classList.remove("hidden");
    };

    function closeModal() {
        modal.classList.add("hidden");
        noteText.value = "";
        editingNoteId = null;
        editingNoteSection = null;
    }

    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    saveBtn.addEventListener("click", () => {
        if (!noteText.value.trim()) {
            alert("La nota no puede estar vacía");
            return;
        }

        if (!editingNoteSection) return;

        const notesList = document.getElementById(`notes-${editingNoteSection}`);
        if (!notesList) return;

        if (editingNoteId) {
            // Modificar nota existente
            const noteItem = document.getElementById(editingNoteId);
            noteItem.querySelector(".note-text").textContent = noteText.value;
        } else {
            // Crear nueva nota
            const noteId = `note-${Date.now()}`;
            const li = document.createElement("li");
            li.id = noteId;
            li.innerHTML = `
                <span class="note-text">${noteText.value}</span>
                <button class="edit-note">Editar</button>
                <button class="delete-note">Eliminar</button>
            `;

            // Botón editar: pasa la sección correcta
            li.querySelector(".edit-note").addEventListener("click", () => {
                openNoteModal(editingNoteSection || sectionFromLi(li), noteId);
            });

            // Botón eliminar
            li.querySelector(".delete-note").addEventListener("click", () => li.remove());

            notesList.appendChild(li);
        }

        closeModal();
    });

    // Función para detectar sección desde el li (por si acaso)
    function sectionFromLi(li) {
        return li.closest("li[data-section]")?.dataset.section || null;
    }
});
