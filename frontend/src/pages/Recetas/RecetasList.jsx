// frontend/src/pages/Recetas/RecetasList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Row, Col, Spinner, Alert } from "react-bootstrap";

export default function RecetasList() {
  const navigate = useNavigate();
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/recetas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecetas(res.data);
      } catch (err) {
        console.error("❌ Error al cargar recetas:", err);
        setError("No se pudieron cargar las recetas.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Cargando recetas...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📘 Mis Recetas</h2>
        <Button variant="success" onClick={() => navigate("/recetas/nueva")}>
          ➕ Nueva receta
        </Button>
      </div>

      {recetas.length === 0 ? (
        <Alert variant="info">Aún no tienes recetas creadas.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} className="g-4">
          {recetas.map((receta) => (
            <Col key={receta.id_receta}>
              <Card className="shadow-sm h-100 border-0">
                <Card.Body>
                  <Card.Title className="fw-semibold text-primary">
                    {receta.nombre}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {receta.categoria || "Sin categoría"}
                  </Card.Subtitle>
                  <Card.Text className="small text-truncate" style={{ maxHeight: "3rem" }}>
                    {receta.descripcion || "Sin descripción"}
                  </Card.Text>

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => navigate(`/recetas/${receta.id_receta}`)}
                    >
                      👁 Ver detalles
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/recetas/${receta.id_receta}/editar`)}
                    >
                      ✏️ Editar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
