import loginView from "@views/loginView";
import homeView from "@views/homeView";
import newReservationView from "@views/newReservationView";
import adminReservationsView from "@views/adminReservationsView";
import spacesView from "@views/spacesView";
import accessDeniedView from "@views/accessDenied";
import NotFoundView from "@views/notFound";
import { isAuthenticated, isAdmin } from "@/utils";

const routes = {
  "/": loginView,
  "/home": homeView,
  "/reservations/new": newReservationView,
  "/admin/reservations": adminReservationsView,
  "/admin/spaces": spacesView,
  "/access-denied": accessDeniedView,
};

export const navigateTo = (path) => {
  history.pushState({}, "", path);
  router();
};

export const router = () => {
  const app = document.querySelector("#app");
  const path = window.location.pathname;

  // Public routes
  if (path === "/") {
    if (isAuthenticated()) {
      return navigateTo("/home");
    }
    app.innerHTML = routes["/"]();
    return;
  }

  // All other routes require auth
  if (!isAuthenticated()) {
    return navigateTo("/");
  }

  // Admin-only routes
  if (
    (path === "/admin/reservations" || path === "/admin/spaces") &&
    !isAdmin()
  ) {
    app.innerHTML = accessDeniedView();
    return;
  }

  const view = routes[path];
  if (!view) {
    app.innerHTML = NotFoundView();
    // attach 404 back button
    setTimeout(() => {
      document.querySelector("#goHome")?.addEventListener("click", () => navigateTo("/home"));
    });
    return;
  }

  app.innerHTML = view();
};

window.addEventListener("popstate", router);
