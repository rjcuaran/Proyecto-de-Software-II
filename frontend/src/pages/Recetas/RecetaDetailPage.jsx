// frontend/src/pages/Recetas/RecetaDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Spinner, Badge, Button, Row, Col } from "react-bootstrap";

export default function RecetaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceta = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/recetas/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setReceta(res.data);
      } catch (err) {
        console.error("❌ Error cargando receta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceta();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando receta...</p>
      </div>
    );

  if (!receta) return <p className="text-center">No se encontró la receta.</p>;

  return (
    <div className="container mt-4 receta-detail-page">

      {/* FOTO DE PORTADA */}
      <div className="receta-hero shadow-lg rounded-4 overflow-hidden mb-4">
        {receta.imagen ? (
          <img
            src={`http://localhost:5000/uploads/${receta.imagen}`}
            className="hero-img"
            alt={receta.nombre}
          />
        ) : (
          <div className="hero-img hero-placeholder">
            📷 Sin imagen disponible
          </div>
        )}

        <div className="hero-overlay">
          <h1 className="hero-title">{receta.nombre}</h1>
          <Badge bg="info" className="fs-6 px-3 py-2">
            {receta.categoria}
          </Badge>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="outline-primary"
          className="me-2"
          onClick={() => navigate(`/recetas/${id}/editar`)}
        >
          ✏️ Editar
        </Button>

        <Button variant="warning">⭐ Favorito</Button>
      </div>

      {/* DESCRIPCIÓN */}
      <Card className="shadow-sm border-0 mt-3">
        <Card.Body>
          <h3 className="section-title">Descripción</h3>
          <p className="text-muted fs-5">{receta.descripcion}</p>
        </Card.Body>
      </Card>

      {/* INGREDIENTES */}
      <Card className="shadow-sm border-0 mt-4">
        <Card.Body>
          <h3 className="section-title">🧂 Ingredientes</h3>

          <Row className="mt-3">
            {receta.ingredientes.map((ing) => (
              <Col md={6} lg={4} key={ing.id_ingrediente}>
                <Card className="border-0 shadow-sm ingrediente-card mb-3">
                  <Card.Body className="py-3">
                    <span className="ingrediente-nombre">{ing.nombre}</span>
                    <br />
                    <small className="text-muted">
                      {ing.cantidad} {ing.unidad_medida}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* PREPARACIÓN */}
      <Card className="shadow-sm border-0 mt-4 mb-5">
        <Card.Body>
          <h3 className="section-title">👨‍🍳 Preparación</h3>
          <p className="mt-2 fs-5" style={{ whiteSpace: "pre-line" }}>
            {receta.preparacion}
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}

/* ESTILO PREMIUM */
const styles = `
.receta-hero {
  position: relative;
  height: 380px;
}
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-placeholder {
  background: #eee;
  font-size: 1.6rem;
  color: #6c757d;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hero-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
}
.hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 5px 18px rgba(0,0,0,0.5);
  margin-bottom: 0.4rem;
}
.section-title {
  font-weight: 700;
  color: #34495e;
}
.ingrediente-card {
  transition: transform .2s ease;
}
.ingrediente-card:hover {
  transform: scale(1.02);
}
.ingrediente-nombre {
  font-size: 1.1rem;
  font-weight: 600;
}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
