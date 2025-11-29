// frontend/src/components/ingredientes/IngredienteForm.jsx
import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col, Spinner } from "react-bootstrap";

export default function IngredienteForm({
  ingredientesIniciales = [],
  ingredientes, // por compatibilidad con versiones anteriores
  onChange,
}) {
  // Lista de unidades "bonita"
  const unidadesMedida = [
    "Unidades",
    "Gramos",
    "Mililitros",
    "Pizcas",
    "Cucharadas",
    "Cucharaditas",
    "Tazas",
    "Onzas",
  ];

  // Decide de dónde tomar los iniciales
  const iniciales =
    (ingredientesIniciales && ingredientesIniciales.length > 0
      ? ingredientesIniciales
      : ingredientes) || [];

  const [lista, setLista] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Resultados de búsqueda por fila
  const [searchResults, setSearchResults] = useState({});
  const [loadingRow, setLoadingRow] = useState(null);

  // =========================
  //   Inicializar ingredientes
  // =========================
  useEffect(() => {
    if (initialized) return;

    if (iniciales && iniciales.length > 0) {
      const normalizados = iniciales.map((ing) => ({
        nombre: ing.nombre || "",
        cantidad:
          ing.cantidad !== null && ing.cantidad !== undefined
            ? ing.cantidad
            : "",
        unidad_medida: ing.unidad_medida || "",
      }));
      setLista(normalizados);
    } else {
      setLista([{ nombre: "", cantidad: "", unidad_medida: "" }]);
    }

    setInitialized(true);
  }, [iniciales, initialized]);

  // Notificar cambios al padre
  const notifyParent = (nuevaLista) => {
    if (typeof onChange === "function") {
      onChange(nuevaLista);
    }
  };

  const handleChange = (index, campo, valor) => {
    setLista((prev) => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [campo]: valor };
      notifyParent(copia);

      // Cuando se escribe en el nombre: buscar sugerencias
      if (campo === "nombre") {
        buscarIngredientes(index, valor);
      }

      return copia;
    });
  };

  // =========================
  //   Buscar ingredientes (autocompletar)
  // =========================
  const buscarIngredientes = async (index, texto) => {
    const term = (texto || "").trim();

    if (!term) {
      setSearchResults((prev) => ({ ...prev, [index]: [] }));
      return;
    }

    setLoadingRow(index);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `/api/ingredientes/buscar?q=${encodeURIComponent(term)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data && data.success && Array.isArray(data.data)) {
        setSearchResults((prev) => ({ ...prev, [index]: data.data }));
      } else {
        setSearchResults((prev) => ({ ...prev, [index]: [] }));
      }
    } catch (error) {
      console.error("Error buscando ingredientes:", error);
      setSearchResults((prev) => ({ ...prev, [index]: [] }));
    }

    setLoadingRow(null);
  };

  // =========================
  //   Sugerir ingrediente
  // =========================
  const sugerirIngrediente = async (index, nombre) => {
    const term = (nombre || "").trim();
    if (!term) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/ingredientes/sugerir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: term }),
      });

      const data = await res.json();

      if (data && data.success) {
        // Dejamos el nombre tal cual y cerramos las sugerencias
        handleChange(index, "nombre", term);
        setSearchResults((prev) => ({ ...prev, [index]: [] }));
      } else {
        console.error("Error al sugerir ingrediente:", data);
      }
    } catch (error) {
      console.error("Error sugiriendo ingrediente:", error);
    }
  };

  // =========================
  //   Agregar / Eliminar filas
  // =========================
  const agregarIngrediente = () => {
    setLista((prev) => {
      const nuevaLista = [
        ...prev,
        { nombre: "", cantidad: "", unidad_medida: "" },
      ];
      notifyParent(nuevaLista);
      return nuevaLista;
    });
  };

  const eliminarIngrediente = (index) => {
    setLista((prev) => {
      let nuevaLista;

      if (prev.length === 1) {
        nuevaLista = [{ nombre: "", cantidad: "", unidad_medida: "" }];
      } else {
        nuevaLista = prev.filter((_, i) => i !== index);
      }

      notifyParent(nuevaLista);
      return nuevaLista;
    });
  };

  // =========================
  //   Render
  // =========================
  return (
    <div>
      {lista.map((ing, index) => (
        <div key={index} className="mb-3">
          <Row className="g-2 align-items-end">
            {/* Nombre */}
            <Col md={5}>
              <Form.Label>Ingrediente</Form.Label>
              <Form.Control
                type="text"
                value={ing.nombre}
                onChange={(e) =>
                  handleChange(index, "nombre", e.target.value)
                }
                placeholder="Ej: Harina de trigo"
              />
            </Col>

            {/* Cantidad */}
            <Col md={3}>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="text"
                value={ing.cantidad}
                onChange={(e) =>
                  handleChange(index, "cantidad", e.target.value)
                }
                placeholder="Ej: 100"
              />
            </Col>

            {/* Unidad */}
            <Col md={3}>
              <Form.Label>Unidad</Form.Label>
              <Form.Select
                value={ing.unidad_medida}
                onChange={(e) =>
                  handleChange(index, "unidad_medida", e.target.value)
                }
              >
                <option value="">Selecciona unidad</option>
                {unidadesMedida.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Botón eliminar */}
            <Col md={1} className="text-end">
              <Button
                variant="danger"
                size="sm"
                onClick={() => eliminarIngrediente(index)}
              >
                ✕
              </Button>
            </Col>
          </Row>

          {/* Bloque de sugerencias – ahora EMPUJA el contenido (no tapa la fila de abajo) */}
          <div className="mt-1">
            {loadingRow === index && (
              <div className="small text-muted d-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" /> Buscando ingredientes...
              </div>
            )}

            {searchResults[index] && searchResults[index].length > 0 && (
              <div
                className="border rounded bg-white p-2 mt-1"
                style={{
                  fontSize: "0.85rem",
                  maxHeight: "160px",
                  overflowY: "auto",
                }}
              >
                <div className="fw-semibold mb-1">Coincidencias:</div>
                {searchResults[index].map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    className="py-1 px-2 rounded hover-bg-light"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleChange(index, "nombre", item.nombre)
                    }
                  >
                    {item.nombre}
                    {item.aprobado ? "" : " (Pendiente)"}
                  </div>
                ))}
              </div>
            )}

            {/* Mensaje + Sugerir ingrediente */}
            <div className="small text-muted mt-1">
              {(!searchResults[index] ||
                searchResults[index].length === 0) &&
                ing.nombre.trim() !== "" && (
                  <>
                    No se encontraron ingredientes.{" "}
                    <span
                      role="button"
                      style={{
                        color: "#0d6efd",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => sugerirIngrediente(index, ing.nombre)}
                    >
                      Sugerir ingrediente: {ing.nombre}
                    </span>
                  </>
                )}
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline-primary" size="sm" onClick={agregarIngrediente}>
        + Agregar ingrediente
      </Button>
    </div>
  );
}
