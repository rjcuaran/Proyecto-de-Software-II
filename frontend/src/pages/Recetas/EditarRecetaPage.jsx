// frontend/src/pages/Recetas/EditarRecetaPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import IngredienteForm from "../../components/ingredientes/IngredienteForm";
import { Card, Form, Alert, Spinner, Row, Col } from "react-bootstrap";

// ===============================
// Normalizador de imágenes
// ===============================
const buildImagenUrl = (imagen) => {
  if (!imagen) return null;

  const normalized = String(imagen).replace(/\\/g, "/");
  const withoutUploads = normalized.includes("/uploads/")
    ? normalized.split("/uploads/").pop()
    : normalized;

  const finalPath = withoutUploads.startsWith("recetas/")
    ? withoutUploads
    : `recetas/${withoutUploads}`;

  return `http://localhost:5000/uploads/${finalPath}`;
};

// ===============================
// Validaciones de imagen
// ===============================
const MAX_IMAGE_MB = 5;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

// Si tu backend solo acepta JPG/PNG, dejamos explícito:
const ALLOWED_MIME = ["image/jpeg", "image/png"]; // jpg, jpeg, png
const ALLOWED_EXT = [".jpg", ".jpeg", ".png"];

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

  const [categorias, setCategorias] = useState([]);



