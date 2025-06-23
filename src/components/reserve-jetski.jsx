import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase/firebase';
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import emailjs from 'emailjs-com';
import Spinner from './Spinner';

export default function ReserveJetski() {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);

  const [date, setDate] = useState(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedDates, setBookedDates] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [paymentOption, setPaymentOption] = useState('50');
  const [quantity, setQuantity] = useState(1);

  const pricePerJetski = 180;
  const total = pricePerJetski * quantity;
  const amountToPay = paymentOption === '50' ? total / 2 : total;

  useEffect(() => {
    const fetchBookedDates = async () => {
      const q = query(collection(db, 'reservas'), where('type', '==', 'jetski'));
      const querySnapshot = await getDocs(q);
      const dates = querySnapshot.docs.map(doc => doc.data().date);
      const parsedDates = dates.map(d => new Date(d));
      setBookedDates(parsedDates);
    };
    fetchBookedDates();
  }, []);

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
    if (!user || !date) return;
    setLoading(true);
    setError('');

    try {
      if (isDateBooked(date)) {
        setError('Esa fecha ya está reservada. Por favor elige otra.');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'reservas'), {
        fullName: user.displayName || '',
        email: user.email || '',
        phone: '',
        date: date.toISOString().split('T')[0],
        message,
        quantity,
        total,
        type: 'jetski',
        createdAt: Timestamp.now(),
      });

      await emailjs.send(
        'service_jyq18ck',
        'template_reservajetski',
        {
          nombre: user.displayName || 'Usuario',
          email: user.email,
          fecha: date.toLocaleDateString(),
          cantidad: quantity,
          total: `$${total}`,
          mensaje: message || 'Sin mensaje',
        },
        '9i4-IRiwb_vzgR2Ef'
      );

      setSubmitted(true);
      setConfirming(false);
    } catch (error) {
      console.error('❌ Error al guardar la reserva:', error);
      setError('Hubo un problema al guardar la reserva. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const showConfirmation = () => {
    if (!user || !date) {
      setError('Faltan datos para confirmar la reserva.');
      return;
    }
    setConfirming(true);
  };

  return (
    <section className="bg-white py-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
          Reserva tu Jetski
        </h1>
        <div className="rounded-xl overflow-hidden shadow mb-8">
          <img src="/images/jetski3.jpg" alt="Yacht" className="w-full h-100 object-cover" />
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        ) : submitted ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-md text-center">
            ¡Gracias por tu reserva! Nos pondremos en contacto contigo pronto.
          </div>
        ) : confirming ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Confirma tu reserva</h2>
            <ul className="space-y-2">
              <li><strong>Nombre:</strong> {user.displayName || 'Usuario'}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Fecha:</strong> {date?.toLocaleDateString()}</li>
              <li><strong>Cantidad:</strong> {quantity}</li>
              <li><strong>Total:</strong> ${total}</li>
              {message && <li><strong>Mensaje:</strong> {message}</li>}
            </ul>
            <div className="mt-6 flex gap-4">
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
                Confirmar reserva
              </button>
              <button onClick={() => setConfirming(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg shadow mb-10">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              minDate={new Date()}
              placeholderText="Selecciona una fecha"
              dateFormat="yyyy-MM-dd"
              className="w-full border p-2 rounded-md mb-4"
              excludeDates={bookedDates}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de jetskis</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full border p-2 rounded-md mb-4"
              min={1}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje adicional</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
              className="w-full border p-2 rounded-md mb-4"
              placeholder="Escribe algún comentario adicional..."
            />

            {error && <p className="mt-2 text-red-600 font-semibold">{error}</p>}

            <div className="mt-4 text-lg font-bold">Total: ${total}</div>

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
