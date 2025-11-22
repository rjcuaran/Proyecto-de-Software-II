// frontend/src/pages/Recetas/RecetaDetailPage.jsx
// PARTE ÚNICA (archivo completo)
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
  Modal,
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

  // Modal de eliminar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // ⭐ Modal lista de compras
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [shoppingLoading, setShoppingLoading] = useState(false);
  const [shoppingMessage, setShoppingMessage] = useState(null);
  const [shoppingError, setShoppingError] = useState(null);

  // 📌 Cargar receta
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

  // 📌 Verificar si es favorito
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

  // Parallax scroll
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

    try {
      setFavLoading(true);
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

  // ⭐ Funciones del modal de lista de compras
  const agregarIngredientes = async () => {
    try {
      setShoppingLoading(true);
      setShoppingError(null);
      setShoppingMessage(null);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/shopping-list/agregar",
        { receta: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShoppingMessage("Ingredientes agregados a la lista.");
    } catch (err) {
      console.error("❌ Error al agregar ingredientes:", err);
      setShoppingError("No se pudo agregar a la lista.");
    } finally {
      setShoppingLoading(false);
    }
  };

  const reemplazarLista = async () => {
    try {
      setShoppingLoading(true);
      setShoppingError(null);
      setShoppingMessage(null);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/shopping-list/generar",
        { recetas: [id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShoppingMessage("Lista reemplazada con esta receta.");
    } catch (err) {
      console.error("❌ Error al generar lista:", err);
      setShoppingError("No se pudo reemplazar la lista.");
    } finally {
      setShoppingLoading(false);
    }
  };

  // 🗑️ Eliminar receta definitivamente
  const handleDeleteReceta = async () => {
    setDeleteError(null);
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/recetas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowDeleteModal(false);
      // Volver al listado de recetas
      navigate("/recetas");
    } catch (err) {
      console.error("❌ Error eliminando receta:", err);
      setDeleteError("No se pudo eliminar la receta.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
          <p className="mt-3">Cargando receta...</p>
        </div>
      ) : !receta ? (
        <Alert variant="danger" className="mt-4">
          No se encontró la receta solicitada.
        </Alert>
      ) : (
        <div className="receta-detail-page">
          {/* HERO PARALLAX */}
          <div
            className="receta-hero"
            style={{
              backgroundImage: receta.imagen
                ? `url(http://localhost:5000/uploads/recetas/${receta.imagen})`
                : "linear-gradient(135deg,#f8fafc,#e2e8f0)",
              backgroundPositionY: scrollY * 0.3,
            }}
          >
            <div className="hero-overlay"></div>
            <h1 className="hero-title">{receta.nombre}</h1>
          </div>

          {/* ACCIONES STICKY */}
          <div className="sticky-actions shadow-sm">
            <div className="d-flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/recetas")}
              >
                ← Volver
              </Button>

              <Button
                variant="info"
                size="sm"
                onClick={() => navigate(`/recetas/${id}/editar`)}
              >
                ✏️ Editar
              </Button>

              <Button
                variant={esFavorito ? "warning" : "outline-warning"}
                size="sm"
                disabled={favLoading}
                onClick={toggleFavorito}
              >
                ⭐ {esFavorito ? "Quitar Favorito" : "Agregar Favorito"}
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                🗑️ Eliminar
              </Button>

              {/* ⭐ Nuevo botón */}
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowShoppingModal(true)}
              >
                🛒 Lista de compras
              </Button>

              <Button variant="dark" size="sm" onClick={handlePrint}>
                🖨️ Imprimir
              </Button>
            </div>
          </div>

          <Container className="mt-4 mb-5">
            <Row>
              <Col lg={7}>
                {/* 🧾 Descripción */}
                <Card className="shadow-sm border-0 mb-4">
                  <Card.Body>
                    <h4 className="fw-bold mb-3">Descripción</h4>
                    <p className="text-muted mb-0">
                      {receta.descripcion || "Sin descripción."}
                    </p>
                  </Card.Body>
                </Card>

                {/* Ingredientes */}
                <Card className="shadow-sm border-0 mb-4">
                  <Card.Body>
                    <h4 className="fw-bold mb-3">Ingredientes</h4>

                    {receta.ingredientes?.length === 0 ? (
                      <p className="text-muted">
                        No hay ingredientes registrados.
                      </p>
                    ) : (
                      <ul className="lista-ingredientes">
                        {receta.ingredientes.map((ing, index) => (
                          <li key={index}>
                            <Badge bg="primary" className="me-2">
                              {ing.cantidad} {ing.unidad_medida}
                            </Badge>
                            {ing.nombre}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card.Body>
                </Card>

                {/* Preparación */}
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <h4 className="fw-bold mb-3">Preparación</h4>
                    <p>{receta.preparacion}</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={5}>
                <Card className="shadow-sm border-0 mb-3">
                  <Card.Body>
                    <h5 className="fw-bold">Detalles</h5>
                    <p>
                      <strong>Categoría:</strong> {receta.categoria}
                    </p>
                    <p>
                      <strong>Creada el:</strong> {fechaFormateada}
                    </p>
                  </Card.Body>
                </Card>

                {favError && (
                  <Alert variant="danger" className="mt-3">
                    {favError}
                  </Alert>
                )}

                {shoppingMessage && (
                  <Alert variant="success" className="mt-3">
                    {shoppingMessage}
                  </Alert>
                )}

                {shoppingError && (
                  <Alert variant="danger" className="mt-3">
                    {shoppingError}
                  </Alert>
                )}
              </Col>
            </Row>
          </Container>

          {/* MODAL ELIMINAR */}
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Eliminar Receta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>¿Estás seguro de que deseas eliminar esta receta?</p>
              {deleteError && (
                <Alert variant="danger" className="mt-2">
                  {deleteError}
                </Alert>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                disabled={deleteLoading}
                onClick={handleDeleteReceta}
              >
                {deleteLoading ? "Eliminando..." : "Eliminar Definitivamente"}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* ⭐ MODAL LISTA DE COMPRAS */}
          <Modal
            show={showShoppingModal}
            onHide={() => setShowShoppingModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Lista de Compras</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="fs-5">
                ¿Qué deseas hacer con los ingredientes de esta receta?
              </p>

              {shoppingError && (
                <Alert variant="danger">{shoppingError}</Alert>
              )}

              {shoppingMessage && (
                <Alert variant="success">{shoppingMessage}</Alert>
              )}
            </Modal.Body>

            <Modal.Footer className="d-flex flex-column gap-2">
              <Button
                variant="success"
                disabled={shoppingLoading}
                onClick={agregarIngredientes}
                className="w-100"
              >
                {shoppingLoading ? "Procesando..." : "➕ Agregar a la lista actual"}
              </Button>

              <Button
                variant="primary"
                disabled={shoppingLoading}
                onClick={reemplazarLista}
                className="w-100"
              >
                {shoppingLoading ? "Procesando..." : "🔄 Reemplazar lista completa"}
              </Button>

              <Button
                variant="secondary"
                onClick={() => setShowShoppingModal(false)}
                className="w-100"
              >
                Cancelar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* ESTILOS */}
          <style>{`
            .receta-hero {
              height: 300px;
              background-size: cover;
              background-position: center;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              border-bottom-left-radius: 35px;
              border-bottom-right-radius: 35px;
              overflow: hidden;
            }

            .hero-overlay {
              position: absolute;
              inset: 0;
              background: rgba(0,0,0,0.35);
            }

            .hero-title {
              position: relative;
              z-index: 10;
              color: white;
              font-size: 2.4rem;
              text-align: center;
              padding: 0 20px;
            }

            .sticky-actions {
              position: sticky;
              top: 0;
              z-index: 50;
              background: white;
              padding: 10px;
              border-bottom: 1px solid #eee;
              display: flex;
              justify-content: space-between;
            }

            .lista-ingredientes li {
              margin-bottom: 8px;
              font-size: 1.05rem;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
