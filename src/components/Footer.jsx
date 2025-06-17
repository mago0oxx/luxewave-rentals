import React from 'react';
import {
  FaInstagram, FaFacebookF, FaWhatsapp, FaTiktok,
  FaYoutube
} from 'react-icons/fa';

export default function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-white py-10 mt-16 relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">

          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-2">LuxeWave</h3>
            <p className="text-gray-400">Jet Ski Rentals en Miami Beach</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Enlaces</h4>
            <ul className="space-y-1">
              <li><a href="#pricing" className="hover:text-yellow-400">Tarifas</a></li>
              <li><a href="#gallery" className="hover:text-yellow-400">Galería</a></li>
              <li><a href="#contact" className="hover:text-yellow-400">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Contacto</h4>
            <p>📞 +1 (786) 510-8358</p>
            <p>📍 Miami Beach, FL</p>
            <p>📧 luxewaverentals@gmail.com</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Síguenos</h4>
            <div className="flex space-x-4 text-xl text-yellow-400">
              <a href="https://www.instagram.com/luxewave_rentals?igsh=dnAwODljNTMwZnJ6&utm_source=qr" target="_blank"><FaInstagram /></a>
              <a href="https://facebook.com" target="_blank"><FaFacebookF /></a>
              <a href="https://tiktok.com" target="_blank"><FaTiktok /></a>
              <a href="https://youtube.com" target="_blank"><FaYoutube /></a>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-xs mt-10">
          © {new Date().getFullYear()} LuxeWave Rentals. Todos los derechos reservados.
        </div>
      </footer>

      {/* Botón flotante WhatsApp */}
      <a
        href="https://wa.me/7865108358"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 animate-pulse-slow transition"
      >
        <FaWhatsapp size={24} />
      </a>
    </>
  );
}
