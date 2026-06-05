import { isAuthenticated } from "@/utils";
import { navigateTo } from "@router/router";

export default function accessDeniedView() {
  setTimeout(() => {
    document.querySelector("#backBtn")?.addEventListener("click", () => {
      navigateTo(isAuthenticated() ? "/home" : "/");
    });
  });

  return `
    <div class="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4">
      <div class="bg-white rounded-xl shadow-md p-8 text-center max-w-sm w-full">
        <div class="text-5xl mb-4">🔒</div>
        <h2 class="text-xl font-bold text-slate-800 mb-2">Acceso denegado</h2>
        <p class="text-sm text-slate-500 mb-6">No tienes permisos para ver esta sección.</p>
        <button id="backBtn" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition-colors">
          Volver al inicio
        </button>
      </div>
    </div>
  `;
}
