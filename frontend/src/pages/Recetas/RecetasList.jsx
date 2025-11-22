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

  // ✅ IDs de recetas seleccionadas para lista de compras
  const [seleccionadas, setSeleccionadas] = useState([]);

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

        const data = res.data || [];
        setRecetas(data);

        // Limpiar seleccionadas que ya no estén en la lista actual
        setSeleccionadas((prev) =>
          prev.filter((idSel) => data.some((r) => r.id_receta === idSel))
        );
      } catch (err) {
        console.error("❌ Error al cargar recetas:", err);
        setError("No se pudieron cargar las recetas.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchRecetas, 260);
    return () => clearTimeout(timeoutId);
  }, [filtros]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros({ q: "", categoria: "todas", orden: "desc" });
  };

  // ✅ Seleccionar / deseleccionar una receta
  const toggleSeleccion = (idReceta) => {
    setSeleccionadas((prev) =>
      prev.includes(idReceta)
        ? prev.filter((id) => id !== idReceta)
        : [...prev, idReceta]
    );
  };

  // ✅ Seleccionar todas las visibles
  const seleccionarTodasVisibles = () => {
    setSeleccionadas(recetas.map((r) => r.id_receta));
  };

  // ✅ Limpiar selección
  const limpiarSeleccion = () => {
    setSeleccionadas([]);
  };

  // ✅ Navegar a la página de lista de compras con las recetas seleccionadas
  const handleGenerarListaCompras = () => {
    if (seleccionadas.length === 0) return;
    navigate("/shopping-list", {
      state: { recetas: seleccionadas },
    });
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-primary mb-1">🍽 Mis Recetas</h2>
          <p className="text-muted small mb-0">
            Gestiona tus recetas y selecciona varias para generar tu lista de
            compras.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2 justify-content-md-end">
          {/* Botón para ir a la lista de compras actual */}
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/shopping-list")}
          >
            🧾 Ver lista de compras
          </Button>

          {/* Botón generar lista desde selección */}
          <Button
            variant="outline-primary"
            disabled={seleccionadas.length === 0}
            onClick={handleGenerarListaCompras}
          >
            🛒 Generar lista ({seleccionadas.length})
          </Button>

          <Button variant="success" onClick={() => navigate("/recetas/nueva")}>
            ➕ Nueva receta
          </Button>
        </div>
      </div>

      {/* FILTROS */}
      <Card className="shadow-sm border-0 mb-3">
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
                  onChange={(e) =>
                    handleFiltroChange("categoria", e.target.value)
                  }
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

            {(filtros.q ||
              filtros.categoria !== "todas" ||
              filtros.orden !== "desc") && (
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="link"
                  className="text-decoration-none"
                  onClick={limpiarFiltros}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* BARRA DE SELECCIÓN PARA LISTA DE COMPRAS */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 small">
        <div className="text-muted">
          {seleccionadas.length > 0 ? (
            <>
              <strong>{seleccionadas.length}</strong> receta(s) seleccionada(s)
              para la lista de compras.
            </>
          ) : (
            <>Selecciona una o varias recetas para generar tu lista de compras.</>
          )}
        </div>

        {recetas.length > 0 && (
          <div className="d-flex gap-2 mt-2 mt-md-0">
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={seleccionarTodasVisibles}
            >
              Seleccionar todas las visibles
            </Button>
            <Button
              size="sm"
              variant="outline-light"
              className="border"
              onClick={limpiarSeleccion}
              disabled={seleccionadas.length === 0}
            >
              Limpiar selección
            </Button>
          </div>
        )}
      </div>

      {/* SIN RECETAS */}
      {recetas.length === 0 ? (
        <Alert variant="info">
          {filtros.q ||
          filtros.categoria !== "todas" ||
          filtros.orden !== "desc"
            ? "No se encontraron recetas con estos filtros."
            : "Aún no has creado recetas."}
        </Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
          {recetas.map((receta) => {
            const estaSeleccionada = seleccionadas.includes(receta.id_receta);

            return (
              <Col key={receta.id_receta}>
                <Card
                  className={`border-0 shadow-sm rounded-4 overflow-hidden ${
                    estaSeleccionada ? "border border-2 border-info" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/recetas/${receta.id_receta}`)}
                >
                  {/* Checkbox flotante: solo selecciona, no navega */}
                  <div
                    className="position-absolute"
                    style={{
                      top: 10,
                      left: 10,
                      zIndex: 5,
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: 999,
                      padding: "3px 8px",
                      boxShadow: "0 4px 10px rgba(15,23,42,0.2)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Form.Check
                      type="checkbox"
                      checked={estaSeleccionada}
                      onChange={() => toggleSeleccion(receta.id_receta)}
                    />
                  </div>

                  {/* IMAGEN (si existe) */}
                  {receta.imagen ? (
                    <div style={{ height: 180, overflow: "hidden" }}>
                      <Card.Img
                        variant="top"
                        src={buildImagenUrl(receta.imagen)}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className="bg-light d-flex justify-content-center align-items-center"
                      style={{ height: 180 }}
                    >
                      <span className="text-muted">📷 Sin imagen</span>
                    </div>
                  )}

                  <Card.Body>
                    <Card.Title className="fw-bold text-primary fs-5 d-flex justify-content-between align-items-start">
                      <span>{receta.nombre}</span>
                    </Card.Title>

                    <Badge bg="info" className="mb-2">
                      {receta.categoria}
                    </Badge>

                    <Card.Text className="text-muted small">
                      {receta.descripcion?.substring(0, 80) ||
                        "Sin descripción"}
                      ...
                    </Card.Text>

                    {receta.fecha_creacion && (
                      <div className="text-muted small mb-2">
                        ⏱ Creada el {formatFecha(receta.fecha_creacion)}
                      </div>
                    )}
                  </Card.Body>

                  {/* ACCIONES DE LA TARJETA */}
                  <div className="d-flex justify-content-between px-3 pb-3 pt-1">
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
    </div>
  );
}
