import React from "react";
import { useParams } from "react-router-dom";

const EditarIngredientePage = () => {
  const { id } = useParams();

  return (
    <div className="container mt-4">
      <h2>Editar Ingrediente</h2>
      <p>Editando el ingrediente con ID: {id}</p>
    </div>
  );
};

export default EditarIngredientePage;
