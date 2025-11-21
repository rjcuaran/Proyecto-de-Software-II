import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";

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
      {/* ENCABEZADO */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">🍽 Mis Recetas</h2>
        <Button variant="success" onClick={() => navigate("/recetas/nueva")}>
          ➕ Nueva receta
        </Button>
      </div>

      {/* SIN RECETAS */}
      {recetas.length === 0 ? (
        <Alert variant="info">Aún no has creado recetas.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
          {recetas.map((receta) => (
            <Col key={receta.id_receta}>
              <Card
                className="border-0 shadow-sm rounded-4 overflow-hidden receta-card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/recetas/${receta.id_receta}`)}
              >
                {/* IMAGEN (si existe) */}
                {receta.imagen ? (
                  <div className="receta-img-wrapper">
                    <Card.Img
                      variant="top"
src={`http://localhost:5000/uploads/recetas/${receta.imagen}`}
                      className="receta-img"
                    />
                  </div>
                ) : (
                  <div
                    className="bg-light d-flex justify-content-center align-items-center"
                    style={{ height: "180px" }}
                  >
                    <span className="text-muted">📷 Sin imagen</span>
                  </div>
                )}

                <Card.Body>
                  <Card.Title className="fw-bold text-primary fs-5">
                    {receta.nombre}
                  </Card.Title>

                  <Badge bg="info" className="mb-2">
                    {receta.categoria}
                  </Badge>

                  <Card.Text className="text-muted small">
                    {receta.descripcion?.substring(0, 80) || "Sin descripción"}...
                  </Card.Text>

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/recetas/${receta.id_receta}`);
                      }}
                    >
                      👁 Ver
                    </Button>

                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/recetas/${receta.id_receta}/editar`);
                      }}
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

/* ESTILO EXTRA PREMIUM */
const styles = `
.receta-img-wrapper { 
  height: 180px; 
  overflow: hidden; 
}

.receta-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform .4s ease;
}

.receta-card:hover .receta-img {
  transform: scale(1.07);
}

.receta-card:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.15)!important;
}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
