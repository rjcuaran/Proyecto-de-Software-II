// src/services/shoppingListService.js

export function generarListaCompra(recetasSeleccionadas) {
  const lista = {};

  recetasSeleccionadas.forEach((receta) => {
    receta.ingredientes.forEach((ing) => {
      const key = ing.nombre.toLowerCase();

      if (!lista[key]) {
        lista[key] = {
          nombre: ing.nombre,
          cantidad: parseFloat(ing.cantidad),
          unidad: ing.unidad_medida
        };
      } else {
        lista[key].cantidad += parseFloat(ing.cantidad);
      }
    });
  });

  return Object.values(lista);
}
