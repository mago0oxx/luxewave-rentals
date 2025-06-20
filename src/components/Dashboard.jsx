import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '-';
    const date = timestamp.toDate();
    return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString();
  };

  if (!userData) return null;

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <div className="relative z-10 bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-xl p-8 w-full max-w-lg text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Tu Panel</h2>

        <div className="text-left space-y-4 text-gray-700">
          <p><strong>📧 Email:</strong> {userData.email}</p>
          <p><strong>🆔 UID:</strong> {userData.uid}</p>
          <p><strong>🕒 Fecha de registro:</strong> {formatDate(userData.createdAt)}</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-semibold"
        >
          🔓 Cerrar Sesión
        </button>
      </div>
    </section>
  );
}
