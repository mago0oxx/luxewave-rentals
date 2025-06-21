import React, { useState } from 'react';
import { FiUser, FiClipboard, FiSettings, FiMenu, FiX } from 'react-icons/fi';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa (solo visible en móvil) */}
      <div className="sm:hidden p-5 bg-white shadow-md fixed top-30 left-0 right-0 z-50 flex items-center justify-between">
        <span className="font-bold text-lg">Menú</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 text-2xl"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar drawer */}
      <div
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0 transform transition-transform duration-300 fixed sm:static top-0 left-0 h-full bg-white w-64 z-40 shadow-md sm:shadow-none sm:block pt-16 sm:pt-0`}
      >
        <div className="m-10 p-5  space-y-2">
          <button
            onClick={() => handleTabClick('profile')}
            className={`w-full flex items-center gap-2 px-4  py-2 rounded ${activeTab === 'profile'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-blue-100 text-gray-700'
              }`}
          >
            <FiUser />
            Perfil
          </button>

          <button
            onClick={() => handleTabClick('reservations')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'reservations'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-blue-100 text-gray-700'
              }`}
          >
            <FiClipboard />
            Reservas
          </button>

          <button
            onClick={() => handleTabClick('settings')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'settings'
              ? 'bg-blue-600 text-white'
              : 'hover:bg-blue-100 text-gray-700'
              }`}
          >
            <FiSettings />
            Configuración
          </button>
        </div>
      </div>
    </>
  );
}
