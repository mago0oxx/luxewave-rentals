// pages/CancelPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CancelPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          ❌ {t('Pago cancelado')}
        </h1>
        <p className="text-gray-700">{t('Tu reserva no fue procesada. Puedes intentarlo nuevamente cuando gustes.')}</p>
      </div>
    </div>
  );
}
