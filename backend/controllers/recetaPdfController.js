const db = require("../config/database");
const { generarPdfReceta } = require("../services/recetaPdfService");

const generarRecetaPdf = (req, res) => {
  const { id } = req.params;
  const id_usuario = req.user?.id;

  // 1️⃣ Obtener receta
  const sqlReceta = `
    SELECT *
    FROM receta
    WHERE id_receta = ? AND id_usuario = ?
  `;

  db.query(sqlReceta, [id, id_usuario], (err, recetaResult) => {
    if (err) {
      console.error("❌ Error obteniendo receta:", err);
      return res.status(500).json({ mensaje: "Error obteniendo receta" });
    }

    if (recetaResult.length === 0) {
      return res.status(404).json({ mensaje: "Receta no encontrada" });
    }

    const receta = recetaResult[0];

    // 2️⃣ Obtener ingredientes
    const sqlIng = `
      SELECT nombre, cantidad, unidad_medida
      FROM ingrediente
      WHERE id_receta = ?
    `;

    db.query(sqlIng, [id], (errIng, ingredientes) => {
      if (errIng) {
        console.error("❌ Error obteniendo ingredientes:", errIng);
        return res.status(500).json({ mensaje: "Error obteniendo ingredientes" });
      }

      receta.ingredientes = ingredientes;

      // 3️⃣ Obtener configuración del sitio
      const sqlConfig = `
        SELECT *
        FROM configuracion_sitio
        ORDER BY actualizado DESC
        LIMIT 1
      `;

      db.query(sqlConfig, async (errConfig, configResult) => {
        if (errConfig) {
          console.error("❌ Error obteniendo configuración:", errConfig);
          return res
            .status(500)
            .json({ mensaje: "Error obteniendo configuración del sitio" });
        }

        const config = configResult[0] || {};

        const logoUrl = config.logo
          ? `${process.env.BACKEND_URL}/uploads/configuracion/${config.logo}`
          : null;

        const imagenRecetaUrl = receta.imagen
          ? `${process.env.BACKEND_URL}/uploads/recetas/${receta.imagen}`
          : null;

        // 4️⃣ HTML del PDF (VERSIÓN EDITORIAL)
        const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${receta.nombre}</title>

  <style>
    :root {
      --primary: ${config.color_primario || "#652A1C"};
      --secondary: ${config.color_secundario || "#F9ECDB"};
    }

    body {
      font-family: Arial, sans-serif;
      background: #fff;
      margin: 0;
      padding: 0;
      color: #000;
    }

    header {
      text-align: center;
      padding-top: 10px;
    }

    header img {
      max-height: 70px;
      margin-bottom: 10px;
    }

    section {
      padding: 20px;
    }

    h1 {
      font-size: 22px;
      margin-bottom: 10px;
      color: var(--primary);
      text-align: center;
    }

    h2 {
      font-size: 18px;
      margin-top: 30px;
      color: var(--primary);
    }

    p, li {
      font-size: 13px;
      line-height: 1.6;
      color: #000;
    }

    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 25px 0;
    }

    .imagen-receta {
      text-align: center;
      margin: 20px 0;
    }

    .imagen-receta img {
      max-width: 100%;
      border-radius: 8px;
    }

    .ingredientes {
      background: #fafafa;
      border-left: 4px solid var(--primary);
      padding: 15px 20px;
      margin-bottom: 25px;
    }

    .ingredientes ul {
      padding-left: 20px;
      margin: 0;
    }

    .preparacion {
      white-space: pre-wrap;
      line-height: 1.7;
    }

    footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 11px;
      padding: 8px;
      background: #fff;
    }
  </style>
</head>

<body>

  <header>
    ${logoUrl ? `<img src="${logoUrl}" alt="Logo del sitio" />` : ""}
    <h1>${receta.nombre}</h1>
  </header>

  <section>

    ${
      imagenRecetaUrl
        ? `<div class="imagen-receta"><img src="${imagenRecetaUrl}" /></div>`
        : ""
    }

    <h2>Descripción</h2>
    <p>${receta.descripcion}</p>

    <hr />

    <h2>Ingredientes</h2>
    <div class="ingredientes">
      <ul>
        ${receta.ingredientes
          .map(
            (ing) =>
              `<li>${ing.cantidad ?? ""} ${
                ing.unidad_medida ?? ""
              } ${ing.nombre}</li>`
          )
          .join("")}
      </ul>
    </div>

    <hr />

    <h2>Preparación</h2>
    <p class="preparacion">${receta.preparacion}</p>

  </section>

  <footer>
    ${config.footer_texto || "© Organizador de Recetas"}
  </footer>

</body>
</html>
        `;

        try {
          const pdfBuffer = await generarPdfReceta(html);

          res.status(200);
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${receta.nombre}.pdf"`
          );
          res.setHeader("Content-Length", pdfBuffer.length);

          res.end(pdfBuffer);
        } catch (pdfErr) {
          console.error("❌ Error generando PDF:", pdfErr);
          return res
            .status(500)
            .json({ mensaje: "Error generando PDF" });
        }
      });
    });
  });
};

module.exports = {
  generarRecetaPdf,
};
