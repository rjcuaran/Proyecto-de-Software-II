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

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/recetas/categorias",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategorias(res.data || []);
      } catch (err) {
        console.error("⚠️ Error cargando categorías:", err);
      }
    };

    fetchCategorias();
  }, []);

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
              filtros.categoria && filtros.categoria !== "todas"
                ? filtros.categoria
                : undefined,
            orden: filtros.orden,
          },
        });
        setRecetas(res.data);
      } catch (err) {
        console.error("❌ Error al cargar recetas:", err);
        setError("No se pudieron cargar las recetas.");
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchRecetas, 260);

    return () => clearTimeout(debounce);
  }, [filtros]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros({ q: "", categoria: "todas", orden: "desc" });
  };

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

      {/* FILTROS */}
      <Card className="shadow-sm border-0 mb-4 filtros-card">
        <Card.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Row className="g-3 align-items-end">
              <Col xs={12} md={5}>
                <Form.Label className="text-muted small mb-1">
                  Buscar por nombre
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>🔍</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Pasta, ensalada, postre..."
                    value={filtros.q}
                    onChange={(e) => handleFiltroChange("q", e.target.value)}
                  />
                </InputGroup>
              </Col>

              <Col xs={12} md={4}>
                <Form.Label className="text-muted small mb-1">
                  Categoría
                </Form.Label>
                <Form.Select
                  value={filtros.categoria}
                  onChange={(e) => handleFiltroChange("categoria", e.target.value)}
                >
                  <option value="todas">Todas</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} md={3}>
                <Form.Label className="text-muted small mb-1">
                  Ordenar por fecha
                </Form.Label>
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
                <Button variant="link" className="text-decoration-none" onClick={limpiarFiltros}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* SIN RECETAS */}
      {recetas.length === 0 ? (
        <Alert variant="info">
          {filtros.q || filtros.categoria !== "todas" || filtros.orden !== "desc"
            ? "No se encontraron recetas con estos filtros."
            : "Aún no has creado recetas."}
        </Alert>
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
                    <div className="text-muted small mb-2">
                      ⏱ Creada el {formatFecha(receta.fecha_creacion)}
                    </div>
                  )}

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

// Inserta estilos una sola vez
if (typeof document !== "undefined") {
  const styleId = "recetas-list-premium-styles";
  if (!document.getElementById(styleId)) {
    const styleTag = document.createElement("style");
    styleTag.id = styleId;
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
  }
}
