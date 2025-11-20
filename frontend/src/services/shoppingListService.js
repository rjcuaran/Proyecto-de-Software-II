import axios from "axios";

const generarListaCompra = async (recetasIds) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    "http://localhost:5000/api/shopping-list/generar",
    { recetas: recetasIds },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data.lista;
};

export default {
  generarListaCompra,
};
