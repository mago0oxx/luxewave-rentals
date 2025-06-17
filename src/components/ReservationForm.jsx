import React from 'react';


export default function ReservationForm() {
  return (
    <section id="contact" className="bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Reserva tu Aventura Acuática
        </h2>
        <p className="text-gray-600 mb-10">
          Completa el formulario y nos pondremos en contacto contigo lo antes posible.
        </p>

        <form className="space-y-6 text-left">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nombre completo</label>
            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Fecha de reserva</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Mensaje</label>
            <textarea
              placeholder="¿Tienes alguna preferencia?"
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Enviar Reserva
          </button>
        </form>
      </div>
    </section>
  );
}
