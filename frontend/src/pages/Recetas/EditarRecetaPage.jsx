// frontend/src/pages/Recetas/EditarRecetaPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import IngredienteForm from "../../components/ingredientes/IngredienteForm";
import { Card, Button, Form, Alert, Spinner, Row, Col } from "react-bootstrap";

// Normalizador de imágenes
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

  // Lista oficial de categorías
  const categoriasOficiales = [
    "Panadería",
    "Repostería",
    "Postres",
    "Desayunos",
    "Entradas",
    "Platos principales",
    "Sopas y cremas",
    "Acompañamientos",
    "Bebidas",
    "Comida saludable",
    "Vegano / Vegetariano",
    "Internacional",
    "Salsas",
    "Especiales",
  ];

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

  // Cargar receta
  useEffect(() => {
    const fetchReceta = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/recetas/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data;

        // Asegurar que la categoría sea un ARRAY
        let categoriasArray = [];

        if (Array.isArray(data.categoria)) {
          categoriasArray = data.categoria;
        } else if (typeof data.categoria === "string" && data.categoria) {
          // Puede venir como JSON o como texto simple
          try {
            const parsed = JSON.parse(data.categoria);
            if (Array.isArray(parsed)) {
              categoriasArray = parsed;
            } else {
              categoriasArray = [data.categoria];
            }
          } catch {
            categoriasArray = data.categoria
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean);

            if (categoriasArray.length === 0) {
              categoriasArray = [data.categoria];
            }
          }
        }

        const recetaCargada = {
          ...data,
          categoria: categoriasArray,
        };

        setReceta(recetaCargada);
        setImagenPreview(buildImagenUrl(recetaCargada.imagen));
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
    const { name, value } = e.target;
    setReceta((prev) => ({ ...prev, [name]: value }));
  };

  // Controlador de categorías (multiple select)
  const handleCategoriasChange = (e) => {
    const seleccionadas = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setReceta((prev) => ({ ...prev, categoria: seleccionadas }));
  };

  const handleIngredientesChange = (lista) => {
    setReceta((prev) => ({ ...prev, ingredientes: lista }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNuevaImagen(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("nombre", receta.nombre);
      // Enviar categorías como JSON (array)
      data.append("categoria", JSON.stringify(receta.categoria || []));
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

      const res = await axios.put(
        `http://localhost:5000/api/recetas/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedId = res?.data?.id || id;

      setSuccess("Receta actualizada con éxito.");
      setTimeout(() => {
        navigate(`/recetas/${updatedId}`);
      }, 1200);
    } catch (err) {
      console.error(
        "❌ Error actualizando la receta:",
        err.response?.data || err
      );
      setError(
        err.response?.data?.mensaje || "Error actualizando la receta."
      );
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
                Ajusta la información. Si no cambias la imagen, se mantiene la
                actual.
              </p>
            </div>

            {imagenPersistida && (
              <div className="text-center">
                <span className="small d-block mb-1">Imagen actual</span>
                <img
                  src={imagenPreview || imagenPersistida}
                  alt={receta.nombre}
                  style={{
                    width: "220px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Row className="g-3">
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={receta.nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categorías</Form.Label>
                  <Form.Control
                    as="select"
                    multiple
                    value={receta.categoria || []}
                    onChange={handleCategoriasChange}
                  >
                    {categoriasOficiales.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Text className="text-muted">
                    Mantén presionada CTRL (o CMD en Mac) para seleccionar
                    varias.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="descripcion"
                    rows={3}
                    value={receta.descripcion}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Preparación</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="preparacion"
                    rows={5}
                    value={receta.preparacion}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Cambiar imagen</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                  />
                  <Form.Text className="text-muted">
                    Si no seleccionas una nueva, se mantiene la actual.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <h5 className="mb-3">🧂 Ingredientes</h5>
            <IngredienteForm
              ingredientesIniciales={receta.ingredientes || []}
              onChange={handleIngredientesChange}
            />

            <div className="mt-4 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                ← Cancelar
              </Button>

              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
