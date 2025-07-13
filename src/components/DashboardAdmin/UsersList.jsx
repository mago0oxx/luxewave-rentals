import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function UsersList() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(lista);
    };

    fetchUsuarios();
  }, []);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Usuarios Registrados</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border">Nombre / Email</th>
            <th className="p-3 border">Rol</th>
            <th className="p-3 border">Registrado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id} className="text-center border-b">
              <td className="p-2 border">
                {user.nombre || user.email || "N/A"}
              </td>
              <td className="p-2 border">{user.role || "usuario"}</td>
              <td className="p-2 border">
                {user.createdAt
                  ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
