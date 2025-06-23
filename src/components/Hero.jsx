import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row h-[80vh]">
      <div
        className="flex-1 bg-cover bg-center relative group cursor-pointer"
        style={{ backgroundImage: "url('/images/yate.jpg')" }}
        onClick={() => navigate('/reserve-yacht')}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
          Rentar Yate
        </div>
      </div>

      <div
        className="flex-1 bg-cover bg-center relative group cursor-pointer"
        style={{ backgroundImage: "url('/images/jetski.jpg')" }}
        onClick={() => navigate('/reserve-jetski')}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
          Rentar Jetski
        </div>
      </div>
    </div>
  );
}
