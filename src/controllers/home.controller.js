import ReservationCard from "@components/ReservationCard";
import { openModal, closeModal, showToast } from "@components/Modal";
import { getReservations, getReservationsByUser, updateReservation, deleteReservation } from "@services/reservation.service";
import { getSession, isAdmin } from "@/utils";
import { navigateTo } from "@router/router";

export const homeController = async () => {
  const container = document.querySelector("#reservationsContainer");
  const user = getSession();
  const admin = isAdmin();

  // link para nueva reserva (usuario)
  document.querySelector("#newResBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/reservations/new");
  });

  try {
    const reservations = admin
      ? await getReservations()
      : await getReservationsByUser(user.id);

    // stats for admin
    if (admin) {
      document.querySelector("#stat-total").textContent = reservations.length;
      document.querySelector("#stat-pending").textContent = reservations.filter((r) => r.status === "pending").length;
      document.querySelector("#stat-approved").textContent = reservations.filter((r) => r.status === "approved").length;
      document.querySelector("#stat-rejected").textContent = reservations.filter((r) => r.status === "rejected").length;
    }

    if (!reservations.length) {
      container.innerHTML = `<div class="col-span-2 text-center py-8 text-slate-400 text-sm">No hay reservas</div>`;
      return;
    }

    container.innerHTML = reservations.map((r) => ReservationCard(r, true, admin)).join("");

    attachEvents(container, reservations, user, admin);
  } catch {
    container.innerHTML = `<div class="col-span-2 text-center py-8 text-red-400 text-sm">Error al cargar las reservas</div>`;
  }
};

function attachEvents(container, reservations, user, admin) {
  // Approve
  container.querySelectorAll(".approve-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await updateReservation(parseInt(btn.dataset.id), { status: "approved" });
        showToast("Reserva aprobada");
        homeController();
      } catch {
        showToast("Error al aprobar", "error");
      }
    });
  });

  // Reject
  container.querySelectorAll(".reject-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      openModal({
        title: "Rechazar reserva",
        body: "<p class='text-sm text-slate-600'>¿Confirmas que deseas rechazar esta reserva?</p>",
        confirmText: "Rechazar",
        confirmClass: "bg-red-600 hover:bg-red-700 text-white",
        onConfirm: async () => {
          try {
            await updateReservation(id, { status: "rejected" });
            closeModal();
            showToast("Reserva rechazada", "info");
            homeController();
          } catch {
            showToast("Error", "error");
          }
        },
      });
    });
  });

  // Cancel
  container.querySelectorAll(".cancel-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      openModal({
        title: "Cancelar reserva",
        body: "<p class='text-sm text-slate-600'>¿Estás seguro de que quieres cancelar esta reserva?</p>",
        confirmText: "Sí, cancelar",
        confirmClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
        onConfirm: async () => {
          try {
            await updateReservation(id, { status: "cancelled" });
            closeModal();
            showToast("Reserva cancelada");
            homeController();
          } catch {
            showToast("Error", "error");
          }
        },
      });
    });
  });

  // Edit
  container.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const r = reservations.find((x) => x.id === id);
      if (!r) return;

      openModal({
        title: "Editar reserva",
        body: `
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Fecha</label>
              <input type="date" id="edit-date" value="${r.date}" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div class="flex gap-3">
              <div class="flex-1">
                <label class="block text-xs font-medium text-slate-700 mb-1">Inicio</label>
                <input type="time" id="edit-start" value="${r.startHour}" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div class="flex-1">
                <label class="block text-xs font-medium text-slate-700 mb-1">Fin</label>
                <input type="time" id="edit-end" value="${r.endHour}" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Motivo</label>
              <input type="text" id="edit-reason" value="${r.reason}" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            ${admin ? `
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Estado</label>
              <select id="edit-status" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="pending" ${r.status === "pending" ? "selected" : ""}>Pendiente</option>
                <option value="approved" ${r.status === "approved" ? "selected" : ""}>Aprobada</option>
                <option value="rejected" ${r.status === "rejected" ? "selected" : ""}>Rechazada</option>
                <option value="cancelled" ${r.status === "cancelled" ? "selected" : ""}>Cancelada</option>
              </select>
            </div>` : ""}
            <p id="edit-error" class="text-red-500 text-xs hidden"></p>
          </div>
        `,
        confirmText: "Guardar",
        confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
        onConfirm: async () => {
          const date = document.getElementById("edit-date").value;
          const startHour = document.getElementById("edit-start").value;
          const endHour = document.getElementById("edit-end").value;
          const reason = document.getElementById("edit-reason").value.trim();
          const status = admin ? document.getElementById("edit-status").value : r.status;
          const errEl = document.getElementById("edit-error");

          if (!date || !startHour || !endHour || !reason) {
            errEl.textContent = "Completa todos los campos";
            errEl.classList.remove("hidden");
            return;
          }
          if (startHour >= endHour) {
            errEl.textContent = "La hora de fin debe ser mayor a la de inicio";
            errEl.classList.remove("hidden");
            return;
          }
          try {
            await updateReservation(id, { date, startHour, endHour, reason, status });
            closeModal();
            showToast("Reserva actualizada");
            homeController();
          } catch {
            showToast("Error al actualizar", "error");
          }
        },
      });
    });
  });

  // Delete (admin only)
  container.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      openModal({
        title: "Eliminar reserva",
        body: "<p class='text-sm text-slate-600'>Esta acción no se puede deshacer. ¿Continuar?</p>",
        confirmText: "Eliminar",
        confirmClass: "bg-red-600 hover:bg-red-700 text-white",
        onConfirm: async () => {
          try {
            await deleteReservation(id);
            closeModal();
            showToast("Reserva eliminada");
            homeController();
          } catch {
            showToast("Error al eliminar", "error");
          }
        },
      });
    });
  });
}
