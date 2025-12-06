const fs = require("fs");
const path = require("path");
const db = require("../config/database"); // ← usa createConnection(), NO promises

// Carpeta donde se guardan logos
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "configuracion");

// Crear carpeta si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Convertir base64 → archivo físico
function guardarImagenBase64(base64String) {
  try {
    const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return null;

    const ext = matches[1].split("/")[1];
    const buffer = Buffer.from(matches[2], "base64");

    const fileName = `logo_${Date.now()}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    fs.writeFileSync(filePath, buffer);
    return fileName;

  } catch (error) {
    console.error("❌ Error guardando base64:", error);
    return null;
  }
}

module.exports = {

  // =======================
  // OBTENER CONFIGURACIÓN
  // =======================
  obtenerConfiguracion: async (req, res) => {
    try {

      db.query(
        "SELECT * FROM configuracion_sitio WHERE id = 1",
        (err, results) => {
          if (err) {
            console.error("❌ Error SQL:", err);
            return res.status(500).json({
              ok: false,
              message: "Error obteniendo configuración"
            });
          }

          return res.json({
            ok: true,
            data: results[0] || {}
          });
        }
      );

    } catch (error) {
      console.error("❌ Error obteniendo configuración:", error);
      res.status(500).json({ ok: false, message: "Error obteniendo configuración" });
    }
  },

  // =======================
  // ACTUALIZAR CONFIGURACIÓN
  // =======================
  actualizarConfiguracion: async (req, res) => {
    try {
      const {
        color_primario,
        color_secundario,
        color_terciario,
        color_cuaternario,
        color_quinary,
        footer_texto,
        link_facebook,
        link_instagram,
        link_youtube
      } = req.body;

      let nuevoLogo = null;

      if (req.file) {
        nuevoLogo = req.file.filename;
      }

      const sql = `
        UPDATE configuracion_sitio SET
          color_primario = ?,
          color_secundario = ?,
          color_terciario = ?,
          color_cuaternario = ?,
          color_quinary = ?,
          footer_texto = ?,
          link_facebook = ?,
          link_instagram = ?,
          link_youtube = ?,
          actualizado = CURRENT_TIMESTAMP
          ${nuevoLogo ? ", logo = ?" : ""}
        WHERE id = 1
      `;

      const params = [
        color_primario,
        color_secundario,
        color_terciario,
        color_cuaternario,
        color_quinary,
        footer_texto,
        link_facebook,
        link_instagram,
        link_youtube
      ];

      if (nuevoLogo) {
        params.push(nuevoLogo);
      }

      db.query(sql, params, (err, result) => {
        if (err) {
          console.error("❌ Error actualizando configuración:", err);
          return res.status(500).json({
            ok: false,
            message: "Error actualizando configuración"
          });
        }

        return res.json({
          ok: true,
          message: "Configuración actualizada correctamente"
        });
      });

    } catch (error) {
      console.error("❌ Error actualizando configuración:", error);
      res.status(500).json({ ok: false, message: "Error actualizando configuración" });
    }
  }
};
