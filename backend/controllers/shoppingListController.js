// backend/controllers/shoppingListController.js
// =======================================================
//   CONTROLADOR DEFINITIVO - SHOPPING LIST (PREMIUM)
// =======================================================

const db = require("../config/database");

// =======================================================
// 1) OBTENER LISTA DE COMPRAS
// =======================================================
exports.obtenerListaCompra = (req, res) => {
  const id_usuario = req.user?.id;

  if (!id_usuario) {
    return res.status(401).json({ success: false, message: "Usuario no autenticado." });
  }

  const sql = `
    SELECT 
      id_item,
      nombre_ingrediente,
      cantidad,
      unidad_medida,
      comprado
    FROM shopping_list
    WHERE id_usuario = ?
    ORDER BY comprado ASC, nombre_ingrediente ASC
  `;

  db.query(sql, [id_usuario], (err, rows) => {
    if (err) {
      console.error("❌ Error obteniendo lista de compras:", err);
      return res.status(500).json({
        success: false,
        message: "Error obteniendo la lista de compras.",
      });
    }

    return res.json({ success: true, data: rows });
  });
};

// =======================================================
// 2) ALTERNAR ESTADO "COMPRADO"
// =======================================================
exports.toggleItemComprado = (req, res) => {
  const id_usuario = req.user?.id;
  const { id } = req.params;

  if (!id_usuario) {
    return res.status(401).json({ success: false, message: "Usuario no autenticado." });
  }

  const sqlSelect = `
    SELECT comprado 
    FROM shopping_list 
    WHERE id_item = ? AND id_usuario = ?
  `;

  db.query(sqlSelect, [id, id_usuario], (errSel, rows) => {
    if (errSel) {
      console.error("❌ Error consultando ítem:", errSel);
      return res.status(500).json({
        success: false,
        message: "Error consultando el ítem.",
      });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: "Ítem no encontrado." });
    }

    const nuevoEstado = rows[0].comprado ? 0 : 1;

    const sqlUpdate = `
      UPDATE shopping_list
      SET comprado = ?
      WHERE id_item = ? AND id_usuario = ?
    `;

    db.query(sqlUpdate, [nuevoEstado, id, id_usuario], (errUp) => {
      if (errUp) {
        console.error("❌ Error actualizando estado:", errUp);
        return res.status(500).json({
          success: false,
          message: "Error actualizando estado del ítem.",
        });
      }

      return res.json({
        success: true,
        message: "Estado actualizado.",
        data: { id_item: Number(id), comprado: !!nuevoEstado },
      });
    });
  });
};

