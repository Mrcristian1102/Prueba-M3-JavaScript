import { getSpaces, createSpace, updateSpace, deleteSpace } from "@services/space.service";
import { openModal, closeModal, showToast } from "@components/Modal";

export const spacesController = async () => {
  const container = document.querySelector("#spacesContainer");
  const newBtn = document.querySelector("#newSpaceBtn");

  newBtn?.addEventListener("click", () => openSpaceModal(null, container));

  await loadSpaces(container);
};

async function loadSpaces(container) {
  try {
    const spaces = await getSpaces();

    if (!spaces.length) {
      container.innerHTML = `<p class="text-slate-400 text-sm text-center py-8 col-span-3">No hay espacios</p>`;
      return;
    }

    container.innerHTML = spaces.map((s) => `
      <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm" data-id="${s.id}">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-slate-800">${s.name}</h3>
          <span class="text-xs px-2 py-0.5 rounded-full ${s.status === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}">
            ${s.status === "available" ? "Disponible" : "No disponible"}
          </span>
        </div>
        <p class="text-sm text-slate-500">${s.type}</p>
        <p class="text-sm text-slate-500">Capacidad: ${s.capacity} personas</p>
        <p class="text-sm text-slate-500">Ubicación: ${s.location}</p>
        <div class="flex gap-2 mt-4">
          <button class="edit-space-btn text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg" data-id="${s.id}">Editar</button>
          <button class="delete-space-btn text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg" data-id="${s.id}">Eliminar</button>
        </div>
      </div>
    `).join("");

    container.querySelectorAll(".edit-space-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const space = spaces.find((s) => s.id === parseInt(btn.dataset.id));
        if (space) openSpaceModal(space, container);
      });
    });

    container.querySelectorAll(".delete-space-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        openModal({
          title: "Eliminar espacio",
          body: "<p class='text-sm text-slate-600'>¿Confirmas la eliminación de este espacio?</p>",
          confirmText: "Eliminar",
          confirmClass: "bg-red-600 hover:bg-red-700 text-white",
          onConfirm: async () => {
            try {
              await deleteSpace(id);
              closeModal();
              showToast("Espacio eliminado");
              loadSpaces(container);
            } catch { showToast("Error", "error"); }
          },
        });
      });
    });
  } catch {
    container.innerHTML = `<p class="text-red-400 text-sm text-center py-8 col-span-3">Error al cargar</p>`;
  }
}

function openSpaceModal(space, container) {
  openModal({
    title: space ? "Editar Espacio" : "Nuevo Espacio",
    body: `
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Nombre</label>
          <input type="text" id="sp-name" value="${space?.name || ""}" placeholder="Ej: Sala Beta" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Tipo</label>
          <select id="sp-type" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            ${["Sala de reuniones","Oficina privada","Coworking","Auditorio"].map(
              (t) => `<option ${space?.type === t ? "selected" : ""}>${t}</option>`
            ).join("")}
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Capacidad</label>
          <input type="number" id="sp-capacity" value="${space?.capacity || ""}" min="1" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Ubicación</label>
          <input type="text" id="sp-location" value="${space?.location || ""}" placeholder="Ej: Piso 2" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Estado</label>
          <select id="sp-status" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="available" ${space?.status === "available" ? "selected" : ""}>Disponible</option>
            <option value="unavailable" ${space?.status === "unavailable" ? "selected" : ""}>No disponible</option>
          </select>
        </div>
        <p id="sp-error" class="text-red-500 text-xs hidden"></p>
      </div>
    `,
    confirmText: space ? "Guardar cambios" : "Crear espacio",
    confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
    onConfirm: async () => {
      const name = document.getElementById("sp-name").value.trim();
      const type = document.getElementById("sp-type").value;
      const capacity = parseInt(document.getElementById("sp-capacity").value);
      const location = document.getElementById("sp-location").value.trim();
      const status = document.getElementById("sp-status").value;
      const errEl = document.getElementById("sp-error");

      if (!name || !capacity || !location) {
        errEl.textContent = "Completa todos los campos";
        errEl.classList.remove("hidden");
        return;
      }

      try {
        if (space) {
          await updateSpace(space.id, { name, type, capacity, location, status });
        } else {
          await createSpace({ name, type, capacity, location, status });
        }
        closeModal();
        showToast(space ? "Espacio actualizado" : "Espacio creado");
        loadSpaces(container);
      } catch { showToast("Error al guardar", "error"); }
    },
  });
}
