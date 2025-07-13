import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Dialog } from '@headlessui/react';

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    const confirmed = window.confirm('¿Estás seguro que deseas eliminar este usuario?');
    if (!confirmed) return;
    await deleteDoc(doc(db, 'users', userId));
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const exportToCSV = () => {
    const csvData = users.map(user => ({
      ID: user.id,
      Nombre: user.fullName || '-',
      Email: user.email || '-',
      FechaRegistro: user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : '-',
      Rol: user.role || 'usuario'
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'usuarios.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const docPDF = new jsPDF();
    docPDF.text('Reporte de Usuarios', 14, 16);
    docPDF.autoTable({
      startY: 20,
      head: [['ID', 'Nombre', 'Email', 'Fecha Registro', 'Rol']],
      body: users.map(user => [
        user.id,
        user.fullName || '-',
        user.email || '-',
        user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : '-',
        user.role || 'usuario'
      ])
    });
    docPDF.save('usuarios.pdf');
  };

  const filteredUsers = users.filter(u =>
    (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👥 Usuarios</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input type="text" placeholder="Buscar por nombre o email..." className="border px-2 py-1 rounded" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={exportToCSV} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Exportar CSV</button>
        <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Exportar PDF</button>
      </div>

      {loading ? (
        <div>Cargando usuarios...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-gray-500 italic">No hay usuarios registrados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Fecha Registro</th>
                <th className="px-4 py-2 border">Rol</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.fullName || '-'}</td>
                  <td className="border px-4 py-2">{user.email || '-'}</td>
                  <td className="border px-4 py-2">
                    {user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : '-'}
                  </td>
                  <td className="border px-4 py-2 capitalize">{user.role || 'usuario'}</td>
                  <td className="border px-4 py-2 text-center flex flex-col gap-2">
                    <button className="text-blue-600 hover:underline" onClick={() => setSelectedUser(user)}>Ver detalles</button>
                    <button className="text-red-600 hover:underline" onClick={() => deleteUser(user.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white max-w-lg w-full rounded-xl p-6 shadow-xl">
              <Dialog.Title className="text-xl font-semibold mb-4">Detalles del Usuario</Dialog.Title>
              <div className="text-sm space-y-2">
                {Object.entries(selectedUser).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong>{' '}
                    {value?.seconds ? new Date(value.seconds * 1000).toLocaleString() : String(value)}
                  </div>
                ))}
              </div>
              <div className="text-right mt-6">
                <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800" onClick={() => setSelectedUser(null)}>
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
