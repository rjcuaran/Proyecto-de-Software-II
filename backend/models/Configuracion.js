// backend/models/Configuracion.js
const db = require("../config/database");

class Configuracion {
  
  
  
  
static obtener(callback) {
    const sql = "SELECT * FROM configuracion_sitio WHERE id = 1 LIMIT 1";
    db.query(sql, callback);
}






  

static actualizar(datos, callback) {
    const {
      logo,
      color_primario,
      color_secundario,
      color_terciario,
      color_cuaternario,
      color_quinary,
      footer_texto,
      link_facebook,
      link_instagram,
      link_youtube
    } = datos;

    const sql = `
      UPDATE configuracion_sitio
      SET 
        logo = ?, 
        color_primario = ?, 
        color_secundario = ?, 
        color_terciario = ?, 
        color_cuaternario = ?, 
        color_quinary = ?, 
        footer_texto = ?, 
        link_facebook = ?, 
        link_instagram = ?, 
        link_youtube = ?
      WHERE id = 1
    `;

    db.query(
      sql,
      [
        logo,
        color_primario,
        color_secundario,
        color_terciario,
        color_cuaternario,
        color_quinary,
        footer_texto,
        link_facebook,
        link_instagram,
        link_youtube,
      ],
      callback
    );
}





}

module.exports = Configuracion;
