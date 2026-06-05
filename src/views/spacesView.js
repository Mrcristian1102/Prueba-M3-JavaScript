import Sidebar from "@components/Sidebar";
import { spacesController } from "@controllers/spaces.controller";

export default function spacesView() {
  setTimeout(() => spacesController());

  return `
    <div class="flex min-h-screen bg-slate-100">
      ${Sidebar()}
      <main class="flex-1 p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-xl font-bold text-slate-800">Gestión de Espacios</h1>
          <button id="newSpaceBtn" class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">+ Nuevo Espacio</button>
        </div>
        <div id="spacesContainer" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <p class="text-slate-400 text-sm text-center py-8 col-span-3">Cargando...</p>
        </div>
      </main>
    </div>
  `;
}
