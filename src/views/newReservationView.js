import Sidebar from "@components/Sidebar";
import { newReservationController } from "@controllers/newReservation.controller";

export default function newReservationView() {
  setTimeout(() => newReservationController());

  return `
    <div class="flex min-h-screen bg-slate-100">
      ${Sidebar()}
      <main class="flex-1 p-6">
        <div class="mb-6 flex items-center gap-3">
          <button id="backBtn" class="text-slate-400 hover:text-slate-600 text-xl">←</button>
          <h1 class="text-xl font-bold text-slate-800">Nueva Reserva</h1>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-lg">
          <div id="formWrapper">
            <p class="text-slate-400 text-sm text-center py-6">Cargando espacios...</p>
          </div>
        </div>
      </main>
    </div>
  `;
}
