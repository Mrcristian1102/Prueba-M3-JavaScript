import { getSpaces } from "@services/space.service";
import { createReservation } from "@services/reservation.service";
import { getSession } from "@/utils";
import { navigateTo } from "@router/router";
import { showToast } from "@components/Modal";

export const newReservationController = async () => {
  const user = getSession();
  const wrapper = document.querySelector("#formWrapper");
  const backBtn = document.querySelector("#backBtn");

  backBtn?.addEventListener("click", () => navigateTo("/home"));

  try {
    const spaces = await getSpaces();
    const available = spaces.filter((s) => s.status === "available");

    wrapper.innerHTML = `
      <form id="newResForm" novalidate class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Espacio</label>
          <select id="res-space" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">-- Selecciona un espacio --</option>
            ${available.map((s) => `<option value="${s.id}" data-name="${s.name}">${s.name} (${s.type} · Cap. ${s.capacity})</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
          <input type="date" id="res-date" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" min="${today()}" />
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-slate-700 mb-1">Hora inicio</label>
            <input type="time" id="res-start" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-slate-700 mb-1">Hora fin</label>
            <input type="time" id="res-end" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
          <input type="text" id="res-reason" maxlength="100" placeholder="Ej: Reunión de equipo" class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <p id="res-error" class="text-red-500 text-sm hidden"></p>
        <div class="flex gap-3 pt-1">
          <button type="button" id="cancelBtn" class="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-50 py-2 rounded-lg text-sm transition-colors">Cancelar</button>
          <button type="submit" id="submitBtn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">Crear reserva</button>
        </div>
      </form>
    `;

    document.querySelector("#cancelBtn").addEventListener("click", () => navigateTo("/home"));

    document.querySelector("#newResForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = document.querySelector("#res-error");
      errEl.classList.add("hidden");

      const spaceSelect = document.querySelector("#res-space");
      const spaceId = parseInt(spaceSelect.value);
      const spaceName = spaceSelect.options[spaceSelect.selectedIndex]?.dataset.name || "";
      const date = document.querySelector("#res-date").value;
      const startHour = document.querySelector("#res-start").value;
      const endHour = document.querySelector("#res-end").value;
      const reason = document.querySelector("#res-reason").value.trim();

      if (!spaceId) return showErr(errEl, "Selecciona un espacio");
      if (!date) return showErr(errEl, "Ingresa la fecha");
      if (!startHour || !endHour) return showErr(errEl, "Ingresa el horario");
      if (startHour >= endHour) return showErr(errEl, "La hora de fin debe ser posterior al inicio");
      if (!reason) return showErr(errEl, "Ingresa el motivo");

      const submitBtn = document.querySelector("#submitBtn");
      submitBtn.disabled = true;
      submitBtn.textContent = "Guardando...";

      try {
        await createReservation({
          userId: user.id,
          userName: user.name,
          spaceId,
          workspace: spaceName,
          date,
          startHour,
          endHour,
          reason,
        });
        showToast("Reserva creada correctamente");
        navigateTo("/home");
      } catch (err) {
        showErr(errEl, err.message);
        submitBtn.disabled = false;
        submitBtn.textContent = "Crear reserva";
      }
    });
  } catch {
    wrapper.innerHTML = `<p class="text-red-400 text-sm text-center py-6">Error al cargar los espacios</p>`;
  }
};

const showErr = (el, msg) => {
  el.textContent = msg;
  el.classList.remove("hidden");
};

const today = () => new Date().toISOString().split("T")[0];
