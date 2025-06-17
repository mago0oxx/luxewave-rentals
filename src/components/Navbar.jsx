import React from 'react';
import { useEffect, useState } from 'react';

const sections = ['hero', 'pricing', 'gallery', 'contact'];


export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Para que arranque activo

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <nav className="bg-white shadow-md  px-6 py-4 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">LuxeWave</h1>
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li><a
            href="#pricing"
            className={`relative transition duration-300 ease-in-out
    hover:text-blue-600 after:transition-all after:duration-300
    ${activeSection === 'pricing'
                ? 'text-blue-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600'
                : ''
              }`}
          >
            Tarifas
          </a>

          </li>
          <li><a href="#gallery" className={`relative transition duration-300 ease-in-out
    hover:text-blue-600 after:transition-all after:duration-300
    ${activeSection === 'gallery'
              ? 'text-blue-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600'
              : ''
            } `}>Galería</a></li>
          <li><a href="#contact" className={`relative transition duration-300 ease-in-out
    hover:text-blue-600 after:transition-all after:duration-300
    ${activeSection === 'contact'
              ? 'text-blue-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600'
              : ''
            }`}>Contacto</a></li>
        </ul>
      </div>
    </nav>
  );
}
