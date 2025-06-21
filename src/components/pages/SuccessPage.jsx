// pages/SuccessPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SuccessPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ {t('¡Pago exitoso!')}
        </h1>
        <p className="text-gray-700">{t('Gracias por tu reserva. Te contactaremos pronto para confirmar los detalles.')}</p>
      </div>
    </div>
  );
}
