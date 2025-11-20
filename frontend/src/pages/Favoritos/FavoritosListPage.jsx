import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FavoritosListPage() {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const fetchFavs = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritos(res.data.favoritos || []);
    };
    fetchFavs();
  }, []);

  return (
    <div className="container mt-4">
      <h2>⭐ Mis Favoritos</h2>
      <ul className="list-group mt-3">
        {favoritos.map((f) => (
          <li className="list-group-item" key={f.id_receta}>
            {f.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
