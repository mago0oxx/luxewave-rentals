import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data().role === "admin") {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    };

    checkRole();
  }, [user]);

  if (loading) return <div className="p-4">Cargando panel de administrador...</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return children;
}
