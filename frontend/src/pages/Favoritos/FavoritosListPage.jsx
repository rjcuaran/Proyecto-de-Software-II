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

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/favoritos", {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Cargando favoritos...</p>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-warning">⭐ Mis Favoritos</h2>
        <Button variant="primary" onClick={() => navigate("/recetas")}>Ir al recetario</Button>
      </div>

      {favoritos.length === 0 ? (
        <Alert variant="info">Aún no tienes recetas marcadas como favoritas.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
          {favoritos.map((receta) => {
            const imagenUrl = buildImagenUrl(receta.imagen);
            return (
              <Col key={receta.id_receta}>
                <Card
                  className="border-0 shadow-sm rounded-4 overflow-hidden receta-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/recetas/${receta.id_receta}`)}
                >
                  {imagenUrl ? (
                    <div className="receta-img-wrapper">
                      <Card.Img
                        variant="top"
                        src={imagenUrl}
                        className="receta-img"
                        alt={receta.nombre}
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
                        variant="outline-secondary"
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
            );
          })}
        </Row>
      )}

      <style>{`
        .receta-img-wrapper {
          height: 180px;
          overflow: hidden;
        }

        .receta-img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          transition: transform .35s ease;
        }

        .receta-card:hover .receta-img {
          transform: scale(1.05);
        }

        .receta-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </div>
  );
}
