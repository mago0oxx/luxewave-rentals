

import React from 'react';

export default function Spinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 relative animate-spin mb-4">
        <div className="absolute inset-0 rounded-full border-[6px] border-white border-t-red-600 border-b-red-600"></div>
        <div className="absolute inset-2 rounded-full border-[6px] border-white"></div>
        <div className="absolute top-[6px] left-[6px] w-4 h-4 bg-white rounded-full shadow-inner"></div>
      </div>
      <p className="text-white text-lg font-semibold animate-pulse">Procesando tu reserva...</p>
    </div>
  );
}
