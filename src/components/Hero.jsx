import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleReservationClick = () => {
    if (!user) {
      setShowPopup(true);
    } else {
      navigate('/reserve-yacht');
    }
  };

  return (
    <section
      id="hero"
      className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-center"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }} // Asegúrate que el path sea correcto
    >
      <div className="bg-black bg-opacity-50 absolute inset-0"></div>

      <div className="relative z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          ¡Vive la experiencia en Miami Beach!
        </h1>
        <button
          onClick={handleReservationClick}
          className="px-6 py-3 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition font-semibold text-lg"
        >
          Reservar Ahora
        </button>
      </div>

      {/* Popup de login */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <p className="text-lg font-semibold mb-4">
              Debes iniciar sesión para hacer una reserva
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
