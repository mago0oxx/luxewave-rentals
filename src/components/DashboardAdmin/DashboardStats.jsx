import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function DashboardStats() {
  const [totalReservas, setTotalReservas] = useState(0);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [usuariosTotales, setUsuariosTotales] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Obtener reservas
      const reservasSnapshot = await getDocs(collection(db, "reservas"));
      setTotalReservas(reservasSnapshot.size);

      let total = 0;
      reservasSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.total) {
          total += Number(data.total) || 0;
        }
      });
      setIngresosTotales(total);

      // Obtener usuarios
      const usersSnapshot = await getDocs(collection(db, "usuarios"));
      setUsuariosTotales(usersSnapshot.size);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold">Reservas totales</h2>
        <p className="text-2xl text-blue-600">{totalReservas}</p>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold">Ingresos estimados</h2>
        <p className="text-2xl text-green-600">${ingresosTotales}</p>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold">Usuarios registrados</h2>
        <p className="text-2xl text-purple-600">{usuariosTotales}</p>
      </div>
    </div>
  );
}
