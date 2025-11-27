// frontend/src/components/ingredientes/IngredienteForm.jsx
import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";

export default function IngredienteForm({
  ingredientesIniciales = [],
  onChange,
}) {
  // 🔥 Unidades con formato premium
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

  // Estado interno de los ingredientes
  const [ingredientes, setIngredientes] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // ✅ Inicializar SOLO una vez a partir de `ingredientesIniciales`
  useEffect(() => {
    if (initialized) return;

    if (ingredientesIniciales && ingredientesIniciales.length > 0) {
      const normalizados = ingredientesIniciales.map((ing) => ({
        nombre: ing.nombre || "",
        cantidad:
          ing.cantidad !== null && ing.cantidad !== undefined
            ? ing.cantidad
            : "",
        unidad_medida: ing.unidad_medida || "",
      }));
      setIngredientes(normalizados);
    } else {
      // Si no hay ingredientes aún, empezamos con 1 fila vacía
      setIngredientes([{ nombre: "", cantidad: "", unidad_medida: "" }]);
    }

    setInitialized(true);
  }, [ingredientesIniciales, initialized]);

  /* 
    ⚠️ IMPORTANTE:
    Eliminamos el useEffect que notificaba cambios constantemente.
    Ahora SOLO notificamos al padre cuando el usuario ACTÚA:
      ➤ escribe
      ➤ agrega ingrediente
      ➤ elimina ingrediente
  */

  const handleChange = (index, campo, valor) => {
    setIngredientes((prev) => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [campo]: valor };

      // 🔥 Notificar al padre SOLO cuando hay cambios reales
      if (typeof onChange === "function") onChange(copia);

      return copia;
    });
  };

  const agregarIngrediente = () => {
    setIngredientes((prev) => {
      const nuevaLista = [
        ...prev,
        { nombre: "", cantidad: "", unidad_medida: "" },
      ];

      if (typeof onChange === "function") onChange(nuevaLista);

      return nuevaLista;
    });
  };

  const eliminarIngrediente = (index) => {
    setIngredientes((prev) => {
      let nuevaLista;

      if (prev.length === 1) {
        // Siempre dejamos al menos una fila
        nuevaLista = [{ nombre: "", cantidad: "", unidad_medida: "" }];
      } else {
        nuevaLista = prev.filter((_, i) => i !== index);
      }

      if (typeof onChange === "function") onChange(nuevaLista);

      return nuevaLista;
    });
  };

  return (
    <div>
      {ingredientes.map((ing, index) => (
        <Row key={index} className="mb-3 g-2">
          {/* Nombre */}
          <Col md={5}>
            <Form.Label>Ingrediente</Form.Label>
            <Form.Control
              type="text"
              value={ing.nombre}
              onChange={(e) => handleChange(index, "nombre", e.target.value)}
              placeholder="Ej: Harina de trigo"
            />
          </Col>

          {/* Cantidad */}
          <Col md={3}>
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              value={ing.cantidad}
              onChange={(e) => handleChange(index, "cantidad", e.target.value)}
              placeholder="Ej: 100"
            />
          </Col>

          {/* Unidad de medida */}
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
          <Col md={1} className="d-flex align-items-end">
            <Button
              variant="outline-danger"
              onClick={() => eliminarIngrediente(index)}
            >
              ✖
            </Button>
          </Col>
        </Row>
      ))}

      {/* Botón agregar nuevo ingrediente */}
      <Button variant="success" className="mt-2" onClick={agregarIngrediente}>
        ➕ Agregar ingrediente
      </Button>
    </div>
  );
}
