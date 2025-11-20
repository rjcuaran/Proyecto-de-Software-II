// frontend/src/pages/CrearRecetaPage.js
import React, { useState } from "react";
import axios from "axios";
import IngredienteForm from "../components/IngredienteForm";

const CrearRecetaPage = () => {
  const [receta, setReceta] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    preparacion: "",
  });

  const [ingredientes, setIngredientes] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setReceta({
      ...receta,
      [e.target.name]: e.target.value,
    });
  };

  const handleIngredientesChange = (nuevosIngredientes) => {
    setIngredientes(nuevosIngredientes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas antes de enviar
    if (
      !receta.nombre ||
      !receta.categoria ||
      !receta.descripcion ||
      !receta.preparacion
    ) {
      setMensaje("⚠️ Todos los campos de la receta son obligatorios");
      return;
    }

    if (
      ingredientes.length === 0 ||
      !ingredientes.every(
        (i) => i.nombre && i.cantidad && i.unidad_medida
      )
    ) {
      setMensaje("⚠️ Debes agregar ingredientes válidos antes de guardar");
      return;
    }

    try {
      // Obtener token del usuario (si hay autenticación)
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/api/recetas",
        {
          ...receta,
          ingredientes, // 👈 Se envían los ingredientes junto con la receta
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMensaje("✅ Receta creada correctamente");
        setReceta({
          nombre: "",
          categoria: "",
          descripcion: "",
          preparacion: "",
        });
        setIngredientes([]);
      } else {
        setMensaje("❌ Error al crear la receta");
      }
    } catch (error) {
      console.error("Error al crear receta:", error);
      setMensaje("❌ Ocurrió un error al crear la receta");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        🍲 Crear nueva receta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-gray-700 mb-1">Nombre de la receta</label>
          <input
            type="text"
            name="nombre"
            value={receta.nombre}
            onChange={handleChange}
            placeholder="Ejemplo: Ensalada César"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-gray-700 mb-1">Categoría</label>
          <input
            type="text"
            name="categoria"
            value={receta.categoria}
            onChange={handleChange}
            placeholder="Ejemplo: Ensaladas, Postres, Sopas..."
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-gray-700 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={receta.descripcion}
            onChange={handleChange}
            placeholder="Breve descripción de la receta..."
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Preparación */}
        <div>
          <label className="block text-gray-700 mb-1">Preparación</label>
          <textarea
            name="preparacion"
            value={receta.preparacion}
            onChange={handleChange}
            placeholder="Describe los pasos de preparación..."
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        {/* Formulario de ingredientes */}
        <IngredienteForm onChange={handleIngredientesChange} />

        {/* Botón de envío */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
          >
            Guardar receta
          </button>
        </div>
      </form>

      {/* Mensajes de estado */}
      {mensaje && (
        <p
          className={`mt-4 text-center font-medium ${
            mensaje.startsWith("✅")
              ? "text-green-600"
              : mensaje.startsWith("⚠️")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
};

export default CrearRecetaPage;
