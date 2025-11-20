import React from "react";
import { useParams } from "react-router-dom";

const EditarRecetaPage = () => {
  const { id } = useParams();

  return (
    <div className="container mt-4">
      <h2>Editar Receta</h2>
      <p>Editando la receta con ID: {id}</p>
    </div>
  );
};

export default EditarRecetaPage;
