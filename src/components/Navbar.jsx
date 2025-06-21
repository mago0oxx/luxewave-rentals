import React, { useEffect, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Menu, X } from 'lucide-react';

const sections = ['hero', 'pricing', 'gallery', 'contact'];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">LuxeWave</Link>

        {/* Botón móvil */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menú escritorio */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          {['pricing', 'gallery', 'contact'].map(section => (
            <li key={section}>
              <a
                href={`#${section}`}
                className={`relative hover:text-blue-600 transition ${activeSection === section
                    ? 'text-blue-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600'
                    : ''
                  }`}
              >
                {t(`navbar.${section}`)}
              </a>
            </li>
          ))}
        </ul>

        {/* Idioma + Sesión (escritorio) */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 font-medium">
                Hola, {user.displayName || user.email}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-3 shadow-md">
          <ul className="space-y-2">
            {['pricing', 'gallery', 'contact'].map(section => (
              <li key={section}>
                <a
                  href={`#${section}`}
                  className="block text-gray-700 font-medium hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(`navbar.${section}`)}
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
          {user ? (
            <div className="pt-2 space-y-2">
              <Link
                to="/dashboard"
                className="block text-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hola, {user.displayName || user.email}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
