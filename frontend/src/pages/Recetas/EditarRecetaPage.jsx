// frontend/src/pages/Recetas/EditarRecetaPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import IngredienteForm from "../../components/ingredientes/IngredienteForm";
import { Card, Button, Form, Alert, Spinner, Row, Col } from "react-bootstrap";

// 🔧 Normalizador de imágenes
const buildImagenUrl = (imagen) => {
  if (!imagen) return null;

  const normalized = imagen.replace(/\\/g, "/");
  const withoutUploads = normalized.includes("/uploads/")
    ? normalized.split("/uploads/").pop()
    : normalized;

  const finalPath = withoutUploads.startsWith("recetas/")
    ? withoutUploads
    : `recetas/${withoutUploads}`;

  return `http://localhost:5000/uploads/${finalPath}`;
};

export default function EditarRecetaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [imagenPreview, setImagenPreview] = useState(null);
  const [nuevaImagen, setNuevaImagen] = useState(null);

  const imagenPersistida = useMemo(
    () => (receta?.imagen ? buildImagenUrl(receta.imagen) : null),
    [receta?.imagen]
  );

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
        setImagenPreview(buildImagenUrl(res.data.imagen));
      } catch (err) {
        console.error("❌ Error cargando receta:", err);
        setError("No se pudo cargar la receta.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceta();
  }, [id]);

  const handleChange = (e) => {
    setReceta({ ...receta, [e.target.name]: e.target.value });
  };

  const handleIngredientesChange = (lista) => {
    setReceta({ ...receta, ingredientes: lista });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNuevaImagen(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  // 📌 Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("nombre", receta.nombre);
      data.append("categoria", receta.categoria);
      data.append("descripcion", receta.descripcion);
      data.append("preparacion", receta.preparacion);
      data.append("ingredientes", JSON.stringify(receta.ingredientes || []));

      // Mantener imagen si no fue cambiada
      if (receta.imagen) {
        data.append("imagenActual", receta.imagen);
      }

      // Nueva imagen si aplica
      if (nuevaImagen) {
        data.append("imagen", nuevaImagen);
      }

      // 🔥 Actualizar receta
      await axios.put(`http://localhost:5000/api/recetas/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Receta actualizada con éxito.");

      // 🔥 Navegación FORZADA al detalle con refresco garantizado
      navigate(`/recetas/${id}?updated=${Date.now()}`, {
        replace: true,
      });
    } catch (err) {
      console.error("❌ Error actualizando la receta:", err);
      setError("Error actualizando la receta.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando receta...</p>
      </div>
    );

  if (!receta)
    return <Alert variant="danger">Receta no encontrada.</Alert>;

  return (
    <div className="container mt-4 editar-receta-wrapper">
      <Card className="shadow-lg border-0 editar-receta-card">
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <div>
              <h3 className="fw-bold text-primary mb-1">✏️ Editar Receta</h3>
              <p className="text-muted mb-0 small">
                Ajusta la información. Si no cambias la imagen, se mantiene la actual.
              </p>
            </div>

            <Button
              variant="outline-secondary"
              onClick={() => navigate(-1)}
              size="sm"
            >
              ← Volver
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col xs={12} lg={7}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={receta.nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Categoría</Form.Label>
                  <Form.Control
                    type="text"
                    name="categoria"
                    value={receta.categoria}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="descripcion"
                    value={receta.descripcion}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Preparación</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="preparacion"
                    value={receta.preparacion}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} lg={5}>
                <div className="text-center mb-2">
                  <h5 className="text-secondary mb-3">📸 Imagen actual</h5>

                  {imagenPreview ? (
                    <div className="editar-imagen-preview-wrapper mb-2">
                      <img
                        src={imagenPreview}
                        alt="Vista previa"
                        className="editar-imagen-preview rounded"
                      />
                    </div>
                  ) : (
                    <div className="editar-imagen-placeholder mb-2">
                      <span className="text-muted">📷 Sin imagen</span>
                    </div>
                  )}

                  <Form.Group className="mt-3 text-start">
                    <Form.Label className="fw-semibold">
                      Cambiar imagen
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImagenChange}
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>

            {/* 🧂 Ingredientes */}
            <div className="mt-4">
              <h5 className="fw-semibold mb-2">🧂 Ingredientes</h5>

              <IngredienteForm
                ingredientesIniciales={receta.ingredientes || []}
                onChange={handleIngredientesChange}
              />
            </div>

            <div className="mt-4 d-flex justify-content-between gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => navigate(-1)}
                type="button"
              >
                ← Cancelar
              </Button>

              <Button
                variant="primary"
                type="submit"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <style>{`
        .editar-receta-card {
          border-radius: 16px;
        }
        .editar-imagen-preview-wrapper {
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 14px 35px rgba(15, 23, 42, 0.2);
        }
        .editar-imagen-preview {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }
        .editar-imagen-placeholder {
          width: 100%;
          max-width: 320px;
          height: 220px;
          margin: 0 auto;
          border-radius: 16px;
          border: 2px dashed #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
}
