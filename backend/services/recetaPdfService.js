const puppeteer = require("puppeteer");

/**
 * Genera un PDF de una receta usando Puppeteer
 * - Tamaño carta
 * - Numeración de páginas
 * - Estilos de impresión
 * @param {string} html - HTML ya renderizado
 * @returns {Buffer} PDF
 */
const generarPdfReceta = async (html) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Renderizar HTML
  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  // Forzar modo impresión
  await page.emulateMediaType("print");

  // Generar PDF con numeración
  const pdfBuffer = await page.pdf({
    format: "Letter", // TAMAÑO CARTA
    printBackground: true,

    displayHeaderFooter: true,

    // NO repetir encabezado
    headerTemplate: `<div></div>`,

    // Footer con numeración
    footerTemplate: `
      <div style="
        width: 100%;
        font-size: 10px;
        text-align: center;
        color: #555;
        padding: 5px 0;
      ">
        Página <span class="pageNumber"></span> de <span class="totalPages"></span>
      </div>
    `,

    // Márgenes profesionales
    margin: {
      top: "20mm",
      bottom: "25mm", // Más espacio para footer
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
};

module.exports = {
  generarPdfReceta,
};
