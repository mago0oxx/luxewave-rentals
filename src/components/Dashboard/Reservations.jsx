import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function Reservations() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchReservas = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const jetskiRef = collection(db, 'reservas');
      const jetskiSnap = await getDocs(query(jetskiRef, where('email', '==', user.email)));
      const jetskiList = jetskiSnap.docs.map(doc => ({
        id: doc.id,
        tipo: 'Jetski',
        ...doc.data()
      }));

      const yateRef = collection(db, 'reservats', user.uid, 'items');
      const yateSnap = await getDocs(yateRef);
      const yateList = yateSnap.docs.map(doc => ({
        id: doc.id,
        tipo: 'Yate',
        ...doc.data()
      }));

      setReservas([...jetskiList, ...yateList].sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      setLoading(false);
    };

    fetchReservas();
  }, []);

  const filteredReservas = filter === 'all' ? reservas : reservas.filter(r => r.tipo === filter);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 max-w-[1300px] mx-auto mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Tus Reservas</h2>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm"
          >
            <option value="all">Todas</option>
            <option value="Jetski">Jetski</option>
            <option value="Yate">Yate</option>
          </select>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Exportar a PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando reservas...</p>
      ) : filteredReservas.length === 0 ? (
        <p className="text-gray-500">No hay reservas para mostrar.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredReservas.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Tipo:</strong> {r.tipo}</p>
                <p><strong>Nombre:</strong> {r.fullName}</p>
                <p><strong>Email:</strong> <span className="break-all">{r.email}</span></p>
                <p><strong>Fecha:</strong> {r.date}</p>

                {r.tipo === 'Jetski' && (
                  <>
                    <p><strong>Jetskis:</strong> {r.jetskiCount}</p>
                    <p><strong>Horas:</strong> {r.hours}</p>
                  </>
                )}

                {r.tipo === 'Yate' && (
                  <>
                    <p><strong>Yate:</strong> {r.yachtName}</p>
                    <p><strong>Horas:</strong> {r.hours}</p>
                    <p><strong>Invitados:</strong> {r.guests}</p>
                    <p><strong>Servicios extra:</strong> {r.addServices?.join(', ') || '—'}</p>
                  </>
                )}

                <p><strong>Mensaje:</strong> {r.message || '—'}</p>
                <p><strong>Total:</strong> ${r.total}</p>
                <p>
                  <strong>Pagado:</strong>{' '}
                  {r.paymentOption === '100' ? (
                    <span className="text-green-600 font-semibold">Sí (100%)</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Parcial (50%)</span>
                  )}
                </p>
                <p><strong>Pagado ahora:</strong> ${r.amountToPay}</p>
              </div>
              {r.createdAt && (
                <div className="border-t border-gray-200 mt-4 pt-2">
                  <p className="text-xs text-gray-400">
                    Reservado el: {new Date(r.createdAt.seconds * 1000).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