// ===============================
// Cargar categorías dinámicas
// ===============================
useEffect(() => {
  const fetchCategorias = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categorias");
      setCategorias(res.data.categorias || []);
    } catch (err) {
      console.error("❌ Error cargando categorías:", err);
      setCategorias([]);
    }
  };

  fetchCategorias();
}, []);




  const imagenPersistida = useMemo(
    () => (receta?.imagen ? buildImagenUrl(receta.imagen) : null),
    [receta?.imagen]
  );

  // ===============================
  // Cargar receta
  // ===============================
  useEffect(() => {
    const fetchReceta = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:5000/api/recetas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        // Asegurar que categoria sea ARRAY
        let categoriasArray = [];

        if (Array.isArray(data.categoria)) {
          categoriasArray = data.categoria;
        } else if (typeof data.categoria === "string" && data.categoria) {
          // Puede venir como JSON o como texto simple
          try {
            const parsed = JSON.parse(data.categoria);
            categoriasArray = Array.isArray(parsed) ? parsed : [data.categoria];
          } catch {
            categoriasArray = data.categoria
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean);

            if (categoriasArray.length === 0) categoriasArray = [data.categoria];
          }
        }

        const recetaCargada = {
          ...data,
          categoria: categoriasArray,
        };

        setReceta(recetaCargada);
      } catch (err) {
        console.error("❌ Error cargando receta:", err.response?.data || err);
        setError("Error cargando la receta.");
        setReceta(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReceta();
  }, [id]);

  // ===============================
  // Handlers
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceta((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategoria = (cat) => {
    setReceta((prev) => {
      const actuales = Array.isArray(prev?.categoria) ? prev.categoria : [];
      const activa = actuales.includes(cat);

      return {
        ...prev,
        categoria: activa ? actuales.filter((c) => c !== cat) : [...actuales, cat],
      };
    });
  };

  const handleIngredientesChange = (ingredientesActualizados) => {
    setReceta((prev) => ({ ...prev, ingredientes: ingredientesActualizados }));
  };

  const handleImagenChange = (e) => {
    setError(null);
    setSuccess(null);

    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño
    if (file.size > MAX_IMAGE_BYTES) {
      setError(`La imagen supera el límite de ${MAX_IMAGE_MB}MB.`);
      e.target.value = "";
      setNuevaImagen(null);
      setImagenPreview(null);
      return;
    }

    // Validar formato por MIME
    const isAllowedMime = ALLOWED_MIME.includes(file.type);

    // Validar extensión como refuerzo (por si el navegador no pone MIME confiable)
    const nameLower = file.name.toLowerCase();
    const isAllowedExt = ALLOWED_EXT.some((ext) => nameLower.endsWith(ext));

    if (!isAllowedMime || !isAllowedExt) {
      setError(
        `Formato no permitido. Solo se aceptan: ${ALLOWED_EXT.join(", ")}.`
      );
      e.target.value = "";
      setNuevaImagen(null);
      setImagenPreview(null);
      return;
    }

    setNuevaImagen(file);
    setImagenPreview(URL.createObjectURL(file));
  };




const validarReceta = ({ receta, nuevaImagen }) => {
  const errores = [];

  // Imagen (en editar: sirve la actual o una nueva)
  if (!receta?.imagen && !nuevaImagen) {
    errores.push("Debes agregar una imagen de la receta.");
  }

  // Campos obligatorios
  if (!receta?.nombre?.trim()) {
    errores.push("El nombre de la receta es obligatorio.");
  }

  if (!Array.isArray(receta?.categoria) || receta.categoria.length === 0) {
    errores.push("Debes seleccionar al menos una categoría.");
  }

  if (!receta?.descripcion?.trim()) {
    errores.push("La descripción es obligatoria.");
  }

  if (!receta?.preparacion?.trim()) {
    errores.push("La preparación es obligatoria.");
  }

  // Ingredientes: mínimo 1 y completos
  if (!Array.isArray(receta?.ingredientes) || receta.ingredientes.length === 0) {
    errores.push("Debes agregar al menos un ingrediente.");
  } else {
    receta.ingredientes.forEach((ing, idx) => {
      const n = idx + 1;

      const nombreOk = String(ing?.nombre || "").trim().length > 0;
      const cantidadOk =
        ing?.cantidad !== null &&
        ing?.cantidad !== undefined &&
        String(ing.cantidad).trim() !== "";
      const unidadOk = String(ing?.unidad_medida || "").trim().length > 0;

      if (!nombreOk || !cantidadOk || !unidadOk) {
        errores.push(
          `Ingrediente #${n} incompleto: completa nombre, cantidad y unidad de medida.`
        );
      }
    });
  }

  return errores;
};





  // ===============================
  // Guardar cambios
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);



const erroresValidacion = validarReceta({ receta, nuevaImagen });

if (erroresValidacion.length > 0) {
  setError(erroresValidacion);
  setSaving(false);
  return;
}




    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("nombre", receta.nombre);
      data.append("categoria", JSON.stringify(receta.categoria || []));
      data.append("descripcion", receta.descripcion);
      data.append("preparacion", receta.preparacion);
      data.append("ingredientes", JSON.stringify(receta.ingredientes || []));

      // Mantener imagen si no fue cambiada
      if (receta.imagen) data.append("imagenActual", receta.imagen);

      // Nueva imagen si aplica
      if (nuevaImagen) data.append("imagen", nuevaImagen);

      const res = await axios.put(`http://localhost:5000/api/recetas/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedId = res?.data?.id || id;

      setSuccess("Receta actualizada con éxito.");
      setTimeout(() => navigate(`/recetas/${updatedId}`), 900);
    } catch (err) {
      console.error("❌ Error actualizando la receta:", err.response?.data || err);
      setError(err.response?.data?.mensaje || "Error actualizando la receta.");
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // Render
  // ===============================
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando receta...</p>
      </div>
    );
  }

  if (!receta) return <Alert variant="danger">Receta no encontrada.</Alert>;

  return (
    <div className="container mt-4 editar-receta-wrapper">
      {/* Estilos internos usando variables CSS dinámicas */}
      <style>{`
        .editar-receta-wrapper{
          padding-bottom: 30px;
        }

        .editar-receta-card{
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid var(--color-terciario);
          background: linear-gradient(180deg, var(--color-quinary), var(--color-secundario));
        }

        .editar-receta-title{
          color: var(--color-primario);
        }

        .editar-receta-subtext{
          color: rgba(0,0,0,0.65);
        }

        .editar-receta-label{
          font-weight: 700;
          color: var(--color-primario);
        }

        .editar-receta-input{
          border-radius: 12px !important;
          border: 1px solid rgba(0,0,0,0.15) !important;
        }
        .editar-receta-input:focus{
          border-color: var(--color-terciario) !important;
          box-shadow: 0 0 0 0.2rem rgba(255, 192, 0, 0.25) !important;
        }

        .img-preview{
          width: 220px;
          height: 140px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px solid var(--color-terciario);
          background: var(--color-quinary);
        }

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
          background: rgba(255, 255, 255, 0.75);
          color: rgba(0,0,0,0.7);
          font-size: 0.9rem;
        }

        .actions-bar{
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .btn-dynamic{
          border: none;
          border-radius: 999px;
          padding: 10px 16px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .05s ease, filter .15s ease;
          min-width: 180px; /* tamaño consistente */
        }
        .btn-dynamic:active{
          transform: translateY(1px);
        }

        .btn-cancel{
          background: var(--color-cuaternario);
          color: var(--color-primario);
          border: 2px solid var(--color-terciario);
        }
        .btn-cancel:hover{
          filter: brightness(0.98);
        }

        .btn-save{
          background: var(--color-primario);
          color: var(--color-quinary);
          border: 2px solid var(--color-primario);
        }
        .btn-save:hover{
          filter: brightness(1.05);
        }
        .btn-save[disabled]{
          opacity: 0.7;
          cursor: not-allowed;
          filter: none;
        }

        .section-title{
          color: var(--color-primario);
          font-weight: 900;
        }
      `}</style>

      <Card className="shadow-lg border-0 editar-receta-card">
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">
            <div>
              <h3 className="fw-bold mb-1 editar-receta-title">✏️ Editar Receta</h3>
              <p className="mb-0 small editar-receta-subtext">
                Ajusta la información. Si no cambias la imagen, se mantiene la actual.
              </p>
            </div>

            {imagenPersistida && (
              <div className="text-center">
                <span className="small d-block mb-1 editar-receta-subtext">
                  Imagen actual
                </span>
                <img
                  src={imagenPreview || imagenPersistida}
                  alt={receta.nombre}
                  className="img-preview"
                />
              </div>
            )}
          </div>

          {error && (
  <Alert variant="danger" style={{ whiteSpace: "pre-line" }}>
    {Array.isArray(error) ? (
      <ul className="mb-0">
        {error.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    ) : (
      error
    )}
  </Alert>
)}




          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Row className="g-3">
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label className="editar-receta-label">Nombre</Form.Label>
                  <Form.Control
                    className="editar-receta-input"
                    type="text"
                    name="nombre"
                    value={receta.nombre || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="editar-receta-label">Categorías</Form.Label>

                  <div className="d-flex flex-wrap gap-2">
                    
                    
{categorias.map((cat) => {
  const activa = (receta.categoria || []).includes(cat.nombre);

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
                    Selecciona una o varias categorías. (No necesitas CTRL; aquí se
                    marca con botones.)
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="editar-receta-label">Descripción</Form.Label>
                  <Form.Control
                    className="editar-receta-input"
                    as="textarea"
                    name="descripcion"
                    rows={3}
                    value={receta.descripcion || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="editar-receta-label">Preparación</Form.Label>
                  <Form.Control
                    className="editar-receta-input"
                    as="textarea"
                    name="preparacion"
                    rows={6}
                    value={receta.preparacion || ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group className="mb-2">
                  <Form.Label className="editar-receta-label">Cambiar imagen</Form.Label>
                  <Form.Control
                    className="editar-receta-input"
                    type="file"
                    accept={ALLOWED_MIME.join(",")}
                    onChange={handleImagenChange}
                  />
                </Form.Group>

                <div className="hint-box">
                  <strong>Requisitos de la imagen:</strong>
                  <br />
                  • Formatos permitidos: <b>{ALLOWED_EXT.join(", ")}</b>
                  <br />
                  • Tamaño máximo: <b>{MAX_IMAGE_MB}MB</b>
                  <br />
                  • Relación recomendada: <b>16:9</b> (horizontal) para que se vea
                  bien en tarjetas.
                  <br />
                  • No se aceptan: <b>WEBP, GIF, BMP, TIFF, SVG</b> (u otros formatos).
                </div>
              </Col>
            </Row>

            <hr className="my-4" />

            <h5 className="mb-3 section-title">🧂 Ingredientes</h5>

            <IngredienteForm
              ingredientesIniciales={receta.ingredientes || []}
              onChange={handleIngredientesChange}
            />

            <div className="actions-bar">
              <button
                type="button"
                className="btn-dynamic btn-cancel"
                onClick={() => navigate(-1)}
              >
                ← Cancelar
              </button>

              <button
                type="submit"
                className="btn-dynamic btn-save"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
