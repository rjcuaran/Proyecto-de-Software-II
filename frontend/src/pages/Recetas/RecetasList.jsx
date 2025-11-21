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
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function RecetasList() {
  const navigate = useNavigate();
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [favoritosMap, setFavoritosMap] = useState({}); // id_receta -> boolean
  const [togglingFav, setTogglingFav] = useState({}); // id -> loading

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/recetas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // tolerancia a distintos formatos de respuesta
        const data = res.data.recetas || res.data || [];
        setRecetas(Array.isArray(data) ? data : []);
        // crear el mapa de favoritos si viene info (es_favorito)
        const map = {};
        (Array.isArray(data) ? data : []).forEach((r) => {
          // posible propiedad: es_favorito o is_favorite
          map[r.id_receta] = Boolean(r.es_favorito || r.is_favorite || r.favorito);
        });
        setFavoritosMap(map);
      } catch (err) {
        console.error("❌ Error al cargar recetas:", err);
        setError("No se pudieron cargar las recetas.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, []);

  const toggleSeleccion = (id) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGenerarLista = () => {
    if (seleccionadas.length === 0) {
      alert("Selecciona al menos una receta.");
      return;
    }

    // Navegar a la página de lista de compras pasando los IDs seleccionados
    navigate("/shopping-list", { state: { recetas: seleccionadas } });
  };

  const handleToggleFavorito = async (id) => {
    try {
      setTogglingFav((s) => ({ ...s, [id]: true }));
      const token = localStorage.getItem("token");
      // Si ya es favorito, eliminar; si no, agregar.
      const esFav = !!favoritosMap[id];
      if (esFav) {
        await axios.delete(`http://localhost:5000/api/favoritos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/favoritos/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFavoritosMap((m) => ({ ...m, [id]: !esFav }));
    } catch (err) {
      console.error("Error toggle favorito:", err);
      alert("No se pudo actualizar favorito. Intenta de nuevo.");
    } finally {
      setTogglingFav((s) => ({ ...s, [id]: false }));
    }
  };

  const handleSearchChange = (e) => setQuery(e.target.value);

  const filtered = recetas.filter((r) =>
    (r.nombre || r.titulo || "")
      .toString()
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

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
      {/* Header + actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-2">📘 Mis Recetas</h2>
          <p className="text-muted mb-0">Administra tus recetas, edítalas y crea listas de compra.</p>
        </div>

        <div className="d-flex align-items-center gap-2 w-100 w-md-auto">
          <InputGroup className="me-2" style={{ minWidth: 260 }}>
            <input
              className="form-control"
              placeholder="Buscar receta por nombre..."
              value={query}
              onChange={handleSearchChange}
            />
            <Button variant="outline-secondary" onClick={() => setQuery("")} title="Limpiar búsqueda">
              <i className="bi bi-x-lg"></i>
            </Button>
          </InputGroup>

          <Button variant="success" onClick={() => navigate("/recetas/nueva")}>
            <i className="bi bi-plus-lg me-2"></i> Nueva receta
          </Button>
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <Alert variant="info">No se encontraron recetas que coincidan.</Alert>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filtered.map((receta) => {
              const id = receta.id_receta || receta.id || receta.idReceta;
              const titulo = receta.nombre || receta.titulo || "Sin título";
              const categoria = receta.categoria || receta.categoria_nombre || "Sin categoría";
              const descripcion = receta.descripcion || receta.resumen || "";
              const imagen = receta.imagen || receta.image || null;

              return (
                <Col key={id}>
                  <Card className="h-100 border-0 shadow-sm">
                    {imagen ? (
                      <div style={{ height: 160, overflow: "hidden" }}>
                        <Card.Img
                          variant="top"
                          src={imagen}
                          alt={titulo}
                          style={{ objectFit: "cover", width: "100%", height: "160px" }}
                        />
                      </div>
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light"
                        style={{ height: 160 }}
                      >
                        <i className="bi bi-card-image fs-1 text-muted"></i>
                      </div>
                    )}

                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Title className="mb-1 fw-semibold" style={{ lineHeight: 1.1 }}>
                            {titulo}
                          </Card.Title>
                          <small className="text-muted">
                            <Badge bg="secondary" className="me-1">{categoria}</Badge>
                          </small>
                        </div>

                        <div className="d-flex flex-column align-items-end">
                          <Form.Check
                            type="checkbox"
                            id={`sel-${id}`}
                            checked={seleccionadas.includes(id)}
                            onChange={() => toggleSeleccion(id)}
                            label=""
                          />
                          <button
                            className="btn btn-link p-0 ms-2"
                            onClick={() => handleToggleFavorito(id)}
                            title={favoritosMap[id] ? "Quitar favorito" : "Marcar como favorito"}
                            disabled={!!togglingFav[id]}
                          >
                            <i
                              className={`bi ${
                                favoritosMap[id] ? "bi-heart-fill text-danger" : "bi-heart"
                              } fs-5`}
                            ></i>
                          </button>
                        </div>
                      </div>

                      <Card.Text className="text-muted small mt-2" style={{ flex: 1 }}>
                        {descripcion.length > 120 ? descripcion.substring(0, 120) + "…" : descripcion}
                      </Card.Text>

                      <div className="d-flex gap-2 mt-3">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => navigate(`/recetas/${id}`)}
                        >
                          <i className="bi bi-eye me-1"></i> Ver
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/recetas/${id}/editar`)}
                        >
                          <i className="bi bi-pencil me-1"></i> Editar
                        </Button>

                        <div className="ms-auto text-end">
                          <small className="text-muted"> {new Date(receta.fecha_creacion || receta.created_at || Date.now()).toLocaleDateString()}</small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Acción flotante */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
              <small className="text-muted">
                Seleccionadas: <strong>{seleccionadas.length}</strong>
              </small>
            </div>

            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setSeleccionadas([])}
                disabled={seleccionadas.length === 0}
              >
                <i className="bi bi-x-circle me-1"></i> Limpiar
              </Button>

              <Button
                variant="success"
                onClick={handleGenerarLista}
                disabled={seleccionadas.length === 0}
              >
                <i className="bi bi-cart-check me-1"></i> Generar Lista de Compras ({seleccionadas.length})
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
