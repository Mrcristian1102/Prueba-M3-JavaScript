import { saveSession } from "@/utils";
import { navigateTo } from "@router/router";
import { http } from "@api/http";

export const loginController = () => {
  const form = document.querySelector("#loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;
    const errorEl = document.querySelector("#loginError");
    const submitBtn = document.querySelector("#submitBtn");

    errorEl.classList.add("hidden");

    if (!email || !password) {
      errorEl.textContent = "Completa todos los campos";
      errorEl.classList.remove("hidden");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Ingresando...";

    try {
      const users = await http.get(`/users?email=${encodeURIComponent(email)}`);
      const user = users.find((u) => u.password === password);

      if (!user) {
        errorEl.textContent = "Correo o contraseña incorrectos";
        errorEl.classList.remove("hidden");
        submitBtn.disabled = false;
        submitBtn.textContent = "Ingresar";
        return;
      }

      saveSession({ id: user.id, name: user.name, role: user.role });
      navigateTo("/home");
    } catch {
      errorEl.textContent = "Error al conectar con el servidor";
      errorEl.classList.remove("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = "Ingresar";
    }
  });
};
