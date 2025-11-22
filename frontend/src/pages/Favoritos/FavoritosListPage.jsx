import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";

const buildImagenUrl = (imagen) => {
  if (!imagen) return null;
  const normalized = imagen.includes("/") ? imagen : `recetas/${imagen}`;
  return `http://localhost:5000/uploads/${normalized}`;
};

export default function FavoritosListPage() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/favoritos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // TU BACKEND → res.data.data
        setFavoritos(res.data.data || []);
      } catch (err) {
        console.error("❌ Error al cargar favoritos:", err);
        setError("No se pudieron cargar tus favoritos.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavs();
  }, []);

  const removeFavorito = async (id_receta) => {
    try {
      setRemovingId(id_receta);
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/favoritos/${id_receta}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFavoritos((prev) =>
        prev.filter((receta) => receta.id_receta !== id_receta)
      );
    } catch (err) {
      console.error("❌ Error eliminando favorito:", err);
      setError("No se pudo eliminar el favorito.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Cargando favoritos...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-warning">⭐ Mis Favoritos</h2>
        <Button variant="primary" onClick={() => navigate("/recetas")}>
          Ir al recetario
        </Button>
      </div>

      {/* Vista cuando NO hay favoritos */}
      {favoritos.length === 0 ? (
        <Alert variant="info" className="text-center p-4 rounded-4 shadow-sm">
          <h5 className="fw-bold mb-2">Aún no tienes favoritos</h5>
          <p className="mb-3">Agrega tus recetas favoritas desde el detalle.</p>
          <Button onClick={() => navigate("/recetas")} variant="primary">
            Explorar recetas
          </Button>
        </Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
          {favoritos.map((receta) => {
            const imagenUrl = buildImagenUrl(receta.imagen);

            return (
              <Col key={receta.id_receta}>
                <Card
                  className="border-0 shadow-sm rounded-4 overflow-hidden receta-card"
                >
                  {/* Imagen */}
                  {imagenUrl ? (
                    <div
                      className="receta-img"
                      style={{
                        backgroundImage: `url(${imagenUrl})`,
                      }}
                      onClick={() =>
                        navigate(`/recetas/${receta.id_receta}`)
                      }
                    />
                  ) : (
                    <div
                      className="bg-light d-flex justify-content-center align-items-center receta-img"
                      onClick={() =>
                        navigate(`/recetas/${receta.id_receta}`)
                      }
                    >
                      <span className="text-muted">📷 Sin imagen</span>
                    </div>
                  )}

                  {/* Contenido */}
                  <Card.Body>
                    <h5
                      className="fw-bold text-primary fs-5 cursor-pointer"
                      onClick={() =>
                        navigate(`/recetas/${receta.id_receta}`)
                      }
                    >
                      {receta.nombre}
                    </h5>

                    <Badge bg="info" className="mb-2">
                      {receta.categoria}
                    </Badge>

                    <Card.Text className="text-muted small">
                      {receta.descripcion?.substring(0, 80) || "Sin descripción"}
                      ...
                    </Card.Text>

                    {/* Botón de eliminar */}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100 mt-2"
                      disabled={removingId === receta.id_receta}
                      onClick={() => removeFavorito(receta.id_receta)}
                    >
                      {removingId === receta.id_receta
                        ? "Eliminando..."
                        : "Eliminar de favoritos"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <style>{`
        .receta-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .receta-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18) !important;
        }

        .receta-img {
          height: 180px;
          background-size: cover;
          background-position: center;
          cursor: pointer;
        }

        .cursor-pointer {
          cursor: pointer;
        }

      `}</style>
    </div>
  );
}
