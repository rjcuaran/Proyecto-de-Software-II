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
  Alert,
} from "react-bootstrap";

export default function RecetaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [esFavorito, setEsFavorito] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState(null);
  const [fechaFormateada, setFechaFormateada] = useState("");

  useEffect(() => {
    const fetchReceta = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/recetas/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setReceta(res.data);
        if (res.data.fecha_creacion) {
          const fecha = new Date(res.data.fecha_creacion);
          const fechaString = fecha.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
          setFechaFormateada(fechaString);
        }
      } catch (err) {
        console.error("❌ Error cargando receta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceta();
  }, [id]);

  useEffect(() => {
    const fetchFavorito = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/favoritos/${id}/check`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEsFavorito(!!res.data.esFavorito);
      } catch (error) {
        console.error("❌ Error verificando favorito:", error);
      }
    };

    fetchFavorito();
  }, [id]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(currentY);
          ticking = false;
        });

        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const toggleFavorito = async () => {
    setFavError(null);
    setFavLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró token");

      if (esFavorito) {
        await axios.delete(`http://localhost:5000/api/favoritos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEsFavorito(false);
      } else {
        await axios.post(
          `http://localhost:5000/api/favoritos/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEsFavorito(true);
      }
    } catch (error) {
      console.error("❌ Error al alternar favorito:", error);
      setFavError("No se pudo actualizar el estado de favorito.");
    } finally {
      setFavLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando receta...</p>
      </div>
    );

  if (!receta) return <p className="text-center">No se encontró la receta.</p>;

  // URL de la imagen para usarla en el parallax
  const imagenPath =
    receta.imagen && receta.imagen.includes("/")
      ? receta.imagen
      : receta.imagen
      ? `recetas/${receta.imagen}`
      : null;

  const imagenUrl = imagenPath
    ? `http://localhost:5000/uploads/${imagenPath}`
    : null;

  const parallaxOffset = Math.min(scrollY, 320);
  const zoomScale = 1 + Math.min(parallaxOffset / 950, 0.12);
  const heroMediaTransform = `scale(${zoomScale}) translateY(${parallaxOffset * 0.18}px)`;
  const titleOpacity = Math.max(1 - parallaxOffset / 260, 0.35);
  const titleTranslate = `translateY(${Math.min(parallaxOffset * 0.12, 30)}px)`;

  const heroMediaStyle = imagenUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(10,11,15,0.65) 0%, rgba(10,11,15,0.35) 35%, rgba(10,11,15,0.75) 100%), url(${imagenUrl})`,
        transform: heroMediaTransform,
      }
    : {
        background: "linear-gradient(135deg, #1f2933, #3b4a5a)",
        transform: heroMediaTransform,
      };

  return (
    <div className="receta-detail-wrapper">
      {/* HERO PARALLAX */}
      <div
        className={`receta-hero parallax-hero ${
          !imagenUrl ? "hero-sin-imagen" : ""
        }`}
      >
        <div className="hero-media" style={heroMediaStyle} />

        {!imagenUrl && (
          <div className="sin-imagen-text">📷 Sin imagen disponible</div>
        )}

        {/* Overlay de texto */}
        <div className="hero-overlay">
          <span className="hero-subtitle">Receta destacada</span>
          <h1
            className="fw-bold hero-title"
            style={{ opacity: titleOpacity, transform: titleTranslate }}
          >
            {receta.nombre}
          </h1>
          <Badge bg="info" className="categoria-badge">
            {receta.categoria}
          </Badge>
        </div>
      </div>

      <Container className="mt-4">
        {/* BOTONES SUPERIORES */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="light" onClick={() => navigate(-1)} className="print-hidden">
            ← Volver
          </Button>

          <div className="d-flex align-items-center gap-2 print-hidden">
            <Button
              variant="outline-secondary"
              className="me-1"
              onClick={handlePrint}
            >
              🖨 Imprimir / PDF
            </Button>
            <Button
              variant="outline-primary"
              className="me-1"
              onClick={() => navigate(`/recetas/${id}/editar`)}
            >
              ✏️ Editar
            </Button>
            <Button
              variant={esFavorito ? "warning" : "outline-warning"}
              onClick={toggleFavorito}
              disabled={favLoading}
            >
              {favLoading ? "Guardando..." : esFavorito ? "★ En favoritos" : "☆ Favorito"}
            </Button>
          </div>
        </div>

        {fechaFormateada && (
          <div className="text-muted mb-3 small meta-row">
            ⏱ Creada el {fechaFormateada}
          </div>
        )}

        {favError && <Alert variant="danger">{favError}</Alert>}

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
          height: clamp(380px, 42vh, 420px);
          display: flex;
          align-items: flex-end;
          color: #fff;
          overflow: hidden;
          isolation: isolate;
        }

        .hero-media {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          will-change: transform;
          transition: transform 0.45s ease-out, filter 0.45s ease-out;
          filter: saturate(1.05) contrast(1.02);
        }

        /* Desactivar parallax en móviles por rendimiento */
        @media (max-width: 768px) {
          .hero-media {
            background-attachment: scroll;
          }
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
          padding: 46px 8vw;
          width: 100%;
          background: linear-gradient(
            180deg,
            rgba(6, 8, 10, 0.15) 0%,
            rgba(6, 8, 10, 0.25) 40%,
            rgba(6, 8, 10, 0.55) 100%
          );
          backdrop-filter: blur(1px);
          box-shadow: inset 0 -120px 160px rgba(0, 0, 0, 0.32);
        }

        .hero-subtitle {
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 0.8rem;
          opacity: 0.9;
          display: inline-block;
          padding: 6px 0;
        }

        .hero-title {
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          margin: 6px 0 10px;
          text-shadow: 0 10px 30px rgba(0,0,0,0.6);
          transition: opacity 0.35s ease, transform 0.35s ease;
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

        .meta-row {
          letter-spacing: 0.01em;
        }

        @media print {
          body, .receta-detail-wrapper {
            background: #ffffff !important;
          }

          .print-hidden {
            display: none !important;
          }

          .receta-hero {
            height: 280px;
          }

          .hero-media {
            background-attachment: scroll;
            filter: brightness(0.9);
          }

          .hero-overlay {
            background: linear-gradient(
              180deg,
              rgba(6, 8, 10, 0.35) 0%,
              rgba(6, 8, 10, 0.6) 100%
            );
            box-shadow: inset 0 -90px 120px rgba(0,0,0,0.22);
          }

          .seccion-card {
            box-shadow: none !important;
            border: 1px solid #e5e7eb;
          }

          .categoria-badge {
            color: #0f172a;
            background: #dbeafe !important;
          }
        }
      `}</style>
    </div>
  );
}
