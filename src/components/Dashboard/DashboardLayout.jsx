import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Profile from './Profile';
import Reservations from './Reservations';
import Settings from './Settings';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('profile');

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
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
}