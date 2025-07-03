import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const images = [
  { src: '/images/yacht.jpg', alt: 'Yacht', link: '/reserve-yacht' },
  { src: '/images/jetski5.jpg', alt: 'Jetski 5', link: '/reserve-jetski' },
  { src: '/images/limousine.png', alt: 'limosine', link: '/reserve-limo' },
  { src: '/images/jetski6.jpg', alt: 'Jetski 2' },
  { src: '/images/jetski3.jpg', alt: 'Jetski 3' },
  { src: '/images/jetski4.jpg', alt: 'Jetski 4' },

  // esta lleva al formulario del yate
];

export default function Gallery() {
  const { t } = useTranslation();

  return (
    <section id="gallery" className="bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          {t('gallery.title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image, index) => {
            const content = (
              <img
                src={image.src}
                alt={t('gallery.imageAlt', { number: index + 1 })}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            );

            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl shadow hover:shadow-lg transition-all duration-300"
              >
                {image.link ? <Link to={image.link}>{content}</Link> : content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
