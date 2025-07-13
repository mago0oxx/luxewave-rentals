import { useState } from "react";
import DashboardStats from "../DashboardAdmin/DashboardStats";
import ReservationsList from "./admin/ReservationsList";
import UsersList from "./admin/UsersList";

export default function AdminDashboard() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("dashboard")}
          className="px-4 py-2 rounded bg-blue-500 text-white"
        >
          Dashboard
        </button>
        <button
          onClick={() => setTab("reservations")}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          Reservas
        </button>
        <button
          onClick={() => setTab("users")}
          className="px-4 py-2 rounded bg-purple-500 text-white"
        >
          Usuarios
        </button>
      </div>

      {tab === "dashboard" && <DashboardStats />}
      {tab === "reservations" && <ReservationsList />}
      {tab === "users" && <UsersList />}
    </div>
  );
}
