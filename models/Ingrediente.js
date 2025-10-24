const db = require('../config/database');

class Ingrediente {
  static agregarAReceta(id_receta, ingredientes, callback) {
    if (ingredientes.length === 0) return callback(null, { message: 'No hay ingredientes' });
    
    const values = ingredientes.map(ing => [id_receta, ing.nombre, ing.cantidad, ing.unidad_medida]);
    const query = 'INSERT INTO ingrediente (id_receta, nombre, cantidad, unidad_medida) VALUES ?';
    
    db.query(query, [values], callback);
  }

  static obtenerPorReceta(id_receta, callback) {
    const query = 'SELECT * FROM ingrediente WHERE id_receta = ? ORDER BY id_ingrediente';
    db.execute(query, [id_receta], callback);
  }

  static actualizarPorReceta(id_receta, ingredientes, callback) {
    const deleteQuery = 'DELETE FROM ingrediente WHERE id_receta = ?';
    
    db.execute(deleteQuery, [id_receta], (err) => {
      if (err) return callback(err);
      
      if (ingredientes.length === 0) return callback(null, { message: 'Ingredientes actualizados' });
      
      this.agregarAReceta(id_receta, ingredientes, callback);
    });
  }
}

module.exports = Ingrediente;