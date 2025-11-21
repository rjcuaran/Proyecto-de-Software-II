// frontend/src/pages/Recetas/EditarRecetaPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import IngredienteForm from "../../components/ingredientes/IngredienteForm";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";

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

  useEffect(() => {
    const fetchReceta = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/recetas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReceta(res.data);

        if (res.data.imagen) {
          setImagenPreview(`http://localhost:5000/uploads/${res.data.imagen}`);
        }

      } catch (err) {
        setError("No se pudo cargar la receta.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceta();
  }, [id]);

  const handleChange = (e) => {
    setReceta({
      ...receta,
      [e.target.name]: e.target.value,
    });
  };

  const handleIngredientesChange = (lista) => {
    setReceta({
      ...receta,
      ingredientes: lista,
    });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNuevaImagen(file);
    setImagenPreview(URL.createObjectURL(file)); // Vista previa inmediata
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");

      // 🔥 FormData si hay imagen, JSON si no
      let data;

      if (nuevaImagen) {
        data = new FormData();
        data.append("nombre", receta.nombre);
        data.append("categoria", receta.categoria);
        data.append("descripcion", receta.descripcion);
        data.append("preparacion", receta.preparacion);
        data.append("ingredientes", JSON.stringify(receta.ingredientes));
        data.append("imagen", nuevaImagen);
      } else {
        data = {
          nombre: receta.nombre,
          categoria: receta.categoria,
          descripcion: receta.descripcion,
          preparacion: receta.preparacion,
          ingredientes: receta.ingredientes,
        };
      }

      await axios.put(`http://localhost:5000/api/recetas/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(nuevaImagen ? { "Content-Type": "multipart/form-data" } : {})
        },
      });

      setSuccess("Receta actualizada con éxito.");
      setTimeout(() => navigate(`/recetas/${id}`), 1500);

    } catch (err) {
      console.error(err);
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

  if (!receta) return <Alert variant="danger">Receta no encontrada.</Alert>;

  return (
    <div className="container mt-4">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h3 className="fw-bold text-primary">✏️ Editar Receta</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>

            {/* FOTO DE LA RECETA */}
            <div className="text-center mb-4">
              <h5 className="text-secondary">📸 Imagen de la receta</h5>

              {imagenPreview ? (
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  className="rounded shadow"
                  style={{ width: "300px", height: "200px", objectFit: "cover" }}
                />
              ) : (
                <p className="text-muted">No hay imagen cargada.</p>
              )}

              <Form.Group className="mt-3">
                <Form.Label className="fw-semibold">Cambiar imagen</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImagenChange} />
              </Form.Group>
            </div>

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
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                name="categoria"
                value={receta.categoria}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
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
              <Form.Label>Preparación</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="preparacion"
                value={receta.preparacion}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <h5 className="mt-4">🧂 Ingredientes</h5>

            <IngredienteForm
              ingredientes={receta.ingredientes}
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
