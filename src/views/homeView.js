import Sidebar from "@components/Sidebar";
import { getSession, isAdmin } from "@/utils";
import { homeController } from "@controllers/home.controller";

export default function homeView() {
  const user = getSession();

  setTimeout(() => homeController());

  return `
    <div class="flex min-h-screen bg-slate-100">
      ${Sidebar()}

      <main class="flex-1 p-6">
        <div class="mb-6">
          <h1 class="text-xl font-bold text-slate-800">Hola, ${user?.name}</h1>
          <p class="text-sm text-slate-500 mt-0.5">${isAdmin() ? "Panel de administración" : "Mis reservas"}</p>
        </div>

        ${
          isAdmin()
            ? `<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div class="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
                  <p class="text-2xl font-bold text-blue-600" id="stat-total">-</p>
                  <p class="text-xs text-slate-500 mt-1">Total</p>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
                  <p class="text-2xl font-bold text-yellow-500" id="stat-pending">-</p>
                  <p class="text-xs text-slate-500 mt-1">Pendientes</p>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
                  <p class="text-2xl font-bold text-green-600" id="stat-approved">-</p>
                  <p class="text-xs text-slate-500 mt-1">Aprobadas</p>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm text-center border border-gray-100">
                  <p class="text-2xl font-bold text-red-500" id="stat-rejected">-</p>
                  <p class="text-xs text-slate-500 mt-1">Rechazadas</p>
                </div>
              </div>`
            : ""
        }

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-slate-700">
              ${isAdmin() ? "Todas las reservas" : "Mis reservas"}
            </h2>
            ${!isAdmin() ? `<a href="/reservations/new" id="newResBtn" class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors">+ Nueva</a>` : ""}
          </div>

          <div id="reservationsContainer" class="grid gap-3 sm:grid-cols-2">
            <div class="col-span-2 text-center py-8 text-slate-400 text-sm">Cargando...</div>
          </div>
        </div>
      </main>
    </div>
  `;
}
