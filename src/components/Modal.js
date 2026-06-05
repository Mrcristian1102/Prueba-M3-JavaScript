export function openModal({ title, body, confirmText = "Confirmar", confirmClass = "bg-blue-600 hover:bg-blue-700 text-white", onConfirm }) {
  document.getElementById("modal-overlay")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4";
  overlay.innerHTML = `
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">${title}</h3>
      <div class="mb-5">${body}</div>
      <div class="flex gap-3 justify-end">
        <button id="modal-cancel" class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm">Cancelar</button>
        <button id="modal-confirm" class="px-4 py-2 rounded-lg text-sm ${confirmClass}">${confirmText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  document.getElementById("modal-confirm").addEventListener("click", onConfirm);
}

export function closeModal() {
  document.getElementById("modal-overlay")?.remove();
}

export function showToast(message, type = "success") {
  document.getElementById("toast")?.remove();
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };
  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = `fixed top-4 right-4 z-50 ${colors[type] || colors.success} text-white text-sm px-4 py-3 rounded-lg shadow-lg`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
