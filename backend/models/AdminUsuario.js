const db = require("../config/database");

class AdminUsuario {
  
  // =====================================================
  // OBTENER TODOS LOS USUARIOS (AÑADIR COLUMNA ELIMINADO)
  // =====================================================
  static obtenerTodos(callback) {
    const sql = `
      SELECT 
        id_usuario, 
        nombre, 
        correo, 
        role, 
        estado, 
        fecha_registro, 
        avatar,
        eliminado
      FROM usuario
      ORDER BY fecha_registro DESC
    `;
    db.query(sql, callback);
  }

  // =====================================================
  // ACTUALIZAR ROL (ya existente)
  // =====================================================
  static actualizarRol(id, role, callback) {
    const sql = `
      UPDATE usuario SET role = ? WHERE id_usuario = ?
    `;
    db.query(sql, [role, id], callback);
  }

  // =====================================================
  // ACTUALIZAR ESTADO (ya existente)
  // =====================================================
  static actualizarEstado(id, estado, callback) {
    const sql = `
      UPDATE usuario SET estado = ? WHERE id_usuario = ?
    `;
    db.query(sql, [estado, id], callback);
  }

  // =====================================================
  // CREAR USUARIO MANUALMENTE (ajuste: incluir eliminado)
  // =====================================================
  static crearUsuario(datos, callback) {
    const sql = `
      INSERT INTO usuario (nombre, correo, contraseña, role, estado, avatar, eliminado)
      VALUES (?, ?, ?, ?, ?, NULL, ?)
    `;
    db.query(
      sql,
      [
        datos.nombre,
        datos.correo,
        datos.contraseña,
        datos.role || "user",
        datos.estado ?? 1,
        datos.eliminado ?? 0, // SIEMPRE 0 AL CREAR
      ],
      callback
    );
  }

  // =====================================================
  // EDITAR USUARIO
  // =====================================================
  static actualizarUsuario(id, datos, callback) {
    const sql = `
      UPDATE usuario
      SET nombre = ?, correo = ?
      WHERE id_usuario = ?
    `;
    db.query(sql, [datos.nombre, datos.correo, id], callback);
  }

  // =====================================================
  // RESTABLECER CONTRASEÑA DESDE ADMIN
  // =====================================================
  static actualizarContraseña(id, nuevaContraseña, callback) {
    const sql = `
      UPDATE usuario SET contraseña = ?
      WHERE id_usuario = ?
    `;
    db.query(sql, [nuevaContraseña, id], callback);
  }

  // =====================================================
  // ELIMINACIÓN LÓGICA (YA NO SE BORRA EL REGISTRO)
  // =====================================================
  static marcarEliminado(id, callback) {
    const sql = `
      UPDATE usuario SET eliminado = 1
      WHERE id_usuario = ?
    `;
    db.query(sql, [id], callback);
  }

  // =====================================================
  // RESTAURAR USUARIO ELIMINADO
  // =====================================================
  static restaurar(id, callback) {
    const sql = `
      UPDATE usuario SET eliminado = 0
      WHERE id_usuario = ?
    `;
    db.query(sql, [id], callback);
  }
}

module.exports = AdminUsuario;
