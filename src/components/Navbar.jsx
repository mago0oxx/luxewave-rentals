import React, { useEffect, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { Menu, X, UserCircle } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

const sections = ['hero', 'pricing', 'gallery', 'contact'];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userData } = useAuth();

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

    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src="/images/luxewave-logo.png"
            alt="LuxeWave Rentals"
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* MENU MOBILE */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* LINKS DESKTOP */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
          {location.pathname === '/' &&
            ['pricing', 'gallery', 'contact'].map((section) => (
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

        {/* BOTONES DERECHA DESKTOP */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />
          {user ? (
            <>
              {userData?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="border border-blue-600 text-blue-600 font-medium px-3 py-1 rounded hover:bg-blue-50 transition"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 transition"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle size={20} />
                )}
                Mi perfil
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

      {/* MENU MOBILE ABIERTO */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-3 shadow-md">
          {location.pathname === '/' && (
            <ul className="space-y-2">
              {['pricing', 'gallery', 'contact'].map((section) => (
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
          )}
          <LanguageSwitcher />
          {user ? (
            <div className="pt-2 space-y-2">
              {userData?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block text-blue-600 font-medium border border-blue-500 px-4 py-2 rounded text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle size={20} />
                )}
                Mi perfil
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
