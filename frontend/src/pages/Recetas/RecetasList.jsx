// frontend/src/pages/Recetas/RecetasList.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";

export default function RecetasList() {
  const navigate = useNavigate();
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({
    q: "",
    categoria: "todas",
    orden: "desc",
  });

  const [seleccionadas, setSeleccionadas] = useState([]);

  // 🔥 Modal Premium
  const [showModal, setShowModal] = useState(false);

  const buildImagenUrl = (img) => {
    if (!img) return null;
    if (/^https?:\/\//.test(img)) return img;
    const normalizada = img.includes("/") ? img : `recetas/${img}`;
    return `http://localhost:5000/uploads/${normalizada}`;
  };

  const formatFecha = (fecha) => {
    if (!fecha) return null;
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // 📌 CARGAR CATEGORÍAS
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/recetas/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategorias(res.data || []);
      } catch (err) {
        console.error("⚠️ Error cargando categorías:", err);
      }
    };

    fetchCategorias();
  }, []);

  // 📌 CARGAR RECETAS CON FILTROS
  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        setError(null);
        setLoading(true);

        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/recetas", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: filtros.q || undefined,
            categoria:
              filtros.categoria !== "todas" ? filtros.categoria : undefined,
            orden: filtros.orden,
          },
        });

        setRecetas(res.data || []);

        setSeleccionadas((prev) =>
          prev.filter((idSel) =>
            (res.data || []).some((r) => r.id_receta === idSel)
          )
        );
      } catch (err) {
        console.error("❌ Error al cargar recetas:", err);
        setError("No se pudieron cargar las recetas.");
      } finally {
        setLoading(false);
      }
    };

    const d = setTimeout(fetchRecetas, 260);
    return () => clearTimeout(d);
  }, [filtros]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros({ q: "", categoria: "todas", orden: "desc" });
  };

  const toggleSeleccion = (idReceta) => {
    setSeleccionadas((prev) =>
      prev.includes(idReceta)
        ? prev.filter((id) => id !== idReceta)
        : [...prev, idReceta]
    );
  };

  const seleccionarTodasVisibles = () => {
    setSeleccionadas(recetas.map((r) => r.id_receta));
  };

  const limpiarSeleccion = () => {
    setSeleccionadas([]);
  };

  // 👉 Modal para confirmar generar lista
  const confirmarGenerarLista = () => {
    if (seleccionadas.length === 0) return;
    setShowModal(true);
  };

  // 👉 Acción confirmada del modal
  const handleConfirmGenerar = () => {
    setShowModal(false);
    navigate("/shopping-list", {
      state: { recetas: seleccionadas },
    });
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando recetas...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      {/* ENCABEZADO */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-1">🍽 Mis Recetas</h2>
          <p className="text-muted small">
            Selecciona varias y genera tu lista de compras.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/shopping-list")}>
            🧾 Ver lista de compras
          </Button>

          <Button
            variant="outline-primary"
            disabled={seleccionadas.length === 0}
            onClick={confirmarGenerarLista}
          >
            🛒 Generar lista ({seleccionadas.length})
          </Button>

          <Button variant="success" onClick={() => navigate("/recetas/nueva")}>
            ➕ Nueva receta
          </Button>
        </div>
      </div>

      {/* FILTROS */}
      <Card className="shadow-sm border-0 mb-3 filtros-card">
        <Card.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Row className="g-3">
              <Col xs={12} md={5}>
                <Form.Label className="text-muted small mb-1">Buscar</Form.Label>
                <InputGroup>
                  <InputGroup.Text>🔍</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Ej: pasta, pollo, postre..."
                    value={filtros.q}
                    onChange={(e) => handleFiltroChange("q", e.target.value)}
                  />
                </InputGroup>
              </Col>

              <Col xs={12} md={4}>
                <Form.Label className="text-muted small mb-1">Categoría</Form.Label>
                <Form.Select
                  value={filtros.categoria}
                  onChange={(e) => handleFiltroChange("categoria", e.target.value)}
                >
                  <option value="todas">Todas</option>
                  {categorias.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} md={3}>
                <Form.Label className="text-muted small mb-1">Orden</Form.Label>
                <Form.Select
                  value={filtros.orden}
                  onChange={(e) => handleFiltroChange("orden", e.target.value)}
                >
                  <option value="desc">Más recientes</option>
                  <option value="asc">Más antiguas</option>
                </Form.Select>
              </Col>
            </Row>

            {(filtros.q || filtros.categoria !== "todas" || filtros.orden !== "desc") && (
              <div className="d-flex justify-content-end mt-3">
                <Button variant="link" onClick={limpiarFiltros}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* BARRA DE SELECCIÓN */}
      <div className="d-flex justify-content-between small mb-3">
        <div className="text-muted">
          {seleccionadas.length > 0 ? (
            <>
              <strong>{seleccionadas.length}</strong> seleccionadas
            </>
          ) : (
            <>Selecciona una o varias recetas</>
          )}
        </div>

        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-secondary" onClick={seleccionarTodasVisibles}>
            Seleccionar todas
          </Button>

          <Button
            size="sm"
            variant="outline-light"
            className="border"
            onClick={limpiarSeleccion}
            disabled={seleccionadas.length === 0}
          >
            Limpiar
          </Button>
        </div>
      </div>

      {/* LISTADO */}
      {recetas.length === 0 ? (
        <Alert variant="info">No se encontraron recetas.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
          {recetas.map((receta) => {
            const estaSeleccionada = seleccionadas.includes(receta.id_receta);

            return (
              <Col key={receta.id_receta}>
                <Card
                  className={
                    "border-0 shadow-sm rounded-4 overflow-hidden receta-card" +
                    (estaSeleccionada ? " receta-card-seleccionada" : "")}
                >
                  <div
                    className="seleccion-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Form.Check
                      type="checkbox"
                      checked={estaSeleccionada}
                      onChange={() => toggleSeleccion(receta.id_receta)}
                    />
                  </div>

                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/recetas/${receta.id_receta}`)}
                  >
                    {receta.imagen ? (
                      <div className="receta-img-wrapper">
                        <Card.Img
                          variant="top"
                          src={buildImagenUrl(receta.imagen)}
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

                      {receta.fecha_creacion && (
                        <div className="text-muted small">
                          ⏱ {formatFecha(receta.fecha_creacion)}
                        </div>
                      )}
                    </Card.Body>
                  </div>

                  <div className="d-flex justify-content-between px-3 pb-3">
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
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* 🔥 MODAL PREMIUM CONFIRMACIÓN */}
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Generar lista de compras</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {seleccionadas.length === 1 ? (
            <p>¿Deseas generar la lista de compras con esta receta seleccionada?</p>
          ) : (
            <p>
              ¿Deseas generar la lista de compras con{" "}
              <strong>{seleccionadas.length}</strong> recetas seleccionadas?
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>

          <Button variant="primary" onClick={handleConfirmGenerar}>
            Generar lista
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

/* ESTILOS EXTRA PREMIUM */
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

.receta-card {
  position: relative;
}

.receta-card-seleccionada {
  box-shadow: 0 0 0 3px #0ea5e9, 0 10px 28px rgba(14,165,233,0.35)!important;
}

.seleccion-checkbox {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
  background: rgba(255,255,255,0.95);
  border-radius: 12px;
  padding: 4px 8px;
  box-shadow: 0 4px 10px rgba(15,23,42,0.2);
}

.filtros-card {
  border-radius: 16px;
  background: #fdfefe;
}

.filtros-card .input-group-text {
  background: #f1f5f9;
  border-color: #e5e7eb;
}

.filtros-card .form-control,
.filtros-card .form-select {
  border-radius: 10px;
}
`;

if (typeof document !== "undefined") {
  const styleId = "recetas-list-premium-styles";
  if (!document.getElementById(styleId)) {
    const styleTag = document.createElement("style");
    styleTag.id = styleId;
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
  }
}
