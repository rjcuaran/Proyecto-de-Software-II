// frontend/src/pages/Recetas/CrearRecetaPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IngredienteForm from "../../components/ingredientes/IngredienteForm";
import { Card, Button, Form, Alert } from "react-bootstrap";



// ===============================
// Requisitos de imagen (igual a EditarReceta)
// ===============================
const MAX_IMAGE_MB = 5;
const ALLOWED_EXT = [".jpg", ".jpeg", ".png"];



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





// Toggle de categorías (igual a EditarReceta)
const toggleCategoria = (cat) => {
  setReceta((prev) => {
    const actuales = Array.isArray(prev.categoria) ? prev.categoria : [];
    const activa = actuales.includes(cat);

    return {
      ...prev,
      categoria: activa
        ? actuales.filter((c) => c !== cat)
        : [...actuales, cat],
    };
  });
};






  // MANEJAR CATEGORÍAS MULTIPLE SELECT


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


<style>{`
  .categoria-btn{
    border-radius: 999px;
    border: 2px solid var(--color-terciario);
    background: var(--color-quinary);
    color: var(--color-primario);
    padding: 8px 12px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    transition: transform .05s ease, background .15s ease, color .15s ease, border-color .15s ease;
  }
  .categoria-btn:hover{
    transform: translateY(-1px);
  }
  .categoria-btn.activa{
    background: var(--color-primario);
    color: var(--color-quinary);
    border-color: var(--color-primario);
  }

.hint-box{
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border-left: 4px solid var(--color-terciario);
  background: var(--color-quinary);
  color: var(--color-primario);
  font-size: 0.9rem;
  opacity: 0.85;
}


.image-requirements{
  margin-top: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  border-left: 4px solid var(--color-terciario);
  background: var(--color-quinary);
  color: var(--color-primario);
  font-size: 0.9rem;
  opacity: 0.9;
}

.image-requirements b{
  color: var(--color-primario);
  font-weight: 700;
}


.form-section-title{
  color: var(--color-primario);
  font-weight: 700;
}



.crear-receta-card{
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid var(--color-terciario);
  background: linear-gradient(
    180deg,
    var(--color-quinary),
    var(--color-secundario)
  );
}




`}</style>




      <Card className="shadow-lg border-0 crear-receta-card">


        <Card.Body>
          
          <h3
  className="fw-bold"
  style={{ color: "var(--color-primario)" }}
>
  ➕ Crear nueva receta
</h3>


          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            


            {/* FOTO DE LA RECETA */}
            <Form.Group className="mb-3">
              
              
              <Form.Label className="form-section-title">
  Imagen de la receta
</Form.Label>


              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
              />
            </Form.Group>




<div className="image-requirements">
  <strong>Requisitos de la imagen:</strong>
  <br />
  • Formatos permitidos: <b>{ALLOWED_EXT.join(", ")}</b>
  <br />
  • Tamaño máximo: <b>{MAX_IMAGE_MB}MB</b>
  <br />
  • Relación recomendada: <b>16:9</b> (horizontal) para que se vea bien en tarjetas.
  <br />
  • No se aceptan: <b>WEBP, GIF, BMP, TIFF, SVG</b> (u otros formatos).
</div>




            {/* NOMBRE */}
            <Form.Group className="mb-3">
              
              <Form.Label className="form-section-title">
  Nombre de la receta
</Form.Label>

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
  
  <Form.Label className="form-section-title">
  Categorías de la receta
</Form.Label>


  <div className="d-flex flex-wrap gap-2">
    {categorias.map((cat) => {
      const activa = receta.categoria.includes(cat.nombre);

      return (
        <button
          type="button"
          key={cat.id}
          onClick={() => toggleCategoria(cat.nombre)}
          className={`categoria-btn ${activa ? "activa" : ""}`}
          aria-pressed={activa}
        >
          {cat.nombre}
        </button>
      );
    })}
  </div>

  <div className="hint-box">
    Selecciona una o varias categorías haciendo clic en los botones.
  </div>
</Form.Group>










            {/* DESCRIPCIÓN */}
            <Form.Group className="mb-3">
              
              <Form.Label className="form-section-title">
  Descripción
</Form.Label>


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
              
              <Form.Label className="form-section-title">
  Preparación
</Form.Label>


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
            
            <h5 className="mt-4 form-section-title">
  🧂 Ingredientes
</h5>


            <IngredienteForm
              ingredientes={receta.ingredientes}
              onChange={handleIngredientesChange}
            />

            {/* BOTONES */}


<div className="mt-4 d-flex justify-content-between">
  <button
    type="button"
    onClick={() => navigate(-1)}
    style={{
      background: "var(--color-cuaternario)",
      color: "var(--color-primario)",
      border: "2px solid var(--color-terciario)",
      borderRadius: "999px",
      padding: "10px 18px",
      fontWeight: 700,
    }}
  >
    ← Cancelar
  </button>

  <button
    type="submit"
    style={{
      background: "var(--color-primario)",
      color: "var(--color-quinary)",
      border: "2px solid var(--color-primario)",
      borderRadius: "999px",
      padding: "10px 18px",
      fontWeight: 700,
    }}
  >
    Guardar receta
  </button>
</div>



          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}