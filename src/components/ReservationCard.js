import { formatDate, statusLabel, statusClass } from "@/utils";

export default function ReservationCard(reservation, showActions = false, isAdmin = false) {
  const { id, workspace, date, startHour, endHour, reason, status } = reservation;
  const canEdit = status === "pending";
  const canCancel = status === "pending" || status === "approved";

  return `
    <article class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm" data-id="${id}">
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-semibold text-gray-800">${workspace}</h3>
        <span class="text-xs px-2 py-0.5 rounded-full font-medium ${statusClass(status)}">${statusLabel(status)}</span>
      </div>
      <p class="text-sm text-gray-500">${formatDate(date)} &nbsp;·&nbsp; ${startHour} – ${endHour}</p>
      <p class="text-sm text-gray-600 mt-1">${reason}</p>
      ${reservation.userName ? `<p class="text-xs text-gray-400 mt-1">Solicitante: ${reservation.userName}</p>` : ""}

      ${showActions ? `
        <div class="flex gap-2 mt-3 flex-wrap">
          ${canEdit && !isAdmin ? `<button class="edit-btn text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg" data-id="${id}">Editar</button>` : ""}
          ${canCancel ? `<button class="cancel-btn text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-lg" data-id="${id}">Cancelar</button>` : ""}
          ${isAdmin ? `
            <button class="edit-btn text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg" data-id="${id}">Editar</button>
            ${status === "pending" ? `
              <button class="approve-btn text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-lg" data-id="${id}">Aprobar</button>
              <button class="reject-btn text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg" data-id="${id}">Rechazar</button>
            ` : ""}
            <button class="delete-btn text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg" data-id="${id}">Eliminar</button>
          ` : ""}
        </div>
      ` : ""}
    </article>
  `;
}
