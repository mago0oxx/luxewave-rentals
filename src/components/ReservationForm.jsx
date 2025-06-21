import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function ReservationForm() {
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState(1);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías guardar la reserva en Firestore
    alert(`Reserva hecha por ${email} para el día ${date}, por ${hours} hora(s).`);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Formulario de Reserva</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
          <input
            type="date"
            required
            className="w-full px-4 py-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded"
          >
            <option value={1}>1 hora</option>
            <option value={2}>2 horas</option>
            <option value={3}>3 horas</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Reservar
          </button>
        </form>
      </div>
    </section>
  );
}
