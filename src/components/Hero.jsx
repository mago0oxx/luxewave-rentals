import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-[80vh]">
      {/* Rentar Yate */}
      <div
        className="bg-cover bg-center relative group cursor-pointer"
        style={{ backgroundImage: "url('/images/yate.jpg')" }}
        onClick={() => navigate('/reserve-yacht')}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
          Rentar Yate
        </div>
      </div>

      {/* Rentar Jetski */}
      <div
        className="bg-cover bg-center relative group cursor-pointer"
        style={{ backgroundImage: "url('/images/jetski.jpg')" }}
        onClick={() => navigate('/reserve-jetski')}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
          Rentar Jetski
        </div>
      </div>

      {/* Rentar Limusina */}
      <div
        className="bg-cover bg-center relative group cursor-pointer"
        style={{ backgroundImage: "url('/images/limousine.png')" }}
        onClick={() => navigate('/reserve-limo')}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
          Rentar Limusina
        </div>
      </div>
    </div>
  );
}
