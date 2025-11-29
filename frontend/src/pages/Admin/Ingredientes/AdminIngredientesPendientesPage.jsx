import React, { useEffect, useState } from "react";
import ConfirmModal from "../../../components/common/ConfirmModal";

export default function AdminIngredientesPendientesPage() {
  const [pendientes, setPendientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const token = localStorage.getItem("token");

  // Cargar ingredientes pendientes
  const cargarPendientes = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/ingredientes/pendientes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.success) {
        setPendientes(data.data);
      }
    } catch (error) {
      console.error("Error cargando pendientes:", error);
    }
  };

  useEffect(() => {
    cargarPendientes();
  }, []);

  // Aprobar ingrediente pendiente
  const aprobarIngrediente = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/admin/ingredientes/${id}/aprobar`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      cargarPendientes();
    } catch (error) {
      console.error("Error aprobando pendiente:", error);
    }
  };

  // Abrir modal de eliminación
  const solicitarEliminar = (id) => {
    setIdAEliminar(id);
    setMostrarModal(true);
  };

  // Confirmar eliminación
  const confirmarEliminar = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/admin/ingredientes/${idAEliminar}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMostrarModal(false);
      setIdAEliminar(null);
      cargarPendientes();
    } catch (error) {
      console.error("Error eliminando pendiente:", error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: "#652A1C" }}>
        Ingredientes Pendientes por Aprobación
      </h2>

      {/* TABLA */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Ingrediente</th>
            <th>Creado por</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pendientes.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                No hay ingredientes pendientes.
              </td>
            </tr>
          ) : (
            pendientes.map((ing) => (
              <tr key={ing.id}>
                <td>{ing.nombre}</td>
                <td>{ing.creado_por}</td>

                <td>
                  {/* APROBAR */}
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => aprobarIngrediente(ing.id)}
                  >
                    Aprobar
                  </button>

                  {/* ELIMINAR */}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => solicitarEliminar(ing.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL ELEGANTE */}
      <ConfirmModal
        visible={mostrarModal}
        title="Eliminar Ingrediente Pendiente"
        message="¿Desea eliminar este ingrediente sugerido?"
        onCancel={() => setMostrarModal(false)}
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
