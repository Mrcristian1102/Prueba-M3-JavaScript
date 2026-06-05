import { getReservations, updateReservation, deleteReservation } from "@services/reservation.service";
import { openModal, closeModal, showToast } from "@components/Modal";
import { formatDate, statusLabel, statusClass } from "@/utils";

export const adminReservationsController = async () => {
  const container = document.querySelector("#adminResContainer");
  await loadTable(container);
};

async function loadTable(container) {
  try {
    const reservations = await getReservations();

    if (!reservations.length) {
      container.innerHTML = `<p class="text-slate-400 text-sm text-center py-8">No hay reservas</p>`;
      return;
    }

    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th class="px-4 py-3 text-left">Espacio</th>
              <th class="px-4 py-3 text-left">Solicitante</th>
              <th class="px-4 py-3 text-left">Fecha</th>
              <th class="px-4 py-3 text-left">Horario</th>
              <th class="px-4 py-3 text-left">Motivo</th>
              <th class="px-4 py-3 text-left">Estado</th>
              <th class="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${reservations.map((r) => `
              <tr class="hover:bg-slate-50" data-id="${r.id}">
                <td class="px-4 py-3 font-medium text-slate-700">${r.workspace}</td>
                <td class="px-4 py-3 text-slate-600">${r.userName || "-"}</td>
                <td class="px-4 py-3 text-slate-600">${formatDate(r.date)}</td>
                <td class="px-4 py-3 text-slate-600">${r.startHour}–${r.endHour}</td>
                <td class="px-4 py-3 text-slate-500 max-w-[140px] truncate">${r.reason}</td>
                <td class="px-4 py-3">
                  <span class="text-xs px-2 py-0.5 rounded-full font-medium ${statusClass(r.status)}">${statusLabel(r.status)}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex gap-1 flex-wrap">
                    ${r.status === "pending" ? `
                      <button class="approve-btn text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded" data-id="${r.id}">✓</button>
                      <button class="reject-btn text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded" data-id="${r.id}">✗</button>
                    ` : ""}
                    <button class="delete-btn text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded" data-id="${r.id}">Eliminar</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll(".approve-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await updateReservation(parseInt(btn.dataset.id), { status: "approved" });
          showToast("Reserva aprobada");
          loadTable(container);
        } catch { showToast("Error", "error"); }
      });
    });

    container.querySelectorAll(".reject-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        openModal({
          title: "Rechazar reserva",
          body: "<p class='text-sm text-slate-600'>¿Confirmas el rechazo?</p>",
          confirmText: "Rechazar",
          confirmClass: "bg-red-600 hover:bg-red-700 text-white",
          onConfirm: async () => {
            try {
              await updateReservation(id, { status: "rejected" });
              closeModal();
              showToast("Reserva rechazada", "info");
              loadTable(container);
            } catch { showToast("Error", "error"); }
          },
        });
      });
    });

    container.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        openModal({
          title: "Eliminar reserva",
          body: "<p class='text-sm text-slate-600'>Esta acción no se puede deshacer.</p>",
          confirmText: "Eliminar",
          confirmClass: "bg-red-600 hover:bg-red-700 text-white",
          onConfirm: async () => {
            try {
              await deleteReservation(id);
              closeModal();
              showToast("Eliminada");
              loadTable(container);
            } catch { showToast("Error", "error"); }
          },
        });
      });
    });
  } catch {
    container.innerHTML = `<p class="text-red-400 text-sm text-center py-8">Error al cargar</p>`;
  }
}
