
import React from 'react';



export default function Pricing() {
  return (
    <section id="pricing" className="w-full bg-white scroll-mt-20 py-20 px-4">
      <div className="max-w-5xl mx-auto text-center" data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Tarifas y Modelos Disponibles
        </h2>
        <div data-aos="zoom-in" data-aos-delay="200">
          <table className="w-full border-collapse rounded-xl shadow-md overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Modelo</th>
                <th className="py-3 px-4 text-left">Tiempo</th>
                <th className="py-3 px-4 text-left">Precio</th>
                <th className="py-3 px-4 text-left">Personas</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Yamaha VX Deluxe</td>
                <td className="py-3 px-4">1hr</td>
                <td className="py-3 px-4">$120</td>
                <td className="py-3 px-4">Hasta 2</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Yamaha FX Cruiser</td>
                <td className="py-3 px-4">1hr</td>
                <td className="py-3 px-4">$140</td>
                <td className="py-3 px-4">Hasta 3</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  );
}
