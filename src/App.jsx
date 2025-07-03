import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import ProtectedRoute from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import SuccessPage from './components/pages/SuccessPage';
import CancelPage from './components/pages/CancelPage';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Gallery from './components/Gallery';
import ReservationForm from './components/ReservationForm';
import Footer from './components/Footer';
import ReserveYacht from './components/ReserveYacht';
import Login from './components/Login';
import Register from './components/Register';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import ReserveJetski from './components/reserve-jetski';
import ReserveLimo from './components/ReserveLimo';



export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // ✅ Redirección si ya hay un usuario autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const currentPath = window.location.pathname;
      if (user && (currentPath === '/login' || currentPath === '/register')) {
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="w-full font-sans">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Pricing />
              <Gallery />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route path="/reserve" element={<ReservationForm />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/reserve-jetski" element={<ReserveJetski />} />
        <Route path="/reserve-yacht" element={<ReserveYacht />} />
        <Route path="/reserve-limo" element={<ReserveLimo />} />
      </Routes>

      <Footer />
    </div>
  );
}
