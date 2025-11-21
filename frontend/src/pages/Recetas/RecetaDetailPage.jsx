// frontend/src/pages/Recetas/RecetaDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Spinner,
  Badge,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";

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

  if (!receta)
    return <p className="text-center">No se encontró la receta.</p>;

  return (
    <div className="receta-detail-wrapper">
      {/* HERO IMAGE */}
      <div className="receta-hero">
        {receta.imagen ? (
          <img
            src={`http://localhost:5000/uploads/${receta.imagen}`}
            alt={receta.nombre}
          />
        ) : (
          <div className="sin-imagen">📷 Sin imagen disponible</div>
        )}

        {/* Overlay */}
        <div className="hero-overlay">
          <h1 className="fw-bold">{receta.nombre}</h1>
          <Badge bg="info" className="categoria-badge">
            {receta.categoria}
          </Badge>
        </div>
      </div>

      <Container className="mt-4">

        {/* BOTONES SUPERIORES */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ← Volver
          </Button>

          <div>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => navigate(`/recetas/${id}/editar`)}
            >
              ✏️ Editar
            </Button>
            <Button variant="warning">⭐ Favorito</Button>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <Card className="shadow-sm border-0 mb-4 seccion-card">
          <Card.Body>
            <h3 className="fw-semibold seccion-titulo">📘 Descripción</h3>
            <p className="text-muted fs-5">{receta.descripcion}</p>
          </Card.Body>
        </Card>

        {/* INGREDIENTES */}
        <Card className="shadow-sm border-0 mb-4 seccion-card">
          <Card.Body>
            <h3 className="fw-semibold seccion-titulo">🧂 Ingredientes</h3>

            <Row className="mt-3">
              {receta.ingredientes.map((ing) => (
                <Col md={6} lg={4} key={ing.id_ingrediente}>
                  <Card className="ingredient-card shadow-sm border-0">
                    <Card.Body>
                      <strong className="fs-5">{ing.nombre}</strong>
                      <div className="text-muted">
                        {ing.cantidad} {ing.unidad_medida}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        {/* PREPARACIÓN */}
        <Card className="shadow-sm border-0 seccion-card mb-5">
          <Card.Body>
            <h3 className="fw-semibold seccion-titulo">
              👨‍🍳 Preparación
            </h3>
            <p
              className="fs-6 mt-2"
              style={{ whiteSpace: "pre-line" }}
            >
              {receta.preparacion}
            </p>
          </Card.Body>
        </Card>
      </Container>

      {/* ESTILOS PREMIUM */}
      <style>{`
        .receta-detail-wrapper {
          background: #f9fafc;
          min-height: 100vh;
        }

        .receta-hero {
          position: relative;
          width: 100%;
          height: 350px;
          overflow: hidden;
        }

        .receta-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.65);
        }

        .hero-overlay {
          position: absolute;
          bottom: 20px;
          left: 40px;
          color: white;
        }

        .categoria-badge {
          font-size: 1rem;
          margin-top: 8px;
        }

        .seccion-card {
          border-radius: 16px;
        }

        .seccion-titulo {
          font-size: 1.5rem;
        }

        .ingredient-card {
          border-radius: 14px;
          min-height: 90px;
        }

        .sin-imagen {
          background: #ececec;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #666;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
}
