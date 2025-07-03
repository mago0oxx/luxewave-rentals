import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Pricing() {
  const { t } = useTranslation();

  return (
    <section id="pricing" className="w-full bg-white scroll-mt-20 py-20 px-4">
      <div className="max-w-5xl mx-auto text-center" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          {t('pricing.title')}
        </h2>
        <div data-aos="zoom-in" data-aos-delay="200">
          <table className="w-full border-collapse rounded-xl shadow-md overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">{t('pricing.headers.model')}</th>
                <th className="py-3 px-4 text-left">{t('pricing.headers.time')}</th>
                <th className="py-3 px-4 text-left">{t('pricing.headers.price')}</th>
                <th className="py-3 px-4 text-left">{t('pricing.headers.people')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Sea Ray yate 40 ft</td>
                <td className="py-3 px-4">1hr</td>
                <td className="py-3 px-4">{t('pricing.searayPrice')}</td>
                <td className="py-3 px-4">{t('pricing.searayPeople')}</td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-4">Limousine</td>
                <td className="py-3 px-4">1hr</td>
                <td className="py-3 px-4">{t('pricing.limoPrice')}</td>
                <td className="py-3 px-4">{t('pricing.limoPeople')}</td>
              </tr>

              <tr className="border-b">
                <td className="py-3 px-4">Yamaha VX Deluxe</td>
                <td className="py-3 px-4">1hr</td>
                <td className="py-3 px-4">{t('pricing.vxPrice')}</td>
                <td className="py-3 px-4">{t('pricing.vxPeople')}</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Yamaha FX Cruiser</td>
                <td className="py-3 px-4">1hr</td>
                <td className="py-3 px-4">{t('pricing.fxPrice')}</td>
                <td className="py-3 px-4">{t('pricing.fxPeople')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
