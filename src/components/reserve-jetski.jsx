import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import emailjs from 'emailjs-com';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function ReserveJetski() {
  const [user] = useAuthState(auth);
  const [jetskiCount, setJetskiCount] = useState(1);
  const [hours, setHours] = useState(1);
  const [date, setDate] = useState(null);
  const [message, setMessage] = useState('');
  const [paymentOption, setPaymentOption] = useState('50');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const priceByHours = { 1: 150, 2: 250, 3: 350 };
  const total = priceByHours[hours] * jetskiCount;
  const amountToPay = paymentOption === '50' ? total / 2 : total;

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://us-central1-luxewave-rentals.cloudfunctions.net/createStripeCheckout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountToPay,
          name: `Jetski x${jetskiCount} - ${hours}h`,
          total,
          email: user?.email || '',
          date: date.toISOString().split('T')[0],
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Error al iniciar el pago.');
      }
    } catch (err) {
      console.error(err);
      setError('Error con Stripe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Reserva tu Jetski</h1>
        {/* Galería de imágenes */}
        <div className="rounded-xl overflow-hidden shadow mb-8">
          <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            showStatus={false}
            dynamicHeight={false}
          >
            <div>
              <img src="/images/jetski1.jpg" alt="Jetski 1" />
            </div>
            <div>
              <img src="/images/jetski4.jpg" alt="Jetski 2" />
            </div>
            <div>
              <img src="/images/jetski5.jpg" alt="Jetski 3" />
            </div>
          </Carousel>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow mb-10">
          <label className="block mb-2 font-semibold">Cantidad de jetskis</label>
          <input
            type="number"
            min={1}
            value={jetskiCount}
            onChange={(e) => setJetskiCount(parseInt(e.target.value))}
            className="w-full border p-2 rounded mb-4"
          />

          <label className="block mb-2 font-semibold">Duración</label>
          <select
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            className="w-full border p-2 rounded mb-4"
          >
            <option value={1}>1 hora - $150</option>
            <option value={2}>2 horas - $250</option>
            <option value={3}>3 horas - $350</option>
          </select>

          <label className="block mb-2 font-semibold">Fecha</label>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            minDate={new Date()}
            className="w-full border p-2 rounded mb-4"
          />

          <label className="block mb-2 font-semibold">Mensaje adicional</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
            className="w-full border p-2 rounded mb-4"
          />

          <label className="block mb-2 font-semibold">Pago anticipado</label>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="50">Pagar 50% (${total / 2})</option>
            <option value="100">Pagar 100% (${total})</option>
          </select>

          <div className="font-bold text-lg">Total: ${total}</div>
          <div className="text-sm text-gray-700 mb-4">Monto a pagar ahora: ${amountToPay}</div>

          <button
            onClick={handlePayment}
            disabled={!user || !date}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold"
          >
            {loading ? 'Procesando...' : 'Pagar con Stripe'}
          </button>

          {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}
        </div>
      </div>
    </section>
  );
}
