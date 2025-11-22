// backend/controllers/recetaController.js
const db = require("../config/database");
const fs = require("fs");
const path = require("path");

// ======================
// CREAR RECETA
// ======================
const crearReceta = (req, res) => {
  const { nombre, categoria, descripcion, preparacion } = req.body;

  if (!nombre || !categoria || !descripcion || !preparacion) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  let imagen = null;
  if (req.file) {
    imagen = req.file.filename;
  }

  let ingredientes = [];
  try {
    if (req.body.ingredientes) {
      ingredientes = JSON.parse(req.body.ingredientes);
    }
  } catch (err) {
    return res.status(400).json({ mensaje: "Error en formato de ingredientes" });
  }

  const sql =
    "INSERT INTO receta (nombre, categoria, descripcion, preparacion, imagen, id_usuario) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [nombre, categoria, descripcion, preparacion, imagen, req.user.id],
    (err, resultado) => {
      if (err) {
        console.error("❌ Error creando receta:", err);
        return res.status(500).json({ mensaje: "Error creando receta" });
      }

      const recetaId = resultado.insertId;

      if (ingredientes.length === 0) {
        return res.json({
          mensaje: "Receta creada sin ingredientes",
          id: recetaId,
        });
      }

      const values = ingredientes.map((ing) => [
        recetaId,
        ing.nombre,
        ing.cantidad,
        ing.unidad_medida,
      ]);

      const sqlIngredientes =
        "INSERT INTO ingrediente (id_receta, nombre, cantidad, unidad_medida) VALUES ?";

      db.query(sqlIngredientes, [values], (errIng) => {
        if (errIng) {
          console.error("❌ Error guardando ingredientes:", errIng);
          return res.status(500).json({
            mensaje: "Receta creada, pero error guardando ingredientes",
          });
        }

        return res.json({
          mensaje: "Receta creada con éxito",
          id: recetaId,
        });
      });
    }
  );
};

// ======================
// OBTENER TODAS LAS RECETAS
// ======================
const obtenerRecetas = (req, res) => {
  const sql =
    "SELECT * FROM receta WHERE id_usuario = ? ORDER BY fecha_creacion DESC";

  db.query(sql, [req.user.id], (err, resultado) => {
    if (err) {
      console.error("❌ Error obteniendo recetas:", err);
      return res.status(500).json({ mensaje: "Error obteniendo recetas" });
    }

    res.json(resultado);
  });
};

// ======================
// OBTENER RECETA POR ID
// ======================
const obtenerRecetaPorId = (req, res) => {
  const { id } = req.params;

  const sqlReceta = "SELECT * FROM receta WHERE id_receta = ?";
  const sqlIng =
    "SELECT nombre, cantidad, unidad_medida FROM ingrediente WHERE id_receta = ?";

  db.query(sqlReceta, [id], (err, receta) => {
    if (err) {
      console.error("❌ Error obteniendo receta:", err);
      return res.status(500).json({ mensaje: "Error obteniendo receta" });
    }

    if (receta.length === 0) {
      return res.status(404).json({ mensaje: "Receta no encontrada" });
    }

    db.query(sqlIng, [id], (errIng, ingredientes) => {
      if (errIng) {
        console.error("❌ Error obteniendo ingredientes:", errIng);
        return res
          .status(500)
          .json({ mensaje: "Error obteniendo ingredientes" });
      }

      receta[0].ingredientes = ingredientes;
      res.json(receta[0]);
    });
  });
};

