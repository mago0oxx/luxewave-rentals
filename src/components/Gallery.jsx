import React from 'react';

const images = [
  '/images/jetski1.jpg',
  '/images/jetski2.jpg',
  '/images/jetski3.jpg',
  '/images/jetski4.jpg',
  '/images/jetski5.jpg',
  '/images/jetski6.jpg',
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Nuestra Galería
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div key={index} className="overflow-hidden rounded-xl shadow hover:shadow-lg transition-all duration-300">
              <img
                src={src}
                alt={`jetski-${index}`}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
