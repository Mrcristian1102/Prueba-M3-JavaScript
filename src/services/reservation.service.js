import { http } from "@api/http";
import { timesOverlap } from "@/utils";

export const getReservations = () => http.get("/reservations");

export const getReservationsByUser = (userId) =>
  http.get(`/reservations?userId=${userId}`);

export const createReservation = async (data) => {
  const existing = await getReservations();
  const conflict = existing.find(
    (r) =>
      r.spaceId === data.spaceId &&
      r.date === data.date &&
      r.status !== "cancelled" &&
      r.status !== "rejected" &&
      timesOverlap(r.startHour, r.endHour, data.startHour, data.endHour)
  );
  if (conflict) throw new Error("Ya existe una reserva para ese espacio en ese horario");
  return http.post("/reservations", { ...data, status: "pending" });
};

export const updateReservation = (id, data) =>
  http.patch(`/reservations/${id}`, data);

export const deleteReservation = (id) => http.delete(`/reservations/${id}`);
