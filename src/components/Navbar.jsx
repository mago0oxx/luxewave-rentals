import React, { useEffect, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const sections = ['hero', 'pricing', 'gallery', 'contact'];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [user, setUser] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Detecta el usuario logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Sección activa del scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (let section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">LuxeWave</Link>

        {/* Menú central */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <li>
            <a
              href="#pricing"
              className={`relative transition duration-300 ease-in-out hover:text-blue-600 after:transition-all after:duration-300
                ${activeSection === 'pricing'
                  ? 'text-blue-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600'
                  : ''}`}
            >
              {t('navbar.pricing')}
            </a>
          </li>
          <li>
            <a
              href="#gallery"
              className={`relative transition duration-300 ease-in-out hover:text-blue-600 after:transition-all after:duration-300
                ${activeSection === 'gallery'
                  ? 'text-blue-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600'
                  : ''}`}
            >
              {t('navbar.gallery')}
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={`relative transition duration-300 ease-in-out hover:text-blue-600 after:transition-all after:duration-300
                ${activeSection === 'contact'
                  ? 'text-blue-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600'
                  : ''}`}
            >
              {t('navbar.contact')}
            </a>
          </li>
        </ul>

        {/* Idioma + Login/Usuario */}
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />

          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-medium">
                Hola, {user.displayName || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
