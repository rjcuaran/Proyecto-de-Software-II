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

  if (!receta) return <p className="text-center">No se encontró la receta.</p>;

  // URL de la imagen para usarla en el parallax
  const imagenUrl = receta.imagen
    ? `http://localhost:5000/uploads/${receta.imagen}`
    : null;

  return (
    <div className="receta-detail-wrapper">
      {/* HERO PARALLAX */}
      <div
        className={`receta-hero parallax-hero ${
          !imagenUrl ? "hero-sin-imagen" : ""
        }`}
        style={
          imagenUrl
            ? {
                backgroundImage: `linear-gradient(
                  to bottom,
                  rgba(0,0,0,0.55),
                  rgba(0,0,0,0.65)
                ), url(${imagenUrl})`,
              }
            : {}
        }
      >
        {!imagenUrl && (
          <div className="sin-imagen-text">📷 Sin imagen disponible</div>
        )}

        {/* Overlay de texto */}
        <div className="hero-overlay">
          <span className="hero-subtitle">Receta destacada</span>
          <h1 className="fw-bold hero-title">{receta.nombre}</h1>
          <Badge bg="info" className="categoria-badge">
            {receta.categoria}
          </Badge>
        </div>
      </div>

      <Container className="mt-4">
        {/* BOTONES SUPERIORES */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="light" onClick={() => navigate(-1)}>
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
            <p className="text-muted fs-5 mb-0">{receta.descripcion}</p>
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
                      <strong className="fs-5 d-block mb-1">
                        {ing.nombre}
                      </strong>
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
            <h3 className="fw-semibold seccion-titulo">👨‍🍳 Preparación</h3>
            <p
              className="fs-6 mt-2 mb-0"
              style={{ whiteSpace: "pre-line" }}
            >
              {receta.preparacion}
            </p>
          </Card.Body>
        </Card>
      </Container>

      {/* ESTILOS PREMIUM + PARALLAX */}
      <style>{`
        .receta-detail-wrapper {
          background: #f4f6fb;
          min-height: 100vh;
        }

        .receta-hero {
          position: relative;
          width: 100%;
          height: 320px;
          display: flex;
          align-items: flex-end;
          color: #fff;
          overflow: hidden;
        }

        .parallax-hero {
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }

        /* Desactivar parallax en móviles por rendimiento */
        @media (max-width: 768px) {
          .parallax-hero {
            background-attachment: scroll;
          }
        }

        .hero-sin-imagen {
          background: linear-gradient(135deg, #1f2933, #3b4a5a);
        }

        .sin-imagen-text {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.2rem;
          opacity: 0.85;
        }

        .hero-overlay {
          position: relative;
          z-index: 2;
          padding: 40px 8vw;
          width: 100%;
        }

        .hero-subtitle {
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 0.8rem;
          opacity: 0.9;
        }

        .hero-title {
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          margin: 6px 0 10px;
          text-shadow: 0 8px 22px rgba(0,0,0,0.55);
        }

        .categoria-badge {
          font-size: 0.95rem;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          background: rgba(56,189,248,0.95) !important;
        }

        .seccion-card {
          border-radius: 18px;
          background: #ffffff;
        }

        .seccion-titulo {
          font-size: 1.4rem;
          margin-bottom: 0.75rem;
        }

        .ingredient-card {
          border-radius: 14px;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .ingredient-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.15);
        }
      `}</style>
    </div>
  );
}
