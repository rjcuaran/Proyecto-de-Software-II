// controllers/shoppingListController.js
import { db } from "../config/database.js"; // o require si no usas ESModules

export const generarListaCompra = async (req, res) => {
  try {
    const { recetas } = req.body;

    if (!recetas || !Array.isArray(recetas) || recetas.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar un arreglo con los IDs de las recetas.",
      });
    }

    // Consulta SQL: sumar ingredientes de recetas seleccionadas
    const [ingredientes] = await db.query(
      `
      SELECT 
        i.nombre AS ingrediente,
        SUM(i.cantidad) AS cantidad_total,
        i.unidad
      FROM Ingredientes i
      WHERE i.idReceta IN (?)
      GROUP BY i.nombre, i.unidad
      ORDER BY i.nombre ASC;
      `,
      [recetas]
    );

    return res.status(200).json({
      success: true,
      message: "Lista de compras generada correctamente.",
      data: ingredientes,
    });
  } catch (error) {
    console.error("Error generando lista de compras:", error);
    return res.status(500).json({
      success: false,
      message: "Error del servidor al generar la lista de compras.",
      error: error.message,
    });
  }
};
