// backend/controllers/recetaController.js
const db = require("../config/database");
const Receta = require("../models/Receta");

const crearReceta = async (req, res) => {
  try {
    const id_usuario = req.user?.id; // ID del usuario autenticado
    const { nombre, categoria, descripcion, preparacion, ingredientes } = req.body;

    if (!nombre || !categoria || !descripcion || !preparacion) {
      return res.status(400).json({
        success: false,
        mensaje: "Todos los campos de la receta son obligatorios.",
      });
    }

    const recetaData = { nombre, categoria, descripcion, preparacion, id_usuario };

    Receta.crear(recetaData, async (err, result) => {
      if (err) {
        console.error("❌ Error al crear receta:", err);
        return res.status(500).json({ success: false, mensaje: "Error al crear la receta." });
      }

      const id_receta = result.id_receta;
      console.log(`✅ Receta creada con ID: ${id_receta}`);

      if (Array.isArray(ingredientes) && ingredientes.length > 0) {
        const ingredientesValidos = ingredientes.filter(
          (i) => i.nombre && i.cantidad && i.unidad_medida
        );

        if (ingredientesValidos.length > 0) {
          const values = ingredientesValidos.map((i) => [
            id_receta,
            i.nombre,
            i.cantidad,
            i.unidad_medida,
          ]);

          const sql = `
            INSERT INTO ingrediente (id_receta, nombre, cantidad, unidad_medida)
            VALUES ?
          `;

          db.query(sql, [values], (errInsert) => {
            if (errInsert) {
              console.error("⚠️ Error agregando ingredientes:", errInsert);
              return res.status(201).json({
                success: true,
                mensaje: "Receta creada pero ocurrió un error al agregar ingredientes.",
                id_receta,
              });
            }

            console.log("✅ Ingredientes agregados correctamente");
            return res.status(201).json({
              success: true,
              mensaje: "Receta e ingredientes creados correctamente.",
              id_receta,
            });
          });
        } else {
          return res.status(201).json({
            success: true,
            mensaje: "Receta creada (sin ingredientes válidos).",
            id_receta,
          });
        }
      } else {
        return res.status(201).json({
          success: true,
          mensaje: "Receta creada (sin ingredientes).",
          id_receta,
        });
      }
    });
  } catch (error) {
    console.error("❌ Error inesperado en crearReceta:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error inesperado al crear la receta.",
    });
  }
};

// 🧩 NUEVO: Obtener una receta con todos sus ingredientes
const obtenerRecetaPorId = async (req, res) => {
  try {
    const id_receta = req.params.id;
    const id_usuario = req.user?.id;

    // 1️⃣ Verificar que la receta existe y pertenece al usuario autenticado
    const queryReceta = `
      SELECT * FROM receta 
      WHERE id_receta = ? AND id_usuario = ?
    `;
    db.query(queryReceta, [id_receta, id_usuario], (err, results) => {
      if (err) {
        console.error("❌ Error al obtener receta:", err);
        return res.status(500).json({ success: false, mensaje: "Error al obtener la receta." });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          mensaje: "Receta no encontrada o no pertenece al usuario.",
        });
      }

      const receta = results[0];

      // 2️⃣ Obtener los ingredientes asociados
      const queryIngredientes = `
        SELECT id_ingrediente, nombre, cantidad, unidad_medida
        FROM ingrediente
        WHERE id_receta = ?
      `;

      db.query(queryIngredientes, [id_receta], (errIng, ingredientes) => {
        if (errIng) {
          console.error("⚠️ Error obteniendo ingredientes:", errIng);
          return res.status(500).json({
            success: false,
            mensaje: "Error al obtener los ingredientes de la receta.",
          });
        }

        receta.ingredientes = ingredientes;

        // 3️⃣ Respuesta final
        return res.json({
          success: true,
          receta,
        });
      });
    });
  } catch (error) {
    console.error("❌ Error inesperado en obtenerRecetaPorId:", error);
    res.status(500).json({
      success: false,
      mensaje: "Error inesperado al obtener la receta.",
    });
  }
};

module.exports = {
  crearReceta,
  obtenerRecetaPorId, // 👈 exportamos también esta función
};
