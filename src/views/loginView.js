import { loginController } from "@controllers/login.controller";

export default function loginView() {
  setTimeout(() => loginController());

  return `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        <h1 class="text-2xl font-bold text-slate-800 mb-1">Bienvenido</h1>
        <p class="text-sm text-slate-500 mb-6">Sistema de Reservas de Espacios</p>

        <form id="loginForm" novalidate>
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-1">Correo</label>
            <input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div class="mb-5">
            <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              class="border border-slate-300 w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <p id="loginError" class="text-red-500 text-sm mb-3 hidden"></p>

          <button
            type="submit"
            id="submitBtn"
            class="bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Ingresar
          </button>
        </form>

        <div class="mt-5 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
          <p class="font-medium mb-1">Usuarios de prueba:</p>
          <p>Admin: admin@test.com / A123456</p>
          <p>User: user@test.com / A123456</p>
        </div>

      </div>
    </div>
  `;
}
