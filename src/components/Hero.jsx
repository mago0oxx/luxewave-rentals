import { useNavigate } from 'react-router-dom';

const heroCards = [
  {
    title: 'Rentar Yate',
    image: "/images/yate.jpg",
    href: '/reserve-yacht',
    tagline: 'Lujo en el mar',
    description:
      'Celebra a bordo de nuestros yates con capitán y amenidades premium para descubrir la bahía de Miami.',
  },
  {
    title: 'Rentar Jetski',
    image: "/images/jetski.jpg",
    href: '/reserve-jetski',
    tagline: 'Adrenalina tropical',
    description:
      'Siente la velocidad con jetskis de última generación y el skyline de South Beach como telón de fondo.',
  },
  {
    title: 'Rentar Limusina',
    image: "/images/limousine.png",
    href: '/reserve-limo',
    tagline: 'Lujo en tierra',
    description:
      'Recorre la ciudad con estilo, chofer profesional y confort absoluto para tus eventos exclusivos.',
  },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-b from-white via-blue-50 to-white pt-28 pb-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 sm:px-6 md:px-10">
        <div className="space-y-4 text-center md:text-left" data-aos="fade-up">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-500 md:text-sm">
            Miami lifestyle
          </span>
          <h1 className="leading-tight">
            Eleva tus escapadas con LuxeWave Rentals
          </h1>
          <p className="mx-auto max-w-2xl text-base text-gray-600 md:mx-0 md:text-lg">
            Vive la vibra de Miami con experiencias de lujo sobre el mar y la ciudad. Disfruta paquetes
            flexibles y atención personalizada para cada ocasión especial.
          </p>
        </div>

        <div
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          {heroCards.map((card) => (
            <article
              key={card.title}
              onClick={() => navigate(card.href)}
              className="group relative flex min-h-[220px] cursor-pointer overflow-hidden rounded-3xl shadow-xl transition-transform duration-500 hover:-translate-y-2 sm:min-h-[260px] md:min-h-[320px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${card.image}')` }}
              />
              <div
                className="absolute inset-0 transition duration-500"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.75) 15%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.78) 100%)',
                }}
              />
              <div
                className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,196,253,0.65) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.75) 100%)',
                }}
              />
              <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-6 text-white sm:p-8">
                <span className="text-[0.7rem] uppercase tracking-[0.35em] text-white text-opacity-80">
                  {card.tagline}
                </span>
                <h2
                  className="text-3xl font-accent tracking-wide sm:text-4xl"
                  style={{ textShadow: '0 10px 25px rgba(0, 0, 0, 0.45)' }}
                >
                  {card.title}
                </h2>
                <p className="text-sm text-white text-opacity-80">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
