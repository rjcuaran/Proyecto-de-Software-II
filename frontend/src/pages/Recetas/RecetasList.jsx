import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecetasList = () => {
  const [recetas, setRecetas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/recetas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecetas(response.data);
      } catch (error) {
        console.error("Error al cargar recetas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, []);

  const toggleSeleccion = (idReceta) => {
    setSeleccionadas((prev) =>
      prev.includes(idReceta)
        ? prev.filter((id) => id !== idReceta)
        : [...prev, idReceta]
    );
  };

  const handleGenerarLista = () => {
    if (seleccionadas.length === 0) {
      alert("Selecciona al menos una receta para generar la lista de compras.");
      return;
    }

    navigate("/shopping-list", { state: { recetas: seleccionadas } });
  };

  if (loading) return <p className="text-center mt-4">Cargando recetas...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📖 Mis Recetas</h2>

      {recetas.length === 0 ? (
        <p>No hay recetas disponibles.</p>
      ) : (
        <div className="row">
          {recetas.map((receta) => (
            <div className="col-md-4 mb-3" key={receta.idReceta}>
              <div className="card shadow-sm h-100">
                <img
                  src={receta.imagen || "/default.jpg"}
                  alt={receta.titulo}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{receta.titulo}</h5>
                    <p className="card-text text-muted">
                      {receta.descripcion?.substring(0, 70)}...
                    </p>
                  </div>

                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      id={`receta-${receta.idReceta}`}
                      className="form-check-input"
                      checked={seleccionadas.includes(receta.idReceta)}
                      onChange={() => toggleSeleccion(receta.idReceta)}
                    />
                    <label
                      htmlFor={`receta-${receta.idReceta}`}
                      className="form-check-label"
                    >
                      Seleccionar
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-4">
        <button
          className="btn btn-success"
          onClick={handleGenerarLista}
          disabled={seleccionadas.length === 0}
        >
          🛒 Generar Lista de Compras ({seleccionadas.length})
        </button>
      </div>
    </div>
  );
};

export default RecetasList;
