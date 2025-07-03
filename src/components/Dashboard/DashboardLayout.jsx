import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Profile from './Profile';
import Reservations from './Reservations';
import Settings from './Settings';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    console.log('📦 DashboardLayout montado correctamente');
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'reservations':
        return <Reservations />;
      case 'settings':
        return <Settings />;
      default:
        return <Profile />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col sm:flex-row bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.85)), url("/images/dashboard-bg.jpg")',
      }}
    >
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 w-full flex justify-center m-20 items-start px-6 sm:px-8 pt-6 pb-10">

        {renderContent()}

      </main>
    </div>
  );
}
