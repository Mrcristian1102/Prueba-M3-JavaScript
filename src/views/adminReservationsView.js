import Sidebar from "@components/Sidebar";
import { adminReservationsController } from "@controllers/adminReservations.controller";

export default function adminReservationsView() {
  setTimeout(() => adminReservationsController());

  return `
    <div class="flex min-h-screen bg-slate-100">
      ${Sidebar()}
      <main class="flex-1 p-6">
        <h1 class="text-xl font-bold text-slate-800 mb-6">Gestión de Reservas</h1>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div id="adminResContainer">
            <p class="text-slate-400 text-sm text-center py-8">Cargando...</p>
          </div>
        </div>
      </main>
    </div>
  `;
}
