import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Metrics() {
  const [totalReservations, setTotalReservations] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [users, setUsers] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredType, setFilteredType] = useState('all');
  const [availableTypes, setAvailableTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const collectionsToFetch = [
        { name: 'reservas', type: 'general' },
        { name: 'reservas-limo', type: 'limosina' },
        { name: 'jetskis', type: 'jetski' },
        { name: 'yachts', type: 'yate' }
      ];

      let allReservations = [];

      for (const { name, type } of collectionsToFetch) {
        const snapshot = await getDocs(collection(db, name));
        const data = snapshot.docs.map(doc => ({
          ...doc.data(),
          type,
          timestamp: doc.data().createdAt?.toDate?.() || new Date(doc.data().date),
        }));
        allReservations = allReservations.concat(data);
      }

      const uniqueTypes = Array.from(new Set(allReservations.map(r => r.type))).filter(Boolean);
      setAvailableTypes(uniqueTypes);

      const filteredReservations = filteredType === 'all'
        ? allReservations
        : allReservations.filter(res => res.type === filteredType);

      setTotalReservations(filteredReservations.length);
      const revenue = filteredReservations.reduce((sum, res) => sum + (res.total || 0), 0);
      setTotalRevenue(revenue);

      const monthlyStats = {};
      filteredReservations.forEach(res => {
        const date = new Date(res.timestamp);
        const month = date.toLocaleString('es-ES', { month: 'short' });
        if (!monthlyStats[month]) {
          monthlyStats[month] = { reservas: 0, ingresos: 0 };
        }
        monthlyStats[month].reservas += 1;
        monthlyStats[month].ingresos += res.total || 0;
      });

      const sortedMonths = Object.entries(monthlyStats).map(([month, data]) => ({
        month,
        ...data,
      })).sort((a, b) => new Date(`01 ${a.month} 2023`) - new Date(`01 ${b.month} 2023`));

      setMonthlyData(sortedMonths);

      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userList = usersSnapshot.docs.map(doc => doc.data());
      setUsers(userList);

      setLoading(false);
    };

    fetchData();
  }, [filteredType]);

  const exportToCSV = () => {
    const csv = Papa.unparse(monthlyData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'metrics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Métricas Mensuales', 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['Mes', 'Reservas', 'Ingresos']],
      body: monthlyData.map(row => [row.month, row.reservas, `$${row.ingresos}`]),
    });
    doc.save('metrics.pdf');
  };

  if (loading) return <div className="p-6">Cargando métricas...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Métricas Generales</h2>

      <div className="mb-4">
        <label className="text-sm font-medium mr-2">Filtrar por tipo de servicio:</label>
        <select
          value={filteredType}
          onChange={(e) => setFilteredType(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="all">Todos</option>
          {availableTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Reservas Totales</p>
          <p className="text-2xl font-semibold text-blue-600">{totalReservations}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Ingresos Estimados</p>
          <p className="text-2xl font-semibold text-green-600">${totalRevenue}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Usuarios Registrados</p>
          <p className="text-2xl font-semibold text-indigo-600">{users.length}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={exportToCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Exportar CSV
        </button>
        <button
          onClick={exportToPDF}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Exportar PDF
        </button>
      </div>

      {monthlyData.length === 0 ? (
        <div className="text-center text-gray-600 italic">No hay datos para este filtro.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-4">📅 Reservas por Mes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Bar dataKey="reservas" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-4">💰 Ingresos por Mes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="ingresos" stroke="#48BB78" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
