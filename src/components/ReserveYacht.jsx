// src/pages/ReserveYacht.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CTAButton from '../components/CTAButton';

export default function ReserveYacht() {
  const { t } = useTranslation();
  const [hours, setHours] = useState(4);
  const [addJetski, setAddJetski] = useState(false);
  const [addLimo, setAddLimo] = useState(false);

  const basePrices = { 4: 1000, 6: 1400, 8: 1700 };
  const extras = {
    jetski: 180,
    limo: 240,
  };

  const total = basePrices[hours] + (addJetski ? extras.jetski : 0) + (addLimo ? extras.limo : 0);

  return (
    <section className="bg-white py-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
          {t('yachtReservation.title')}
        </h1>

        <div className="rounded-xl overflow-hidden shadow mb-8">
          <img src="/images/yacht.jpg" alt="Yacht" className="w-full h-100 object-cover" />
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">{t('yachtReservation.duration')}</h2>
          <div className="flex gap-4 mb-6">
            {[4, 6, 8].map((h) => (
              <button
                key={h}
                onClick={() => setHours(h)}
                className={`px-6 py-2 rounded-lg border font-medium transition ${hours === h ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50'
                  }`}
              >
                {h}h - ${basePrices[h]}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">{t('yachtReservation.addons')}</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={addJetski} onChange={() => setAddJetski(!addJetski)} />
              {t('yachtReservation.extraJetski')} (+${extras.jetski})
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={addLimo} onChange={() => setAddLimo(!addLimo)} />
              {t('yachtReservation.limoService')} (+${extras.limo})
            </label>
          </div>

          <div className="mt-8 text-xlg font-bold">
            {t('yachtReservation.total')}: ${total}
          </div>
        </div>

        <form className="bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">{t('yachtReservation.formTitle')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder={t('form.fullName')} className="border p-3 rounded-md w-full" required />
            <input type="email" placeholder={t('form.email')} className="border p-3 rounded-md w-full" required />
            <input type="tel" placeholder={t('form.phone')} className="border p-3 rounded-md w-full" required />
            <input type="date" className="border p-3 rounded-md w-full" required />
          </div>

          <textarea
            rows="4"
            placeholder={t('form.message')}
            className="w-full border p-3 rounded-md mb-4"
          ></textarea>

          <CTAButton href="#" textKey="button.bookNow" />
        </form>
      </div>
    </section>
  );
}
