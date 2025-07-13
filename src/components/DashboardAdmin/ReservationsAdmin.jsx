import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Dialog } from '@headlessui/react';

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState([]);
  const [filteredType, setFilteredType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReservations = async () => {
      const collections = [
        { name: 'reservas', type: 'yate' },
        { name: 'jetskis', type: 'jetski' },
        { name: 'reservas-limo', type: 'limosina' }
      ];

      let all = [];
      for (const { name, type } of collections) {
        const snapshot = await getDocs(collection(db, name));
        const data = snapshot.docs.map(doc => {
          const createdAt = doc.data().createdAt?.toDate?.();
          return {
            id: doc.id,
            ...doc.data(),
            type,
            date: createdAt ? createdAt.toLocaleDateString() : (doc.data().date || ''),
            timestamp: createdAt ? createdAt.getTime() : null,
            collectionName: name
          };
        });
        all = all.concat(data);
      }

      setReservations(all);
      setLoading(false);
    };

    fetchReservations();
  }, []);

  const filteredReservations = reservations
    .filter(res =>
      (filteredType === 'all' || res.type === filteredType) &&
      ((res.fullName || res.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (res.date || '').toLowerCase().includes(search.toLowerCase())) &&
      (!startDate || new Date(res.date) >= new Date(startDate)) &&
      (!endDate || new Date(res.date) <= new Date(endDate))
    )
    .sort((a, b) => {
      const fieldA = a[sortBy] || '';
      const fieldB = b[sortBy] || '';
      if (sortBy === 'total') return sortOrder === 'asc' ? (a.total || 0) - (b.total || 0) : (b.total || 0) - (a.total || 0);
      return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    });

  const exportToCSV = () => {
    const csvData = filteredReservations.map(res => ({
      Tipo: res.type,
      Fecha: res.date,
      Cliente: res.fullName || res.name || '-',
      Total: res.total,
      Servicios: `${res.addJetski ? 'Jetski ' : ''}${res.addLimo ? 'Limo ' : ''}${res.hours ? `${res.hours}h` : ''}`
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'reservas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Reservas', 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['Tipo', 'Fecha', 'Cliente', 'Total', 'Servicios']],
      body: filteredReservations.map(res => [
        res.type,
        res.date,
        res.fullName || res.name || '-',
        `$${res.total}`,
        `${res.addJetski ? 'Jetski ' : ''}${res.addLimo ? 'Limo ' : ''}${res.hours ? `${res.hours}h` : ''}`
      ]),
    });
    doc.save('reservas.pdf');
  };

  const deleteReservation = async (res) => {
    const confirmed = window.confirm('¿Estás seguro que deseas eliminar esta reserva?');
    if (!confirmed) return;
    await deleteDoc(doc(db, res.collectionName, res.id));
    setReservations(prev => prev.filter(r => r.id !== res.id));
  };

  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const typeColor = {
    yate: 'bg-blue-100 text-blue-800',
    jetski: 'bg-green-100 text-green-800',
    limosina: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="pt 20 px 6">
      <h2 className="text-2xl font-bold mb-4">📁 Reservas</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <select value={filteredType} onChange={(e) => setFilteredType(e.target.value)} className="border px-2 py-1 rounded">
          <option value="all">Todos</option>
          <option value="yate">Yates</option>
          <option value="jetski">Jetskis</option>
          <option value="limosina">Limosinas</option>
        </select>

        <input type="text" placeholder="Buscar por cliente o fecha..." className="border px-2 py-1 rounded" value={search} onChange={(e) => setSearch(e.target.value)} />
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-2 py-1 rounded" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-2 py-1 rounded" />
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={exportToCSV} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Exportar CSV</button>
        <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Exportar PDF</button>
      </div>

      {loading ? (
        <div>Cargando reservas...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="text-gray-500 italic">No hay reservas para este filtro.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                {['type', 'date', 'fullName', 'total'].map(field => (
                  <th key={field} onClick={() => handleSort(field)} className="px-4 py-2 border cursor-pointer hover:bg-gray-200">
                    {field === 'type' ? 'Tipo' : field === 'date' ? 'Fecha' : field === 'fullName' ? 'Cliente' : 'Total'}
                    {sortBy === field ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                ))}
                <th className="px-4 py-2 border">Servicios</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservations.map((res, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className={`border px-4 py-2 capitalize text-center`}><span className={`px-2 py-1 rounded-full text-xs ${typeColor[res.type]}`}>{res.type}</span></td>
                  <td className="border px-4 py-2 text-center">{res.date}</td>
                  <td className={`border px-4 py-2 text-center ${!res.fullName && !res.name ? 'text-red-600' : ''}`}>{res.fullName || res.name || '-'}</td>
                  <td className={`border px-4 py-2 text-center ${!res.total ? 'text-red-600' : ''}`}>{res.total ? `$${res.total}` : '$'}</td>
                  <td className="border px-4 py-2 text-center">
                    {res.addJetski ? 'Jetski ' : ''}
                    {res.addLimo ? 'Limo ' : ''}
                    {res.hours ? `${res.hours}h` : ''}
                  </td>
                  <td className="border px-4 py-2 text-center flex flex-col gap-2">
                    <button className="text-blue-600 hover:underline" onClick={() => setSelectedReservation(res)}>Ver detalles</button>
                    <button className="text-red-600 hover:underline" onClick={() => deleteReservation(res)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <span>Página {currentPage} de {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Anterior</button>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Siguiente</button>
            </div>
          </div>
        </div>
      )}

      {selectedReservation && (
        <Dialog open={!!selectedReservation} onClose={() => setSelectedReservation(null)} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white max-w-lg w-full rounded-xl p-6 shadow-xl">
              <Dialog.Title className="text-xl font-semibold mb-4">Detalles de la Reserva</Dialog.Title>

              <div id="reservation-details" className="text-sm space-y-2">
                {selectedReservation.fullName && (
                  <div><strong>Cliente:</strong> {selectedReservation.fullName}</div>
                )}
                {selectedReservation.email && (
                  <div><strong>Email:</strong> {selectedReservation.email}</div>
                )}
                {selectedReservation.phone && (
                  <div><strong>Teléfono:</strong> {selectedReservation.phone}</div>
                )}
                {selectedReservation.date && (
                  <div><strong>Fecha:</strong> {selectedReservation.date}</div>
                )}
                <div><strong>Tipo:</strong> {selectedReservation.type}</div>
                {selectedReservation.yachtName && (
                  <div><strong>Yate:</strong> {selectedReservation.yachtName}</div>
                )}
                {selectedReservation.limoName && (
                  <div><strong>Limosina:</strong> {selectedReservation.limoName}</div>
                )}
                {selectedReservation.jetName && (
                  <div><strong>Jetski:</strong> {selectedReservation.jetName}</div>
                )}
                {selectedReservation.addJetski && (
                  <div><strong>Jetski adicional:</strong> Sí</div>
                )}
                {selectedReservation.addLimo && (
                  <div><strong>Limosina adicional:</strong> Sí</div>
                )}
                {selectedReservation.hours && (
                  <div><strong>Duración:</strong> {selectedReservation.hours} horas</div>
                )}
                {selectedReservation.total && (
                  <div><strong>Total pagado:</strong> ${selectedReservation.total}</div>
                )}
                {selectedReservation.message && (
                  <div><strong>Mensaje:</strong> {selectedReservation.message}</div>
                )}
              </div>

              <div className="text-right mt-6 flex justify-end gap-3">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => {
                    const doc = new jsPDF();
                    doc.text('Detalles de la Reserva', 14, 20);
                    const details = [
                      ['Cliente', selectedReservation.fullName || ''],
                      ['Email', selectedReservation.email || ''],
                      ['Teléfono', selectedReservation.phone || ''],
                      ['Fecha', selectedReservation.date || ''],
                      ['Tipo', selectedReservation.type || ''],
                      ['Yate', selectedReservation.yachtName || ''],
                      ['Limosina', selectedReservation.limoName || ''],
                      ['Jetski', selectedReservation.jetName || ''],
                      ['Jetski adicional', selectedReservation.addJetski ? 'Sí' : 'No'],
                      ['Limosina adicional', selectedReservation.addLimo ? 'Sí' : 'No'],
                      ['Duración', selectedReservation.hours ? `${selectedReservation.hours} horas` : ''],
                      ['Total', selectedReservation.total ? `$${selectedReservation.total}` : ''],
                      ['Mensaje', selectedReservation.message || '']
                    ];
                    details.forEach(([label, value], index) => {
                      doc.text(`${label}: ${value}`, 14, 30 + index * 8);
                    });
                    doc.save(`reserva-${selectedReservation.id || 'detalle'}.pdf`);
                  }}
                >
                  Exportar PDF
                </button>

                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                  onClick={() => setSelectedReservation(null)}
                >
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
