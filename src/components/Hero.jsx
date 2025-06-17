import React from 'react';

export default function Hero() {
  return (
    <section
      className="w-full h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      <div className="bg-black bg-opacity-50 p-8 rounded-xl text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          ¡Alquila tu Jet Ski en Miami Beach!
        </h1>
        <p className="text-white mb-6">
          Vive la emoción en el agua con <strong>LuxeWave Rentals</strong> 🛥️ 🌊
        </p>
        <a
          href="#contact"
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transition"
        >
          RESERVA YA
        </a>
      </div>
    </section>
  );
}
