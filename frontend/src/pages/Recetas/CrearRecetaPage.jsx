// frontend/src/pages/Recetas/CrearRecetaPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IngredienteForm from "../../components/ingredientes/IngredienteForm";
import { Card, Button, Form, Alert } from "react-bootstrap";

export default function CrearRecetaPage() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);



  const [receta, setReceta] = useState({
    nombre: "",
    categoria: [], // ← ahora es un ARREGLO
    descripcion: "",
    preparacion: "",
    ingredientes: [],
  });

  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);




React.useEffect(() => {
  const cargarCategorias = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/categorias",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

setCategorias(res.data.categorias);

    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  cargarCategorias();
}, []);






  const handleChange = (e) => {
    setReceta({
      ...receta,
      [e.target.name]: e.target.value,
    });
  };

  // MANEJAR CATEGORÍAS MULTIPLE SELECT
  const handleCategoriasChange = (e) => {
    const seleccionadas = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    setReceta({ ...receta, categoria: seleccionadas });
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

      const formData = new FormData();
      formData.append("nombre", receta.nombre);

      // Enviar categorías como JSON
      formData.append("categoria", JSON.stringify(receta.categoria));

      formData.append("descripcion", receta.descripcion);
      formData.append("preparacion", receta.preparacion);

      if (imagen) {
        formData.append("imagen", imagen);
      }

      formData.append("ingredientes", JSON.stringify(receta.ingredientes));

      await axios.post("http://localhost:5000/api/recetas", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

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

            {/* NOMBRE */}
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

            {/* CATEGORÍAS MULTIPLES */}
            <Form.Group className="mb-3">
              <Form.Label>Categorías de la receta</Form.Label>
              <Form.Select
                multiple
                name="categoria"
                value={receta.categoria}
                onChange={handleCategoriasChange}
                required
              >              
{categorias.map((cat) => (
  <option key={cat.id} value={cat.nombre}>
    {cat.nombre}
  </option>
))}
              </Form.Select>
              <Form.Text className="text-muted">
                Mantén presionada la tecla CTRL (o CMD en Mac) para seleccionar varias categorías.
              </Form.Text>
            </Form.Group>

            {/* DESCRIPCIÓN */}
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

            {/* PREPARACIÓN */}
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

            {/* INGREDIENTES */}
            <h5 className="mt-4">🧂 Ingredientes</h5>
            <IngredienteForm
              ingredientes={receta.ingredientes}
              onChange={handleIngredientesChange}
            />

            {/* BOTONES */}
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