import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import Spinner from './Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function ReserveLimo() {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);

  const [date, setDate] = useState(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentOption, setPaymentOption] = useState('50');
  const [hours, setHours] = useState(2);
  const [bookedDates, setBookedDates] = useState([]);

  const hourlyRate = 120;
  const total = hourlyRate * hours;
  const amountToPay = paymentOption === '50' ? total / 2 : total;

  useEffect(() => {
    const fetchBookedDates = async () => {
      const q = query(collection(db, 'reservas-limo'));
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

  const handlePayment = async () => {
    if (!date) {
      setError("Debes seleccionar una fecha antes de pagar.");
      return;
    }

    setLoading(true);
    setError("");

    const amount = parseFloat(amountToPay);
    if (isNaN(amount) || amount <= 0) {
      setError("El monto a pagar no es válido.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://us-central1-luxewave-rentals.cloudfunctions.net/createStripeCheckout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          name: 'Servicio de Limusina',
          total: total,
          email: user?.email || '',
          date: date.toISOString().split('T')[0],
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No se recibió la URL de Stripe:", data);
        setError("Error al iniciar el pago. Intenta de nuevo.");
        setLoading(false);
      }
    } catch (err) {
      console.error('Error creando sesión de Stripe:', err);
      setError('Error al iniciar el pago. Intenta de nuevo.');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !date) {
      setError("Debes seleccionar una fecha para confirmar la reserva.");
      return;
    }

    if (isDateBooked(date)) {
      setError("Esa fecha ya está reservada para esta limusina. Por favor elige otra.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'reservas-limo'), {
        fullName: user.displayName || '',
        email: user.email || '',
        phone: '',
        date: date.toISOString().split('T')[0],
        message,
        hours,
        total,
        createdAt: Timestamp.now(),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('❌ Error al guardar la reserva:', error);
      setError('Hubo un problema al guardar la reserva. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-20 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
          Reserva tu Limusina
        </h1>

        <div className="rounded-xl overflow-hidden shadow mb-8">
          <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            showStatus={false}
            dynamicHeight={false}
          >
            <div><img src="/images/limosina.jpg" alt="limosina1" /></div>
            <div><img src="/images/limosina1.jpg" alt="limo 1 " /></div>
            <div><img src="/images/limosina2.jpg" alt="limo 2" /></div>
            <div><img src="/images/limosina3.jpg" alt="limo 3" /></div>
            <div><img src="/images/limosina4.jpg" alt="limo 4" /></div>
            <div><img src="/images/limosina5.jpg" alt="limo 5" /></div>
            <div><img src="/images/limosina6.jpg" alt="limo 6" /></div>
          </Carousel>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        ) : submitted ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-md text-center">
            ¡Gracias por tu reserva! Nos pondremos en contacto contigo pronto.
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg shadow mb-10">

            <div className="mb-4 text-sm font-medium text-red-600 font-bold">
              Incluye: 1 bolsa de hielo, 1 champagne y 4 botellas de agua.

            </div>
            <div>
              <text className="  pb-6 block text-sm font-medium text-gray-700 mb-1">
                Importante: Capacidad maxima 10 personas!
              </text>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de horas</label>
              <input
                type="number"
                min={2}
                value={hours}
                onChange={(e) => setHours(Math.max(2, Number(e.target.value)))}
                className="w-full border p-2 rounded-md"
              />
              <p className="text-sm text-gray-600 mt-1">Precio por hora: $120</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                minDate={new Date()}
                excludeDates={bookedDates}
                placeholderText="Selecciona una fecha"
                dateFormat="yyyy-MM-dd"
                className={`w-full border p-2 rounded-md ${!date && error.includes('fecha') ? 'border-red-500' : ''}`}
              />
              {date && isDateBooked(date) && (
                <p className="text-red-600 mt-1 text-sm">Esa fecha ya está reservada para esta limusina.</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de origen y destino, hora de recogida</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="w-full border p-2 rounded-md"
                placeholder="Ej: Salida desde Hialeah a Port of Miami, recogida 9:00 AM"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-semibold">¿Deseas pagar ahora?</label>
              <select
                value={paymentOption}
                onChange={(e) => setPaymentOption(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="50">Pagar 50% (${total / 2})</option>
                <option value="100">Pagar 100% (${total})</option>
              </select>
              <p className="mt-2 text-sm text-gray-600">Monto a pagar: <strong>${amountToPay}</strong></p>
            </div>

            {error && <p className="mt-2 text-red-600 font-semibold">{error}</p>}

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={!date || isDateBooked(date)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
              >
                Confirmar sin pagar
              </button>
              <button
                onClick={handlePayment}
                disabled={!date || isDateBooked(date)}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition"
              >
                Pagar con Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
