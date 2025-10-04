const { pool } = require('../config/database');

const recetaController = {
  // CREATE - Crear nueva receta
  async create(req, res) {
    try {
      const { nombre, categoria, descripcion, preparacion, ingredientes } = req.body;
      const id_usuario = req.user.id_usuario;

      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // 1. Insertar receta
        const [recetaResult] = await connection.execute(
          `INSERT INTO Receta (nombre, categoria, descripcion, preparacion, id_usuario) 
           VALUES (?, ?, ?, ?, ?)`,
          [nombre, categoria, descripcion, preparacion, id_usuario]
        );

        const recetaId = recetaResult.insertId;

        // 2. Insertar ingredientes
        if (ingredientes && ingredientes.length > 0) {
          for (const ingrediente of ingredientes) {
            await connection.execute(
              `INSERT INTO Ingrediente (nombre, cantidad, unidad_medida, id_receta) 
               VALUES (?, ?, ?, ?)`,
              [ingrediente.nombre, ingrediente.cantidad, ingrediente.unidad_medida, recetaId]
            );
          }
        }

        await connection.commit();
        connection.release();

        // 3. Obtener receta completa creada
        const recetaCompleta = await recetaController.getRecetaById(recetaId);

        res.status(201).json({
          success: true,
          message: 'Receta creada exitosamente',
          data: recetaCompleta
        });

      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }

    } catch (error) {
      console.error('Error creando receta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al crear receta'
      });
    }
  },

  // READ - Obtener todas las recetas del usuario
  async getAll(req, res) {
    try {
      const id_usuario = req.user.id_usuario;

      const [recetas] = await pool.execute(
        `SELECT r.*, 
                COUNT(DISTINCT i.id_ingrediente) as total_ingredientes,
                COUNT(DISTINCT f.id_favorito) as es_favorita
         FROM Receta r
         LEFT JOIN Ingrediente i ON r.id_receta = i.id_receta
         LEFT JOIN Favorito f ON r.id_receta = f.id_receta AND f.id_usuario = ?
         WHERE r.id_usuario = ?
         GROUP BY r.id_receta
         ORDER BY r.fecha_creacion DESC`,
        [id_usuario, id_usuario]
      );

      res.json({
        success: true,
        data: recetas,
        total: recetas.length
      });

    } catch (error) {
      console.error('Error obteniendo recetas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // READ - Obtener receta específica por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const id_usuario = req.user.id_usuario;

      const receta = await recetaController.getRecetaById(id, id_usuario);

      if (!receta) {
        return res.status(404).json({
          success: false,
          message: 'Receta no encontrada'
        });
      }

      res.json({
        success: true,
        data: receta
      });

    } catch (error) {
      console.error('Error obteniendo receta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // UPDATE - Actualizar receta
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre, categoria, descripcion, preparacion, ingredientes } = req.body;
      const id_usuario = req.user.id_usuario;

      // Verificar que la receta existe y pertenece al usuario
      const [recetas] = await pool.execute(
        'SELECT id_receta FROM Receta WHERE id_receta = ? AND id_usuario = ?',
        [id, id_usuario]
      );

      if (recetas.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Receta no encontrada'
        });
      }

      const connection = await pool.getConnection();
      await connection.beginTransaction();

      try {
        // 1. Actualizar receta
        await connection.execute(
          `UPDATE Receta 
           SET nombre = ?, categoria = ?, descripcion = ?, preparacion = ?
           WHERE id_receta = ?`,
          [nombre, categoria, descripcion, preparacion, id]
        );

        // 2. Eliminar ingredientes antiguos
        await connection.execute(
          'DELETE FROM Ingrediente WHERE id_receta = ?',
          [id]
        );

        // 3. Insertar nuevos ingredientes
        if (ingredientes && ingredientes.length > 0) {
          for (const ingrediente of ingredientes) {
            await connection.execute(
              `INSERT INTO Ingrediente (nombre, cantidad, unidad_medida, id_receta) 
               VALUES (?, ?, ?, ?)`,
              [ingrediente.nombre, ingrediente.cantidad, ingrediente.unidad_medida, id]
            );
          }
        }

        await connection.commit();
        connection.release();

        // 4. Obtener receta actualizada
        const recetaActualizada = await recetaController.getRecetaById(id);

        res.json({
          success: true,
          message: 'Receta actualizada exitosamente',
          data: recetaActualizada
        });

      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }

    } catch (error) {
      console.error('Error actualizando receta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al actualizar receta'
      });
    }
  },

  // DELETE - Eliminar receta
  async delete(req, res) {
    try {
      const { id } = req.params;
      const id_usuario = req.user.id_usuario;

      const [result] = await pool.execute(
        'DELETE FROM Receta WHERE id_receta = ? AND id_usuario = ?',
        [id, id_usuario]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Receta no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Receta eliminada exitosamente'
      });

    } catch (error) {
      console.error('Error eliminando receta:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al eliminar receta'
      });
    }
  },

  // BÚSQUEDA - Buscar recetas
  async search(req, res) {
    try {
      const { q, categoria } = req.query;
      const id_usuario = req.user.id_usuario;

      let query = `
        SELECT r.*, COUNT(DISTINCT i.id_ingrediente) as total_ingredientes
        FROM Receta r
        LEFT JOIN Ingrediente i ON r.id_receta = i.id_receta
        WHERE r.id_usuario = ?
      `;
      let params = [id_usuario];

      if (q) {
        query += ` AND (r.nombre LIKE ? OR r.descripcion LIKE ? OR r.preparacion LIKE ?)`;
        const searchTerm = `%${q}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (categoria) {
        query += ` AND r.categoria = ?`;
        params.push(categoria);
      }

      query += ` GROUP BY r.id_receta ORDER BY r.fecha_creacion DESC`;

      const [recetas] = await pool.execute(query, params);

      res.json({
        success: true,
        data: recetas,
        total: recetas.length
      });

    } catch (error) {
      console.error('Error buscando recetas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Método auxiliar para obtener receta completa por ID
  async getRecetaById(id, id_usuario = null) {
    let query = `
      SELECT r.*, u.nombre as autor
      FROM Receta r
      JOIN Usuario u ON r.id_usuario = u.id_usuario
      WHERE r.id_receta = ?
    `;
    let params = [id];

    if (id_usuario) {
      query += ` AND r.id_usuario = ?`;
      params.push(id_usuario);
    }

    const [recetas] = await pool.execute(query, params);

    if (recetas.length === 0) {
      return null;
    }

    const receta = recetas[0];

    // Obtener ingredientes
    const [ingredientes] = await pool.execute(
      'SELECT * FROM Ingrediente WHERE id_receta = ? ORDER BY id_ingrediente',
      [id]
    );

    receta.ingredientes = ingredientes;

    return receta;
  }
};

module.exports = recetaController;