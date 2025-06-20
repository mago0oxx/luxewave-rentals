import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ReservationForm() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          {t('reservation.title')}
        </h2>
        <p className="text-gray-600 mb-10">
          {t('reservation.description')}
        </p>

        <form className="space-y-6 text-left">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t('reservation.fullName')}
            </label>
            <input
              type="text"
              placeholder={t('reservation.namePlaceholder')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t('reservation.date')}
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              {t('reservation.message')}
            </label>
            <textarea
              placeholder={t('reservation.messagePlaceholder')}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {t('reservation.submit')}
          </button>
        </form>
      </div>
    </section>
  );
}
