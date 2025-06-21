// src/pages/ReserveYacht.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase/firebase';
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function ReserveYacht() {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);

  const [hours, setHours] = useState(4);
  const [addJetski, setAddJetski] = useState(false);
  const [addLimo, setAddLimo] = useState(false);
  const [date, setDate] = useState(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [yachts, setYachts] = useState([]);
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [confirming, setConfirming] = useState(false);

  const basePrices = { 4: 1000, 6: 1400, 8: 1700 };
  const extras = { jetski: 180, limo: 240 };
  const total = basePrices[hours] + (addJetski ? extras.jetski : 0) + (addLimo ? extras.limo : 0);

  useEffect(() => {
    const fetchYachts = async () => {
      const snapshot = await getDocs(collection(db, 'yachts'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setYachts(list);
      if (list.length > 0) setSelectedYacht(list[0]);
    };
    fetchYachts();
  }, []);

  useEffect(() => {
    const fetchBookedDates = async () => {
      if (!selectedYacht) return;
      const q = query(collection(db, 'reservas'), where('yachtId', '==', selectedYacht.id));
      const querySnapshot = await getDocs(q);
      const dates = querySnapshot.docs.map(doc => doc.data().date);
      const parsedDates = dates.map(d => new Date(d));
      setBookedDates(parsedDates);
    };
    fetchBookedDates();
  }, [selectedYacht]);

  const isDateBooked = (selectedDate) => {
    if (!selectedDate) return false;
    return bookedDates.some(
      (booked) =>
        booked.getFullYear() === selectedDate.getFullYear() &&
        booked.getMonth() === selectedDate.getMonth() &&
        booked.getDate() === selectedDate.getDate()
    );
  };

  const handleSubmit = async () => {
    if (!user || !date || !selectedYacht) return;

    setLoading(true);
    setError('');

    try {
      if (isDateBooked(date)) {
        setError('Esa fecha ya está reservada para este yate. Por favor elige otra.');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'reservas'), {
        fullName: user.displayName || '',
        email: user.email || '',
        phone: '',
        date: date.toISOString().split('T')[0],
        message,
        hours,
        addJetski,
        addLimo,
        total,
        yachtId: selectedYacht.id,
        yachtName: selectedYacht.name,
        createdAt: Timestamp.now(),
      });
      setSubmitted(true);
      setConfirming(false);
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      setError('Hubo un problema al guardar la reserva. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const showConfirmation = () => {
    if (!user || !date || !selectedYacht) {
      setError('Faltan datos para confirmar la reserva.');
      return;
    }
    setConfirming(true);
  };

  return (
    <section className="bg-white py-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
          {t('yachtReservation.title')}
        </h1>

        <div className="rounded-xl overflow-hidden shadow mb-8">
          <img src="/images/yacht.jpg" alt="Yacht" className="w-full h-100 object-cover" />
        </div>

        {submitted ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-md text-center">
            ¡Gracias por tu reserva! Nos pondremos en contacto contigo pronto.
          </div>
        ) : confirming ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Confirma tu reserva</h2>
            <ul className="space-y-2">
              <li><strong>Nombre:</strong> {user.displayName || 'Usuario'}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Yate:</strong> {selectedYacht?.name} (capacidad: {selectedYacht?.capacity})</li>
              <li><strong>Fecha:</strong> {date?.toLocaleDateString()}</li>
              <li><strong>Duración:</strong> {hours} horas</li>
              <li><strong>Jetski:</strong> {addJetski ? 'Sí' : 'No'}</li>
              <li><strong>Limusina:</strong> {addLimo ? 'Sí' : 'No'}</li>
              <li><strong>Total:</strong> ${total}</li>
              {message && <li><strong>Mensaje:</strong> {message}</li>}
            </ul>
            <div className="mt-6 flex gap-4">
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Confirmar</button>
              <button onClick={() => setConfirming(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg shadow mb-10">
            <h2 className="text-xl font-semibold mb-4">Selecciona tu yate</h2>
            <select
              value={selectedYacht?.id || ''}
              onChange={(e) => {
                const yacht = yachts.find((y) => y.id === e.target.value);
                setSelectedYacht(yacht);
              }}
              className="w-full border p-2 rounded mb-4"
            >
              {yachts.map((yacht) => (
                <option key={yacht.id} value={yacht.id}>
                  {yacht.name} - Capacidad: {yacht.capacity} personas
                </option>
              ))}
            </select>

            <h2 className="text-xl font-semibold mb-4">Duración del viaje</h2>
            <div className="flex gap-4 mb-6">
              {[4, 6, 8].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`px-6 py-2 rounded-lg border font-medium transition ${hours === h ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50'}`}
                >
                  {h}h - ${basePrices[h]}
                </button>
              ))}
            </div>

            <h2 className="text-xl font-semibold mb-4">Servicios adicionales</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={addJetski} onChange={() => setAddJetski(!addJetski)} />
                Jetski (+${extras.jetski})
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={addLimo} onChange={() => setAddLimo(!addLimo)} />
                Servicio de limusina (+${extras.limo})
              </label>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                minDate={new Date()}
                placeholderText="Selecciona una fecha"
                dateFormat="yyyy-MM-dd"
                className="w-full border p-2 rounded-md"
                excludeDates={bookedDates}
              />
              {date && isDateBooked(date) && (
                <p className="text-red-600 mt-1 text-sm">Esa fecha ya está reservada para este yate.</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje adicional</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="3"
                className="w-full border p-2 rounded-md"
                placeholder="Escribe algún comentario adicional..."
              />
            </div>

            {error && <p className="mt-2 text-red-600 font-semibold">{error}</p>}

            <div className="mt-8 text-lg font-bold">Total: ${total}</div>

            <div className="mt-6">
              <button
                onClick={showConfirmation}
                disabled={!date || isDateBooked(date)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
