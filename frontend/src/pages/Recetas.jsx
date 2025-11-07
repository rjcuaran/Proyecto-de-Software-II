// src/pages/Recetas.jsx
import React, { useEffect, useState } from "react";
import { obtenerRecetas } from "../services/recetaService";
import { useNavigate } from "react-router-dom";

const Recetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarRecetas = async () => {
      try {
        const data = await obtenerRecetas();
        setRecetas(data);
      } catch (error) {
        console.error("Error al cargar recetas:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarRecetas();
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
      alert("Selecciona al menos una receta.");
      return;
    }

    // Pasamos las recetas seleccionadas al componente ShoppingList
    navigate("/shopping-list", { state: { recetas: seleccionadas } });
  };

  if (loading) return <p>Cargando recetas...</p>;

  return (
    <div className="container mt-4">
      <h2>📖 Recetario</h2>

      <div className="row">
        {recetas.map((receta) => (
          <div className="col-md-4 mb-3" key={receta.idReceta}>
            <div className="card shadow-sm p-2">
              <img
                src={receta.imagen || "/default.jpg"}
                alt={receta.titulo}
                className="card-img-top rounded"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5>{receta.titulo}</h5>
                <p className="text-muted">
                  {receta.descripcion?.substring(0, 70)}...
                </p>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`receta-${receta.idReceta}`}
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

      <button
        className="btn btn-success mt-3"
        onClick={handleGenerarLista}
        disabled={seleccionadas.length === 0}
      >
        🛒 Generar Lista de Compras ({seleccionadas.length})
      </button>
    </div>
  );
};

export default Recetas;
