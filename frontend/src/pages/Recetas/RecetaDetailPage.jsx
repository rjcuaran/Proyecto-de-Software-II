import React from "react";
import { useParams } from "react-router-dom";

const RecetaDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container mt-4">
      <h2>Detalle de Receta</h2>
      <p>Mostrando la receta con ID: {id}</p>
    </div>
  );
};

export default RecetaDetailPage;
