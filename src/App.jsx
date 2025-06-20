import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Gallery from './components/Gallery';
import ReservationForm from './components/ReservationForm';
import Footer from './components/Footer';
import ReserveYacht from './components/ReserveYacht';
import Login from './components/Login';
import Register from './components/Register';
import { GuestRoute } from './components/GuestRoute';
import DashboardLayout from './components/Dashboard/DashboardLayout';

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="w-full font-sans">
      <Navbar />

      <Routes>
        {/* Página principal (Landing) */}
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

        {/* Otras páginas */}
        <Route path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
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

        <Route path="/reserve-yacht" element={<ReserveYacht />} />
      </Routes>

      <Footer />
    </div>
  );
}
