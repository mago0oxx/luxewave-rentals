import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  BarChartBig,
  Settings,
} from "lucide-react";

const adminLinks = [
  {
    name: "Métricas",
    path: "/admin/metrics",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Reservas",
    path: "/admin/reservations",
    icon: <CalendarCheck size={18} />,
  },
  {
    name: "Usuarios",
    path: "/admin/users",
    icon: <Users size={18} />,
  },
  {
    name: "Reportes",
    path: "/admin/reports",
    icon: <BarChartBig size={18} />,
  },
  {
    name: "Configuración",
    path: "/admin/settings",
    icon: <Settings size={18} />,
  },
];

export default function SidebarAdmin() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg border-r min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Admin Panel</h2>

      <nav className="flex flex-col gap-2">
        {adminLinks.map(({ name, path, icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 transition ${location.pathname === path
                ? "bg-blue-600 text-white"
                : "text-gray-700"
              }`}
          >
            {icon}
            <span>{name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
