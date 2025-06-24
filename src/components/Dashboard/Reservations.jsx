import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Reservations() {
  const [user, loadingAuth] = useAuthState(auth);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadingAuth || !user) return;

    const fetchReservas = async () => {
      try {
        const jetskiRef = collection(db, 'reservasJetski');
        const jetskiSnap = await getDocs(query(jetskiRef, where('email', '==', user.email)));
        const jetskiList = jetskiSnap.docs.map(doc => ({
          id: doc.id,
          tipo: 'Jetski',
          ...doc.data()
        }));

        const yateRef = collection(db, 'reservations', user.uid, 'items');
        const yateSnap = await getDocs(yateRef);
        const yateList = yateSnap.docs.map(doc => ({
          id: doc.id,
          tipo: 'Yate',
          ...doc.data()
        }));

        setReservas([...jetskiList, ...yateList].sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      } catch (err) {
        console.error("Error al obtener reservas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user, loadingAuth]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tus Reservas</h2>
      {loading || loadingAuth ? (
        <p className="text-gray-500">Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p className="text-gray-500">Aún no tienes reservas.</p>
      ) : (
        <ul className="divide-y">
          {reservas.map((r) => (
            <li key={r.id} className="py-4">
              <p><strong>Tipo:</strong> {r.tipo}</p>
              <p><strong>Nombre:</strong> {r.fullName}</p>
              <p><strong>Email:</strong> {r.email}</p>
              <p><strong>Fecha:</strong> {r.date}</p>
              {r.tipo === 'Jetski' && (
                <>
                  <p><strong>Jetskis:</strong> {r.jetskiCount}</p>
                  <p><strong>Horas:</strong> {r.hours}</p>
                </>
              )}
              <p><strong>Mensaje:</strong> {r.message || '—'}</p>
              <p><strong>Total:</strong> ${r.total}</p>
              <p><strong>Pagado:</strong> {r.paymentOption === '100' ? 'Sí (100%)' : 'Parcial (50%)'}</p>
              <p><strong>Pagado ahora:</strong> ${r.amountToPay}</p>
              {r.createdAt && (
                <p className="text-gray-400 text-sm">Reservado el: {new Date(r.createdAt.seconds * 1000).toLocaleString()}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
