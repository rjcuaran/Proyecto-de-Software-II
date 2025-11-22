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
  const imagenPath = (() => {
    if (!receta.imagen) return null;
    if (/^https?:\/\//.test(receta.imagen)) return receta.imagen;
    return receta.imagen.includes("/") ? receta.imagen : `recetas/${receta.imagen}`;
  })();

  const imagenUrl = imagenPath
    ? imagenPath.startsWith("http")
      ? imagenPath
      : `http://localhost:5000/uploads/${imagenPath}`
    : null;

  // Parallax y animación suave del hero
  const parallaxOffset = Math.min(scrollY, 320);
  const zoomScale = 1 + Math.min(parallaxOffset / 950, 0.12);
  const heroMediaTransform = `scale(${zoomScale}) translateY(${parallaxOffset * 0.18}px)`;
  const titleOpacity = Math.max(1 - parallaxOffset / 260, 0.35);
  const titleTranslate = `translateY(${Math.min(parallaxOffset * 0.12, 30)}px)`;

  const heroMediaStyle = imagenUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(10,11,15,0.58) 0%, rgba(10,11,15,0.32) 38%, rgba(10,11,15,0.75) 100%), url(${imagenUrl})`,
        transform: heroMediaTransform,
      }
    : {
        background: "linear-gradient(135deg, #1f2933, #3b4a5a)",
        transform: heroMediaTransform,
      };

  // Transformar preparación en pasos visuales (uno por línea)
  const pasosPreparacion = receta.preparacion
    ? receta.preparacion.split(/\r?\n/).filter((linea) => linea.trim() !== "")
    : [];

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

        {/* Overlay centrado */}
        <div className="hero-overlay">
          <div className="hero-overlay-inner">
            <span className="hero-subtitle">Receta destacada</span>
            <h1
              className="fw-bold hero-title"
              style={{ opacity: titleOpacity, transform: titleTranslate }}
            >
              {receta.nombre}
            </h1>

            <div className="hero-meta-row">
              <Badge bg="info" className="categoria-badge">
                {receta.categoria}
              </Badge>
              {fechaFormateada && (
                <span className="hero-fecha d-none d-md-inline">
                  ⏱ Creada el {fechaFormateada}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Container className="mt-4 mb-5">
        {/* FILA SUPERIOR: Volver + barra sticky de acciones */}
        <div className="top-row d-flex justify-content-between align-items-start mb-4">
          <Button
            variant="light"
            onClick={() => navigate(-1)}
            className="print-hidden volver-btn"
          >
            ← Volver
          </Button>

          {/* Barra de acciones sticky (Editar + Favorito + Imprimir) */}
          <div className="acciones-sticky-wrapper print-hidden">
            <div className="acciones-sticky d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                className="accion-btn"
                onClick={handlePrint}
              >
                🖨 Imprimir / PDF
              </Button>
              <Button
                variant="outline-primary"
                className="accion-btn"
                onClick={() => navigate(`/recetas/${id}/editar`)}
              >
                ✏️ Editar
              </Button>
              <Button
                variant={esFavorito ? "warning" : "outline-warning"}
                className="accion-btn"
                onClick={toggleFavorito}
                disabled={favLoading}
              >
                {favLoading
                  ? "Guardando..."
                  : esFavorito
                  ? "★ En favoritos"
                  : "☆ Favorito"}
              </Button>
            </div>
          </div>
        </div>

        {/* Meta de fecha en mobile (debajo del top-row) */}
        {fechaFormateada && (
          <div className="text-muted mb-3 small meta-row d-md-none">
            ⏱ Creada el {fechaFormateada}
          </div>
        )}

        {favError && <Alert variant="danger">{favError}</Alert>}

        {/* DESCRIPCIÓN */}
        <Card className="shadow-sm border-0 mb-4 seccion-card">
          <Card.Body className="seccion-body">
            <h3 className="fw-semibold seccion-titulo">📘 Descripción</h3>
            <p className="text-muted fs-5 mb-0 seccion-texto">
              {receta.descripcion}
            </p>
          </Card.Body>
        </Card>

        {/* INGREDIENTES */}
        <Card className="shadow-sm border-0 mb-4 seccion-card">
          <Card.Body className="seccion-body">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h3 className="fw-semibold seccion-titulo mb-0">
                🧂 Ingredientes
              </h3>
              <span className="small text-muted">
                {Array.isArray(receta.ingredientes)
                  ? `${receta.ingredientes.length} ingrediente(s)`
                  : null}
              </span>
            </div>

            <Row className="mt-3 gy-3">
              {Array.isArray(receta.ingredientes) &&
                receta.ingredientes.map((ing) => (
                  <Col md={6} lg={4} key={ing.id_ingrediente}>
                    <Card className="ingredient-card shadow-sm border-0 h-100">
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

        {/* PREPARACIÓN / PASOS */}
        <Card className="shadow-sm border-0 seccion-card">
          <Card.Body className="seccion-body">
            <h3 className="fw-semibold seccion-titulo">👨‍🍳 Preparación</h3>

            {pasosPreparacion.length > 0 ? (
              <ol className="pasos-list mt-3 mb-0">
                {pasosPreparacion.map((paso, index) => (
                  <li key={index} className="paso-item">
                    <div className="paso-index">
                      <span>{index + 1}</span>
                    </div>
                    <p className="mb-0">{paso}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p
                className="fs-6 mt-2 mb-0 seccion-texto"
                style={{ whiteSpace: "pre-line" }}
              >
                {receta.preparacion}
              </p>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* ESTILOS PREMIUM + PARALLAX + STICKY ACTIONS */}
      <style>{`
        .receta-detail-wrapper {
          background: #f4f6fb;
          min-height: 100vh;
        }

        .receta-hero {
          position: relative;
          width: 100%;
          height: clamp(420px, 55vh, 520px);
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
          filter: saturate(1.05) contrast(1.03);
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
          width: 100%;
          padding: 52px 7vw 42px;
          background: linear-gradient(
            180deg,
            rgba(6, 8, 10, 0.06) 0%,
            rgba(6, 8, 10, 0.22) 35%,
            rgba(6, 8, 10, 0.6) 100%
          );
          backdrop-filter: blur(2px);
          box-shadow: inset 0 -120px 160px rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .hero-overlay-inner {
          width: 100%;
          max-width: 960px;
          text-align: center;
        }

        .hero-subtitle {
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 0.8rem;
          opacity: 0.95;
          display: inline-block;
          padding: 6px 0;
        }

        .hero-title {
          font-size: clamp(1.9rem, 3.2vw, 2.9rem);
          margin: 6px 0 10px;
          text-shadow: 0 10px 30px rgba(0,0,0,0.6);
          transition: opacity 0.35s ease, transform 0.35s ease;
          line-height: 1.1;
        }

        .hero-meta-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 0.4rem;
        }

        .hero-fecha {
          font-size: 0.85rem;
          opacity: 0.95;
        }

        .categoria-badge {
          font-size: 0.95rem;
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          background: rgba(56,189,248,0.97) !important;
          box-shadow: 0 8px 22px rgba(8, 47, 73, 0.4);
        }

        .top-row {
          column-gap: 1.5rem;
        }

        .volver-btn {
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
          background: #ffffff;
          border-color: #e5e7eb;
          padding-inline: 1.1rem;
        }

        .acciones-sticky-wrapper {
          position: relative;
          flex: 0 0 auto;
        }

        .acciones-sticky {
          position: sticky;
          top: 18px;
          z-index: 40;
          background: rgba(248, 250, 252, 0.85);
          backdrop-filter: blur(8px);
          border-radius: 999px;
          padding: 0.4rem 0.8rem;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
        }

        .accion-btn {
          border-radius: 999px;
          padding-inline: 0.9rem;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        /* Barra fija en la parte inferior en móviles */
        @media (max-width: 768px) {
          .acciones-sticky-wrapper {
            position: static;
            width: 100%;
          }

          .acciones-sticky {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 18px 18px 0 0;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.6rem 1rem;
            box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.32);
          }

          .accion-btn {
            flex: 1 1 auto;
            text-align: center;
          }

          .top-row {
            margin-bottom: 1.25rem;
          }

          .receta-detail-wrapper {
            padding-bottom: 70px; /* espacio para la barra fija */
          }
        }

        .seccion-card {
          border-radius: 20px;
          background: #ffffff;
        }

        .seccion-body {
          padding: 1.6rem 1.75rem;
        }

        .seccion-titulo {
          font-size: 1.4rem;
          margin-bottom: 0.75rem;
        }

        .seccion-texto {
          line-height: 1.7;
        }

        .ingredient-card {
          border-radius: 14px;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          background: linear-gradient(135deg, #ffffff, #f9fafb);
        }

        .ingredient-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.15);
        }

        .meta-row {
          letter-spacing: 0.01em;
        }

        .pasos-list {
          list-style: none;
          padding-left: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .paso-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          border-radius: 14px;
          background: #f9fafb;
          border: 1px dashed rgba(148, 163, 184, 0.7);
          transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }

        .paso-item:hover {
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
        }

        .paso-index {
          flex: 0 0 auto;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: #0ea5e9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 600;
          color: #f9fafb;
          box-shadow: 0 8px 18px rgba(14, 165, 233, 0.5);
          margin-top: 1px;
        }

        .paso-index span {
          transform: translateY(-0.5px);
        }

        @media (max-width: 576px) {
          .seccion-body {
            padding: 1.35rem 1.3rem;
          }

          .hero-overlay {
            padding-inline: 1.5rem;
          }
        }

        @media print {
          body, .receta-detail-wrapper {
            background: #ffffff !important;
          }

          .print-hidden,
          .acciones-sticky {
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
            box-shadow: none;
          }

          .paso-item {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
