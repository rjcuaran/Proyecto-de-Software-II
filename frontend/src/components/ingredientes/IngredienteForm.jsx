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

  // ✅ Notificar siempre al padre cuando cambie el arreglo
  useEffect(() => {
    if (typeof onChange === "function") {
      onChange(ingredientes);
    }
  }, [ingredientes, onChange]);

  const handleChange = (index, campo, valor) => {
    setIngredientes((prev) => {
      const copia = [...prev];
      copia[index] = {
        ...copia[index],
        [campo]: valor,
      };
      return copia;
    });
  };

  const agregarIngrediente = () => {
    setIngredientes((prev) => [
      ...prev,
      { nombre: "", cantidad: "", unidad_medida: "" },
    ]);
  };

  const eliminarIngrediente = (index) => {
    setIngredientes((prev) => {
      if (prev.length === 1) {
        // Siempre dejamos al menos una fila
        return [{ nombre: "", cantidad: "", unidad_medida: "" }];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div>
      {ingredientes.map((ing, index) => (
        <Row key={index} className="mb-3 g-2">
          <Col md={5}>
            <Form.Label>Ingrediente</Form.Label>
            <Form.Control
              type="text"
              value={ing.nombre}
              onChange={(e) => handleChange(index, "nombre", e.target.value)}
              placeholder="Ej: Harina de trigo"
            />
          </Col>

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

      <Button variant="success" className="mt-2" onClick={agregarIngrediente}>
        ➕ Agregar ingrediente
      </Button>
    </div>
  );
}