// ==========================================================
// 🔥 ACTUALIZAR RECETA (Versión corregida y estabilizada)
// ==========================================================
const actualizarReceta = (req, res) => {
  const { id } = req.params;

  let { nombre, categoria, descripcion, preparacion, imagenActual } = req.body;

  if (!nombre || !categoria || !descripcion || !preparacion) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  // Normalizar imagenActual → solo nombre de archivo
  if (imagenActual) {
    imagenActual = path.basename(imagenActual);
  }

  // Parsear ingredientes
  let ingredientes = [];
  try {
    if (req.body.ingredientes) {
      ingredientes = Array.isArray(req.body.ingredientes)
        ? req.body.ingredientes
        : JSON.parse(req.body.ingredientes);
    }
  } catch (err) {
    console.error("❌ Error parseando ingredientes:", err);
    return res.status(400).json({ mensaje: "Formato de ingredientes inválido" });
  }

  const imagenNueva = req.file ? req.file.filename : null;

  const sqlSelect = "SELECT imagen FROM receta WHERE id_receta = ?";

  db.query(sqlSelect, [id], (err, resultado) => {
    if (err) {
      console.error("❌ Error buscando receta:", err);
      return res.status(500).json({ mensaje: "Error buscando la receta" });
    }

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: "Receta no encontrada" });
    }

    const imagenBD = resultado[0].imagen;

    // Determinar imagen final
    const imagenFinal = imagenNueva || imagenActual || imagenBD || null;

    const sqlUpdate = `
      UPDATE receta 
      SET nombre = ?, categoria = ?, descripcion = ?, preparacion = ?, imagen = ?
      WHERE id_receta = ?
    `;

    db.query(
      sqlUpdate,
      [nombre, categoria, descripcion, preparacion, imagenFinal, id],
      (errUpdate) => {
        if (errUpdate) {
          console.error("❌ Error actualizando receta:", errUpdate);
          return res
            .status(500)
            .json({ mensaje: "Error actualizando la receta" });
        }

        // Borrar ingredientes previos
        db.query(
          "DELETE FROM ingrediente WHERE id_receta = ?",
          [id],
          (errDelete) => {
            if (errDelete) {
              console.error("❌ Error limpiando ingredientes:", errDelete);
              return res.status(500).json({
                mensaje: "Receta actualizada, pero error limpiando ingredientes",
              });
            }

            // Insertar los nuevos ingredientes
            if (ingredientes.length > 0) {
              const values = ingredientes.map((ing) => [
                id,
                ing.nombre,
                ing.cantidad,
                ing.unidad_medida,
              ]);

              db.query(
                "INSERT INTO ingrediente (id_receta, nombre, cantidad, unidad_medida) VALUES ?",
                [values],
                (errIng) => {
                  if (errIng) {
                    console.error("❌ Error guardando ingredientes:", errIng);
                    return res.status(500).json({
                      mensaje: "Receta actualizada, pero error guardando ingredientes",
                    });
                  }

                  manejarImagenesYLiberar(
                    imagenNueva,
                    imagenBD,
                    res,
                    imagenFinal
                  );
                }
              );
            } else {
              manejarImagenesYLiberar(imagenNueva, imagenBD, res, imagenFinal);
            }
          }
        );
      }
    );
  });
};

// Función auxiliar
function manejarImagenesYLiberar(imagenNueva, imagenBD, res, imagenFinal) {
  if (imagenNueva && imagenBD && imagenNueva !== imagenBD) {
    const ruta = path.join(__dirname, "../uploads/recetas", imagenBD);

    fs.unlink(ruta, (err) => {
      if (err) {
        console.warn("⚠ No se pudo borrar la imagen anterior:", err);
      }
    });
  }

  return res.json({
    mensaje: "Receta actualizada con éxito",
    imagen: imagenFinal,
  });
}

// ======================
// OBTENER CATEGORÍAS
// ======================
const obtenerCategorias = (req, res) => {
  const categorias = [
    "Postres",
    "Ensaladas",
    "Bebidas",
    "Comida Rápida",
    "Comida Vegana",
    "Sopas",
  ];
  res.json(categorias);
};

// ======================
// EXPORTAR
// ======================
module.exports = {
  crearReceta,
  obtenerRecetas,
  obtenerRecetaPorId,
  actualizarReceta,
  obtenerCategorias,
};
