// frontend/src/components/IngredienteForm.js
import React, { useState } from "react";

const unidadesMedida = [
  "gramos",
  "mililitros",
  "pizcas",
  "cucharadas de postre",
  "tazas",
];

const IngredienteForm = ({ onChange }) => {
  const [ingredientes, setIngredientes] = useState([
    { nombre: "", cantidad: "", unidad_medida: "" },
  ]);

  // 🧮 Maneja los cambios en cada campo
  const handleChange = (index, field, value) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index][field] = value;
    setIngredientes(nuevosIngredientes);
    onChange(nuevosIngredientes); // Envía cambios al componente padre
  };

  // ➕ Agregar un nuevo ingrediente vacío
  const agregarIngrediente = () => {
    setIngredientes([
      ...ingredientes,
      { nombre: "", cantidad: "", unidad_medida: "" },
    ]);
  };

  // ❌ Eliminar ingrediente específico
  const eliminarIngrediente = (index) => {
    const nuevosIngredientes = ingredientes.filter((_, i) => i !== index);
    setIngredientes(nuevosIngredientes);
    onChange(nuevosIngredientes);
  };

  // 🧾 Validar que todos los campos estén completos
  const validarIngredientes = () => {
    return ingredientes.every(
      (ing) => ing.nombre && ing.cantidad && ing.unidad_medida
    );
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        🧂 Ingredientes
      </h3>

      {ingredientes.map((ingrediente, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-3 mb-3 items-center"
        >
          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre del ingrediente"
            value={ingrediente.nombre}
            onChange={(e) =>
              handleChange(index, "nombre", e.target.value)
            }
            className="col-span-5 p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />

          {/* Cantidad */}
          <input
            type="number"
            placeholder="Cantidad"
            value={ingrediente.cantidad}
            onChange={(e) =>
              handleChange(index, "cantidad", e.target.value)
            }
            className="col-span-3 p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />

          {/* Unidad de medida */}
          <select
            value={ingrediente.unidad_medida}
            onChange={(e) =>
              handleChange(index, "unidad_medida", e.target.value)
            }
            className="col-span-3 p-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="">Selecciona unidad</option>
            {unidadesMedida.map((unidad) => (
              <option key={unidad} value={unidad}>
                {unidad}
              </option>
            ))}
          </select>

          {/* Botón eliminar */}
          <button
            type="button"
            onClick={() => eliminarIngrediente(index)}
            className="col-span-1 text-red-500 hover:text-red-700 text-xl"
          >
            ✖
          </button>
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={agregarIngrediente}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
        >
          + Agregar ingrediente
        </button>

        {!validarIngredientes() && (
          <p className="text-sm text-red-500">
            ⚠️ Completa todos los campos antes de continuar
          </p>
        )}
      </div>
    </div>
  );
};

export default IngredienteForm;
