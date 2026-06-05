import { removeSession, getSession, isAdmin } from "@/utils";
import { navigateTo } from "@router/router";

export default function Sidebar() {
  const user = getSession();

  setTimeout(() => {
    document.querySelector("#logoutBtn")?.addEventListener("click", () => {
      removeSession();
      navigateTo("/");
    });

    document.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(link.getAttribute("href"));
      });
    });
  });

  return `
    <aside class="w-56 bg-slate-900 text-white min-h-screen p-5 flex flex-col">
      <h2 class="text-xl font-bold mb-2">Riwi</h2>
      <p class="text-xs text-slate-400 mb-6">${user?.name} <span class="ml-1 bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">${user?.role}</span></p>

      <nav class="flex flex-col gap-2 flex-1">
        <a href="/home" data-link class="px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm">
          Inicio
        </a>
        ${isAdmin()
      ? `
          <a href="/admin/reservations" data-link class="px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm">
            Todas las Reservas
          </a>
          <a href="/admin/spaces" data-link class="px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm">
            Espacios
          </a>`
      : `
          <a href="/reservations/new" data-link class="px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm">
            Nueva Reserva
          </a>`
    }
      </nav>

      <button
        id="logoutBtn"
        class="text-left text-sm cursor-pointer text-red-400 hover:text-white hover:bg-red-600 px-3 py-2 rounded-lg transition-colors mt-4"
      >
        Cerrar sesión
      </button>
    </aside>
  `;
}
