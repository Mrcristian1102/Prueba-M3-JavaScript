export const saveSession = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getSession = () => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export const removeSession = () => {
  localStorage.removeItem("user");
};

export const isAuthenticated = () => !!getSession();

export const isAdmin = () => getSession()?.role === "admin";

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

export const statusLabel = (status) => {
  const map = {
    pending: "Pendiente",
    approved: "Aprobada",
    rejected: "Rechazada",
    cancelled: "Cancelada",
  };
  return map[status] || status;
};

export const statusClass = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-600",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

export const today = () => new Date().toISOString().split("T")[0];

export const timesOverlap = (s1, e1, s2, e2) => s1 < e2 && e1 > s2;
