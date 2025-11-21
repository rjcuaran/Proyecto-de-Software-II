const db = require("../config/database");

// =====================
// CREAR RECETA
// =====================
const crearReceta = (req, res) => {
  const { nombre, categoria, descripcion, preparacion, ingredientes } = req.body;
  const id_usuario = req.user?.id;

  if (!nombre || !categoria || !descripcion || !preparacion) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  const sql = `INSERT INTO receta (nombre, categoria, descripcion, preparacion, id_usuario, fecha_creacion)
               VALUES (?, ?, ?, ?, ?, NOW())`;

  db.query(
    sql,
    [nombre, categoria, descripcion, preparacion, id_usuario],
    (err, result) => {
      if (err) {
        console.error("❌ Error creando receta:", err);
        return res.status(500).json({ mensaje: "Error creando receta" });
      }

      const id_receta = result.insertId;

      // Insertar ingredientes si existen
      if (ingredientes && ingredientes.length > 0) {
        const values = ingredientes.map((ing) => [
          id_receta,
          ing.nombre,
          ing.cantidad,
          ing.unidad_medida,
        ]);

        const sqlIng = `INSERT INTO ingrediente (id_receta, nombre, cantidad, unidad_medida)
                        VALUES ?`;

        db.query(sqlIng, [values], (errIng) => {
          if (errIng) {
            console.error("❌ Error guardando ingredientes:", errIng);
            return res
              .status(500)
              .json({ mensaje: "Receta creada, pero falló guardar ingredientes" });
          }

          return res.json({
            mensaje: "Receta creada con éxito",
            id_receta,
          });
        });
      } else {
        return res.json({
          mensaje: "Receta creada con éxito",
          id_receta,
        });
      }
    }
  );
};

// =====================
// OBTENER TODAS LAS RECETAS DEL USUARIO
// =====================
const obtenerRecetas = (req, res) => {
  const id_usuario = req.user?.id;

  const sql = `
      SELECT id_receta, nombre, categoria, descripcion
      FROM receta
      WHERE id_usuario = ?
      ORDER BY fecha_creacion DESC
  `;

  db.query(sql, [id_usuario], (err, results) => {
    if (err) {
      console.error("❌ Error en obtenerRecetas:", err);
      return res.status(500).json({ mensaje: "Error obteniendo recetas" });
    }

    return res.json(results);
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
// EXPORTAR CONTROLADORES
// =====================
module.exports = {
  crearReceta,
  obtenerRecetas,   // <-- AHORA SÍ ESTÁ DEFINIDO
  obtenerRecetaPorId
};