// =======================================================
// 3) AGREGAR INGREDIENTES DE UNA RECETA (SIN BORRAR)
// =======================================================
exports.agregarIngredientesReceta = (req, res) => {
  const id_usuario = req.user?.id;
  const { receta } = req.body;

  if (!id_usuario) {
    return res.status(401).json({ success: false, message: "Usuario no autenticado." });
  }

  if (!receta) {
    return res.status(400).json({
      success: false,
      message: "Debe enviar el ID de la receta.",
    });
  }

  const sqlIngredientes = `
    SELECT nombre, cantidad, unidad_medida
    FROM ingrediente
    WHERE id_receta = ?
  `;

  db.query(sqlIngredientes, [receta], (errIng, ingredientes) => {
    if (errIng) {
      console.error("❌ Error obteniendo ingredientes:", errIng);
      return res.status(500).json({
        success: false,
        message: "Error obteniendo ingredientes de la receta.",
      });
    }

    if (ingredientes.length === 0) {
      return res.json({
        success: true,
        message: "La receta no tiene ingredientes.",
      });
    }

    const procesar = (i) => {
      if (i >= ingredientes.length) {
        return obtenerListaFinal();
      }

      const ing = ingredientes[i];

      const sqlBuscar = `
        SELECT id_item, cantidad, unidad_medida
        FROM shopping_list
        WHERE id_usuario = ? AND nombre_ingrediente = ?
      `;

      db.query(sqlBuscar, [id_usuario, ing.nombre], (errBus, rows) => {
        if (errBus) {
          console.error("❌ Error buscando ingrediente:", errBus);
          return res.status(500).json({
            success: false,
            message: "Error buscando ingrediente.",
          });
        }

        if (rows.length === 0) {
          const sqlInsert = `
            INSERT INTO shopping_list 
              (id_usuario, nombre_ingrediente, cantidad, unidad_medida, comprado)
            VALUES (?, ?, ?, ?, 0)
          `;
          return db.query(
            sqlInsert,
            [id_usuario, ing.nombre, ing.cantidad, ing.unidad_medida],
            () => procesar(i + 1)
          );
        }

        const coincidencia = rows.find(
          (r) => String(r.unidad_medida) === String(ing.unidad_medida)
        );

        if (!coincidencia) {
          const sqlInsert2 = `
            INSERT INTO shopping_list 
              (id_usuario, nombre_ingrediente, cantidad, unidad_medida, comprado)
            VALUES (?, ?, ?, ?, 0)
          `;
          return db.query(
            sqlInsert2,
            [id_usuario, ing.nombre, ing.cantidad, ing.unidad_medida],
            () => procesar(i + 1)
          );
        }

        const sqlUpdate = `
          UPDATE shopping_list
          SET cantidad = cantidad + ?
          WHERE id_item = ?
        `;

        db.query(sqlUpdate, [ing.cantidad, coincidencia.id_item], () => procesar(i + 1));
      });
    };

    const obtenerListaFinal = () => {
      const sql = `
        SELECT id_item, nombre_ingrediente, cantidad, unidad_medida, comprado
        FROM shopping_list
        WHERE id_usuario = ?
        ORDER BY comprado ASC, nombre_ingrediente ASC
      `;
      db.query(sql, [id_usuario], (errSel, lista) => {
        if (errSel) {
          return res.status(500).json({
            success: false,
            message: "Ingredientes agregados, pero error obteniendo lista final.",
          });
        }
        return res.json({
          success: true,
          message: "Ingredientes agregados correctamente.",
          data: lista,
        });
      });
    };

    procesar(0);
  });
};

// =======================================================
// 4) GENERAR / REEMPLAZAR LISTA A PARTIR DE VARIAS RECETAS
// =======================================================
exports.generarListaCompra = (req, res) => {
  const id_usuario = req.user?.id;
  const { recetas } = req.body;

  if (!id_usuario) {
    return res.status(401).json({ success: false, message: "Usuario no autenticado." });
  }

  if (!Array.isArray(recetas) || recetas.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Debe proporcionar un arreglo de IDs de recetas.",
    });
  }

  const sqlIngredientes = `
    SELECT 
      i.nombre AS nombre_ingrediente,
      SUM(i.cantidad) AS cantidad_total,
      i.unidad_medida
    FROM ingrediente i
    WHERE i.id_receta IN (?)
    GROUP BY i.nombre, i.unidad_medida
    ORDER BY i.nombre ASC
  `;

  db.query(sqlIngredientes, [recetas], (errIng, rows) => {
    if (errIng) {
      console.error("❌ Error obteniendo ingredientes:", errIng);
      return res.status(500).json({
        success: false,
        message: "Error obteniendo ingredientes.",
      });
    }

    const sqlDelete = `DELETE FROM shopping_list WHERE id_usuario = ?`;

    db.query(sqlDelete, [id_usuario], (errDel) => {
      if (errDel) {
        console.error("❌ Error limpiando lista:", errDel);
        return res.status(500).json({
          success: false,
          message: "Error limpiando lista previa.",
        });
      }

      if (!rows || rows.length === 0) {
        return res.json({
          success: true,
          message: "Lista vacía.",
          data: [],
        });
      }

      const values = rows.map((r) => [
        id_usuario,
        r.nombre_ingrediente,
        r.cantidad_total,
        r.unidad_medida,
        0,
      ]);

      const sqlInsert = `
        INSERT INTO shopping_list 
          (id_usuario, nombre_ingrediente, cantidad, unidad_medida, comprado)
        VALUES ?
      `;

      db.query(sqlInsert, [values], (errIns) => {
        if (errIns) {
          console.error("❌ Error insertando:", errIns);
          return res.status(500).json({
            success: false,
            message: "Error guardando lista.",
          });
        }

        const sqlSelect = `
          SELECT id_item, nombre_ingrediente, cantidad, unidad_medida, comprado
          FROM shopping_list
          WHERE id_usuario = ?
          ORDER BY comprado ASC, nombre_ingrediente ASC
        `;

        db.query(sqlSelect, [id_usuario], (errSel, lista) => {
          if (errSel) {
            console.error("⚠️ Lista creada pero error leyéndola:", errSel);
            return res.json({
              success: true,
              message: "Lista creada, pero error leyéndola.",
              data: [],
            });
          }

          return res.json({
            success: true,
            message: "Lista generada correctamente.",
            data: lista,
          });
        });
      });
    });
  });
};

