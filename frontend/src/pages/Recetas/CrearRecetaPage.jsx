// frontend/src/pages/Recetas/CrearRecetaPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IngredienteForm from "../../components/ingredientes/IngredienteForm";
import { Card, Button, Form, Alert } from "react-bootstrap";

export default function CrearRecetaPage() {
  const navigate = useNavigate();

  const [receta, setReceta] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    preparacion: "",
    ingredientes: [],
  });

  const [imagen, setImagen] = useState(null); // <-- FOTO
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setReceta({
      ...receta,
      [e.target.name]: e.target.value,
    });
  };

  const handleIngredientesChange = (listaIngredientes) => {
    setReceta({
      ...receta,
      ingredientes: listaIngredientes,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");

      // FormData para enviar archivos
      const formData = new FormData();
      formData.append("nombre", receta.nombre);
      formData.append("categoria", receta.categoria);
      formData.append("descripcion", receta.descripcion);
      formData.append("preparacion", receta.preparacion);

      // Imagen
      if (imagen) {
        formData.append("imagen", imagen);
      }

      // Ingredientes convertidos a JSON
      formData.append("ingredientes", JSON.stringify(receta.ingredientes));

      const res = await axios.post(
        "http://localhost:5000/api/recetas",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Receta creada exitosamente");
      setTimeout(() => navigate("/recetas"), 1500);
    } catch (err) {
      console.error("❌ Error creando receta:", err);
      setError("No se pudo crear la receta.");
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-lg border-0">
        <Card.Body>
          <h3 className="fw-bold text-primary">➕ Crear nueva receta</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* FOTO DE LA RECETA */}
            <Form.Group className="mb-3">
              <Form.Label>Imagen de la receta</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre de la receta</Form.Label>
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
                name="descripcion"
                rows={2}
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

            <h5 className="mt-4">🧂 Ingredientes</h5>
            <IngredienteForm
              ingredientes={receta.ingredientes}
              onChange={handleIngredientesChange}
            />

            <div className="mt-4 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                ← Cancelar
              </Button>

              <Button variant="primary" type="submit">
                Guardar receta
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
