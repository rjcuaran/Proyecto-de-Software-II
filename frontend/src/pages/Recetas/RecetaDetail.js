// frontend/src/pages/Recetas/RecetaDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Spinner, Alert, ListGroup, Badge } from "react-bootstrap";

export default function RecetaDetail() {
  const { id } = useParams(); // ID de la receta desde la URL
  const navigate = useNavigate();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceta = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/recetas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReceta(res.data.receta);
      } catch (err) {
        console.error("❌ Error al obtener la receta:", err);
        setError("No se pudo cargar la receta.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceta();
  }, [id]);

  // 🌀 Estado de carga
  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Cargando receta...</p>
      </div>
    );

  // ⚠️ Error
  if (error) return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;

  // 🚫 Sin datos
  if (!receta) return <Alert variant="warning" className="mt-4 text-center">Receta no encontrada.</Alert>;

  return (
    <div className="container mt-5 mb-5">
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold text-primary mb-0">{receta.nombre}</h2>
            <Badge bg="info" className="fs-6">{receta.categoria}</Badge>
          </div>

          <p className="text-muted fst-italic mb-4">{receta.descripcion}</p>

          <hr />

          {/* 🧂 Ingredientes */}
          <h4 className="text-secondary mt-4 mb-3">🧂 Ingredientes</h4>
          {receta.ingredientes && receta.ingredientes.length > 0 ? (
            <ListGroup variant="flush" className="mb-4">
              {receta.ingredientes.map((ing) => (
                <ListGroup.Item
                  key={ing.id_ingrediente}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>
                    <strong>{ing.nombre}</strong>
                  </span>
                  <span className="text-muted">
                    {ing.cantidad} {ing.unidad_medida}
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted mb-4">Esta receta no tiene ingredientes registrados.</p>
          )}

          <hr />

          {/* 👩‍🍳 Preparación */}
          <h4 className="text-secondary mt-4 mb-3">👩‍🍳 Preparación</h4>
          <p className="text-dark" style={{ whiteSpace: "pre-line" }}>
            {receta.preparacion}
          </p>

          {/* 🔘 Botones de acción */}
          <div className="mt-5 d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              ← Volver
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/recetas/${id}/editar`)}
            >
              ✏️ Editar receta
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