// =======================================================
// 5) AGREGAR MULTIPLE (SELECCIÓN DESDE LISTADO)
// =======================================================
exports.agregarMultiple = (req, res) => {
  const id_usuario = req.user?.id;
  const { recetas } = req.body;

  if (!id_usuario) {
    return res.status(401).json({ success: false, message: "Usuario no autenticado." });
  }

  if (!Array.isArray(recetas) || recetas.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Debe enviar un arreglo de IDs de recetas.",
    });
  }

  const sqlIngredientes = `
    SELECT nombre, cantidad, unidad_medida
    FROM ingrediente
    WHERE id_receta IN (?)
    ORDER BY nombre ASC
  `;

  db.query(sqlIngredientes, [recetas], async (errIng, ingredientes) => {
    if (errIng) {
      console.error("❌ Error obteniendo ingredientes:", errIng);
      return res.status(500).json({
        success: false,
        message: "Error obteniendo ingredientes.",
      });
    }

    if (ingredientes.length === 0) {
      return res.json({
        success: true,
        message: "No hay ingredientes en esas recetas.",
      });
    }

    // Obtener lista actual
    const sqlLista = `
      SELECT id_item, nombre_ingrediente, cantidad, unidad_medida
      FROM shopping_list
      WHERE id_usuario = ?
    `;

    db.query(sqlLista, [id_usuario], (errLst, lista) => {
      if (errLst) {
        console.error("❌ Error leyendo lista:", errLst);
        return res.status(500).json({
          success: false,
          message: "Error leyendo lista.",
        });
      }

      const mapa = {};
      lista.forEach((i) => {
        mapa[`${i.nombre_ingrediente.toLowerCase()}|${i.unidad_medida}`] = i;
      });

      const procesar = (i) => {
        if (i >= ingredientes.length) return finalizar();

        const ing = ingredientes[i];
        const key = `${ing.nombre.toLowerCase()}|${ing.unidad_medida}`;

        if (mapa[key]) {
          const sqlUpdate = `
            UPDATE shopping_list
            SET cantidad = cantidad + ?
            WHERE id_item = ?
          `;
          return db.query(sqlUpdate, [ing.cantidad, mapa[key].id_item], () =>
            procesar(i + 1)
          );
        }

        const sqlInsert = `
          INSERT INTO shopping_list 
            (id_usuario, nombre_ingrediente, cantidad, unidad_medida, comprado)
          VALUES (?, ?, ?, ?, 0)
        `;

        db.query(
          sqlInsert,
          [id_usuario, ing.nombre, ing.cantidad, ing.unidad_medida],
          () => procesar(i + 1)
        );
      };

      const finalizar = () => {
        const sql = `
          SELECT id_item, nombre_ingrediente, cantidad, unidad_medida, comprado
          FROM shopping_list
          WHERE id_usuario = ?
          ORDER BY comprado ASC, nombre_ingrediente ASC
        `;
        db.query(sql, [id_usuario], (errFin, listaFinal) => {
          if (errFin) {
            return res.status(500).json({
              success: true,
              message: "Lista actualizada, pero error leyéndola.",
              data: [],
            });
          }
          return res.json({
            success: true,
            message: "Ingredientes agregados correctamente.",
            data: listaFinal,
          });
        });
      };

      procesar(0);
    });
  });
};
