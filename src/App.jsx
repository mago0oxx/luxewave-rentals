import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import ProtectedRoute from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import AdminRoute from './components/AdminRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Gallery from './components/Gallery';
import Login from './components/Login';
import Register from './components/Register';
import ReservationForm from './components/ReservationForm';
import ReserveJetski from './components/reserve-jetski';
import ReserveYacht from './components/ReserveYacht';
import ReserveLimo from './components/ReserveLimo';
import SuccessPage from './components/pages/SuccessPage';
import CancelPage from './components/pages/CancelPage';

import DashboardLayout from './components/Dashboard/DashboardLayout';

import AdminLayout from './components/DashboardAdmin/AdminLayout';
import MetricsPage from './components/DashboardAdmin/Metrics';
import ReservationsPage from './components/DashboardAdmin/ReservationsAdmin';
import UsersPage from './components/DashboardAdmin/UsersAdmin';
import ReportsPage from './components/DashboardAdmin/Reports.jsx';
import SettingsPage from './components/DashboardAdmin/Settings';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

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
        {/* Página principal */}
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

        {/* Auth */}
        <Route
          path="/login"
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
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />

        {/* Cliente */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/reserve" element={<ReservationForm />} />
        <Route path="/reserve-jetski" element={<ReserveJetski />} />
        <Route path="/reserve-yacht" element={<ReserveYacht />} />
        <Route path="/reserve-limo" element={<ReserveLimo />} />

        {/* Admin con rutas anidadas */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="metrics" element={<MetricsPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}
