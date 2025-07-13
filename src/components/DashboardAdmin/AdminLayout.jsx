import { Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdmin />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
