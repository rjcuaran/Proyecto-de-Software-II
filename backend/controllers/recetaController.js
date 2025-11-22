const db = require("../config/database");
const path = require("path");
const fs = require("fs");

// =====================
// CREAR RECETA (con imagen)
// =====================
const crearReceta = (req, res) => {
  const { nombre, categoria, descripcion, preparacion } = req.body;
  const id_usuario = req.user?.id;

  // Imagen subida por Multer
  const imagen = req.file ? req.file.filename : null;

  // Ingredientes llegan como STRING → los convertimos a JSON
  let ingredientes = [];
  try {
    if (req.body.ingredientes) {
      ingredientes = JSON.parse(req.body.ingredientes);
    }
  } catch (e) {
    console.error("❌ Error parseando ingredientes:", e);
    return res.status(400).json({ mensaje: "Formato inválido de ingredientes" });
  }

  if (!nombre || !categoria || !descripcion || !preparacion) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  const sql = `
    INSERT INTO receta (nombre, categoria, descripcion, preparacion, imagen, id_usuario, fecha_creacion)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [nombre, categoria, descripcion, preparacion, imagen, id_usuario],
    (err, result) => {
      if (err) {
        console.error("❌ Error creando receta:", err);
        return res.status(500).json({ mensaje: "Error creando receta" });
      }

      const id_receta = result.insertId;

      // Insertar ingredientes si existen
      if (ingredientes.length > 0) {
        const values = ingredientes.map((ing) => [
          id_receta,
          ing.nombre,
          ing.cantidad,
          ing.unidad_medida,
        ]);

        const sqlIng = `
          INSERT INTO ingrediente (id_receta, nombre, cantidad, unidad_medida)
          VALUES ?
        `;

        db.query(sqlIng, [values], (errIng) => {
          if (errIng) {
            console.error("❌ Error guardando ingredientes:", errIng);
            return res.status(500).json({
              mensaje: "Receta creada, pero falló guardar ingredientes",
            });
          }

          return res.json({
            mensaje: "Receta creada con éxito",
            id_receta,
            imagen,
          });
        });
      } else {
        return res.json({
          mensaje: "Receta creada con éxito",
          id_receta,
          imagen,
        });
      }
    }
  );
};

// =====================
// OBTENER TODAS LAS RECETAS
// =====================
const obtenerRecetas = (req, res) => {
  const id_usuario = req.user?.id;
  const { q, categoria, orden } = req.query;

  const filtros = ["id_usuario = ?"];
  const params = [id_usuario];

  if (q) {
    filtros.push("nombre LIKE ?");
    params.push(`%${q}%`);
  }

  if (categoria && categoria !== "todas") {
    filtros.push("categoria = ?");
    params.push(categoria);
  }

  const orderDirection = orden === "asc" ? "ASC" : "DESC";

  const sql = `
      SELECT id_receta, nombre, categoria, descripcion, imagen, fecha_creacion
      FROM receta
      WHERE ${filtros.join(" AND ")}
      ORDER BY fecha_creacion ${orderDirection}
  `;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ Error en obtenerRecetas:", err);
      return res.status(500).json({ mensaje: "Error obteniendo recetas" });
    }

    return res.json(results);
  });
};

// =====================
// OBTENER CATEGORÍAS DISPONIBLES
// =====================
const obtenerCategorias = (req, res) => {
  const id_usuario = req.user?.id;

  const sql = `
    SELECT DISTINCT categoria
    FROM receta
    WHERE id_usuario = ?
    ORDER BY categoria ASC
  `;

  db.query(sql, [id_usuario], (err, results) => {
    if (err) {
      console.error("❌ Error en obtenerCategorias:", err);
      return res.status(500).json({ mensaje: "Error obteniendo categorías" });
    }

    const categorias = results
      .map((row) => row.categoria)
      .filter((cat) => !!cat);

    return res.json(categorias);
  });
};

// =====================
// OBTENER RECETA POR ID (CON INGREDIENTES)
// =====================
const obtenerRecetaPorId = (req, res) => {
  const { id } = req.params;

  const sqlReceta = `SELECT * FROM receta WHERE id_receta = ?`;

  db.query(sqlReceta, [id], (err, recetaResult) => {
    if (err) return res.status(500).json({ mensaje: "Error obteniendo receta" });
    if (recetaResult.length === 0)
      return res.status(404).json({ mensaje: "Receta no encontrada" });

    const receta = recetaResult[0];

    const sqlIng = `SELECT * FROM ingrediente WHERE id_receta = ?`;

    db.query(sqlIng, [id], (errIng, ingResult) => {
      if (errIng)
        return res
          .status(500)
          .json({ mensaje: "Error obteniendo ingredientes" });

      receta.ingredientes = ingResult;

      return res.json(receta);
    });
  });
};

// =====================
// ACTUALIZAR RECETA (con opción de reemplazar imagen)
// =====================
const actualizarReceta = (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, descripcion, preparacion, imagenActual } = req.body;
  const id_usuario = req.user?.id;

  if (!nombre || !categoria || !descripcion || !preparacion) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  // Parseo de ingredientes: pueden venir como string (FormData) o como objeto
  let ingredientes = [];
  try {
    if (req.body.ingredientes) {
      ingredientes = Array.isArray(req.body.ingredientes)
        ? req.body.ingredientes
        : JSON.parse(req.body.ingredientes);
    }
  } catch (err) {
    console.error("❌ Error parseando ingredientes en actualización:", err);
    return res.status(400).json({ mensaje: "Formato inválido de ingredientes" });
  }

  // Imagen nueva subida por Multer (si existe)
  const imagenNueva = req.file ? req.file.filename : null;

  // 1) Obtener la receta actual (asegurar que es del usuario logueado)
  const sqlSelect = "SELECT imagen FROM receta WHERE id_receta = ? AND id_usuario = ?";

  db.query(sqlSelect, [id, id_usuario], (err, resultado) => {
    if (err) {
      console.error("❌ Error consultando receta:", err);
      return res.status(500).json({ mensaje: "Error obteniendo receta" });
    }

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: "Receta no encontrada" });
    }

    const imagenBD = resultado[0].imagen;
    const imagenFinal = imagenNueva || imagenActual || imagenBD || null;

    // 2) Actualizar datos principales de la receta
    const sqlUpdate = `
      UPDATE receta
      SET nombre = ?, categoria = ?, descripcion = ?, preparacion = ?, imagen = ?
      WHERE id_receta = ? AND id_usuario = ?
    `;

    db.query(
      sqlUpdate,
      [nombre, categoria, descripcion, preparacion, imagenFinal, id, id_usuario],
      (errUpdate) => {
        if (errUpdate) {
          console.error("❌ Error actualizando receta:", errUpdate);
          return res.status(500).json({ mensaje: "Error actualizando receta" });
        }

        // 3) Reemplazar ingredientes (borramos y volvemos a insertar)
        const sqlDeleteIng = "DELETE FROM ingrediente WHERE id_receta = ?";
        db.query(sqlDeleteIng, [id], (errDelete) => {
          if (errDelete) {
            console.error("❌ Error limpiando ingredientes:", errDelete);
            return res
              .status(500)
              .json({ mensaje: "Receta actualizada, pero falló limpiar ingredientes" });
          }

          const insertarIngredientes = (callback) => {
            if (!ingredientes || ingredientes.length === 0) return callback();

            const values = ingredientes.map((ing) => [
              id,
              ing.nombre,
              ing.cantidad,
              ing.unidad_medida,
            ]);

            const sqlIng = `
              INSERT INTO ingrediente (id_receta, nombre, cantidad, unidad_medida)
              VALUES ?
            `;

            db.query(sqlIng, [values], (errIng) => {
              if (errIng) {
                console.error("❌ Error guardando ingredientes:", errIng);
                return res.status(500).json({
                  mensaje: "Receta actualizada, pero falló guardar ingredientes",
                });
              }
              callback();
            });
          };

          insertarIngredientes(() => {
            // 4) Si hay imagen nueva y existía anterior distinta, eliminar archivo viejo
            if (imagenNueva && imagenBD && imagenBD !== imagenNueva) {
              const imagenPath = path.join(__dirname, "../uploads/recetas", imagenBD);
              fs.unlink(imagenPath, (unlinkErr) => {
                if (unlinkErr) {
                  console.warn("⚠️ No se pudo eliminar la imagen anterior:", unlinkErr);
                }
              });
            }

            return res.json({ mensaje: "Receta actualizada con éxito", imagen: imagenFinal });
          });
        });
      }
    );
  });
};

// =====================
// ELIMINAR RECETA (y su imagen / ingredientes)
// =====================
const eliminarReceta = (req, res) => {
  const { id } = req.params;
  const id_usuario = req.user?.id;

  // 1) Obtener la receta para saber si existe y cuál es la imagen
  const sqlSelect = "SELECT imagen FROM receta WHERE id_receta = ? AND id_usuario = ?";

  db.query(sqlSelect, [id, id_usuario], (err, resultado) => {
    if (err) {
      console.error("❌ Error consultando receta para eliminar:", err);
      return res.status(500).json({ mensaje: "Error obteniendo receta" });
    }

    if (resultado.length === 0) {
      return res.status(404).json({ mensaje: "Receta no encontrada" });
    }

    const imagenBD = resultado[0].imagen;

    // 2) Borrar ingredientes asociados
    const sqlDeleteIng = "DELETE FROM ingrediente WHERE id_receta = ?";
    db.query(sqlDeleteIng, [id], (errIng) => {
      if (errIng) {
        console.error("❌ Error eliminando ingredientes:", errIng);
        return res.status(500).json({ mensaje: "Error eliminando ingredientes" });
      }

      // 3) Borrar receta
      const sqlDeleteReceta = "DELETE FROM receta WHERE id_receta = ? AND id_usuario = ?";
      db.query(sqlDeleteReceta, [id, id_usuario], (errDel, resultDel) => {
        if (errDel) {
          console.error("❌ Error eliminando receta:", errDel);
          return res.status(500).json({ mensaje: "Error eliminando receta" });
        }

        // 4) Si hay imagen en disco, intentar eliminarla
        if (imagenBD) {
          const imagenPath = path.join(__dirname, "../uploads/recetas", imagenBD);
          fs.unlink(imagenPath, (unlinkErr) => {
            if (unlinkErr) {
              console.warn("⚠️ No se pudo eliminar la imagen física:", unlinkErr);
            }
          });
        }

        return res.json({ mensaje: "Receta eliminada con éxito" });
      });
    });
  });
};

module.exports = {
  crearReceta,
  obtenerRecetas,
  obtenerRecetaPorId,
  actualizarReceta,
  obtenerCategorias,
  eliminarReceta, // ✅ exportamos la nueva función
};
