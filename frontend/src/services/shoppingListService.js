// src/pages/ShoppingList.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { generarListaCompra } from "../services/shoppingListService";

const ShoppingList = () => {
  const { state } = useLocation();
  const recetasIds = state?.recetas || [];
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLista = async () => {
      if (recetasIds.length === 0) return;
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const data = await generarListaCompra(recetasIds, token);
        setLista(data);
      } catch (err) {
        console.error(err);
        alert(err.message || "Error al generar lista de compras");
      } finally {
        setLoading(false);
      }
    };
    fetchLista();
  }, [recetasIds]);

  const handleImprimir = () => window.print();

  if (recetasIds.length === 0) {
    return <p>No se seleccionaron recetas.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>🛒 Lista de Compras</h2>

      {loading ? (
        <p>Generando lista...</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Cantidad Total</th>
                <th>Unidad</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((item, index) => (
                <tr key={index}>
                  <td>{item.ingrediente}</td>
                  <td>{item.cantidad_total}</td>
                  <td>{item.unidad}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {lista.length > 0 && (
            <button className="btn btn-primary mt-3" onClick={handleImprimir}>
              🖨️ Imprimir Lista
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ShoppingList;
