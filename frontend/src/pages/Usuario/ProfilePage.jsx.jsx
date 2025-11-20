import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    };
    loadProfile();
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="container mt-4">
      <h2>👤 Mi Perfil</h2>

      <ul className="list-group mt-3">
        <li className="list-group-item">
          <strong>Nombre:</strong> {user.nombre}
        </li>
        <li className="list-group-item">
          <strong>Email:</strong> {user.correo}
        </li>
        <li className="list-group-item">
          <strong>Registrado:</strong> {user.fecha_registro}
        </li>
      </ul>
    </div>
  );
}
