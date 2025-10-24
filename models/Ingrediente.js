const db = require('../config/database');

class Ingrediente {
  static agregarAReceta(idReceta, ingredientes, callback) {
    if (ingredientes.length === 0) return callback(null, { message: 'No hay ingredientes' });
    
    const values = ingredientes.map(ing => [idReceta, ing.nombre, ing.cantidad, ing.unidad]);
    const query = 'INSERT INTO Ingredientes (idReceta, nombre, cantidad, unidad) VALUES ?';
    
    db.query(query, [values], callback);
  }

  static obtenerPorReceta(idReceta, callback) {
    const query = 'SELECT * FROM Ingredientes WHERE idReceta = ? ORDER BY idIngrediente';
    db.execute(query, [idReceta], callback);
  }

  static actualizarPorReceta(idReceta, ingredientes, callback) {
    // Eliminar ingredientes existentes y agregar nuevos
    const deleteQuery = 'DELETE FROM Ingredientes WHERE idReceta = ?';
    
    db.execute(deleteQuery, [idReceta], (err) => {
      if (err) return callback(err);
      
      if (ingredientes.length === 0) return callback(null, { message: 'Ingredientes actualizados' });
      
      this.agregarAReceta(idReceta, ingredientes, callback);
    });
  }
}

module.exports = Ingrediente;