import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function Profile() {
  console.log("🚀 Profile component mounted");

  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          await setDoc(ref, {
            displayName: user.displayName || '',
            phone: '',
            email: user.email || ''
          });
          setForm({ name: user.displayName || '', phone: '', email: user.email });
        } else {
          const data = snap.data();
          setForm({
            name: data.displayName || '',
            phone: data.phone || '',
            email: data.email || user.email
          });
        }
      } catch (error) {
        console.error("❌ Error cargando el perfil:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const ref = doc(db, 'users', user.uid);
      await updateDoc(ref, {
        displayName: form.name,
        phone: form.phone
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-xl w-full mx-auto mt-6 sm:mt-0">
      <h2 className="text-2xl font-bold mb-4 text-center">Perfil de Usuario</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre completo</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Teléfono</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full bg-gray-100 border px-3 py-2 rounded"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar cambios
        </button>
        {saved && <p className="text-green-600 text-sm text-center">Perfil actualizado ✔️</p>}
      </div>
    </div>
  );
}
