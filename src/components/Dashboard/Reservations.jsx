import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Reservations() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      const user = auth.currentUser;
      if (user) {
        const ref = collection(db, 'reservations', user.uid, 'items');
        const snap = await getDocs(ref);
        const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReservas(lista);
      }
    };
    fetchReservas();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tus Reservas</h2>
      {reservas.length === 0 ? (
        <p className="text-gray-500">Aún no tienes reservas.</p>
      ) : (
        <ul className="divide-y">
          {reservas.map((r) => (
            <li key={r.id} className="py-2">
              <p><strong>Nombre:</strong> {r.fullName}</p>
              <p><strong>Fecha:</strong> {r.date}</p>
              <p><strong>Mensaje:</strong> {r.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}