// frontend/src/pages/Admin/Ingredientes/AdminIngredientesPage.jsx
import React, { useEffect, useState } from "react";
import ConfirmModal from "../../../components/common/ConfirmModal";

export default function AdminIngredientesPage() {
  const [ingredientes, setIngredientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [modoEditar, setModoEditar] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  const [sugerencias, setSugerencias] = useState([]);
  const [errorDuplicado, setErrorDuplicado] = useState("");

  const token = localStorage.getItem("token");

  // Cargar todos los ingredientes
  const cargarIngredientes = async () => {
     try {
        const res = await fetch("http://localhost:5000/api/admin/ingredientes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success) setIngredientes(data.data);
     } catch (error) {
        console.error("Error cargando ingredientes:", error);
     }
  };

  useEffect(() => {
    cargarIngredientes();
  }, []);

  // 🔎 FILTRAR COINCIDENCIAS MIENTRAS SE ESCRIBE
  const buscarCoincidencias = (texto) => {
    if (!texto || texto.length < 1) {
      setSugerencias([]);
      return;
    }

    const coincidencias = ingredientes.filter((item) =>
      item.nombre.toLowerCase().includes(texto.toLowerCase())
    );

    setSugerencias(coincidencias);
  };

  // Crear o actualizar ingrediente
  const manejarSubmit = async (e) => {
    e.preventDefault();

    // ❌ Evitar duplicado exacto
    if (
      ingredientes.some(
        (i) => i.nombre.toLowerCase() === nombre.toLowerCase()
      )
    ) {
      setErrorDuplicado("Este ingrediente ya existe");
      return;
    }

    const url = modoEditar
      ? `http://localhost:5000/api/admin/ingredientes/${idEditar}`
      : `http://localhost:5000/api/admin/ingredientes`;

    const metodo = modoEditar ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorDuplicado(data.message);
        return;
      }

      setNombre("");
      setModoEditar(false);
      setIdEditar(null);
      setErrorDuplicado("");
      setSugerencias([]);

      cargarIngredientes();
    } catch (error) {
      console.error("Error guardando ingrediente:", error);
    }
  };

  const editarIngrediente = (ing) => {
    setModoEditar(true);
    setIdEditar(ing.id);
    setNombre(ing.nombre);
    setErrorDuplicado("");
    setSugerencias([]);
  };

  const toggleAprobado = async (ingrediente) => {
    const endpoint = ingrediente.aprobado ? "desaprobar" : "aprobar";

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/ingredientes/${ingrediente.id}/${endpoint}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) cargarIngredientes();
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  const solicitarEliminar = (id) => {
    setIdAEliminar(id);
    setMostrarModal(true);
  };

  const confirmarEliminar = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/ingredientes/${idAEliminar}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.success) {
        setMostrarModal(false);
        setIdAEliminar(null);
        cargarIngredientes();
      }
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: "#652A1C" }}>
        Administrar Ingredientes Globales
      </h2>

      {/* FORMULARIO */}
      <form onSubmit={manejarSubmit} className="mb-4">
        <label className="form-label fw-semibold">
          Nombre del ingrediente global
        </label>

        <input
          type="text"
          className="form-control mb-1"
          value={nombre}
          onChange={(e) => {
            const valor = e.target.value;
            setNombre(valor);
            setErrorDuplicado("");

            buscarCoincidencias(valor);
          }}
          required
        />

        {/* Error duplicado */}
        {errorDuplicado && (
          <p className="text-danger fw-bold">{errorDuplicado}</p>
        )}

        {/* SUGERENCIAS */}
        {sugerencias.length > 0 && (
          <div className="border rounded bg-light p-2 mb-2">
            <strong>Coincidencias:</strong>
            <ul className="m-0">
              {sugerencias.map((s) => (
                <li key={s.id}>{s.nombre}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#652A1C" }}
        >
          {modoEditar ? "Actualizar" : "Crear Ingrediente"}
        </button>

        {modoEditar && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setModoEditar(false);
              setNombre("");
              setSugerencias([]);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* TABLA */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Ingrediente</th>
            <th>Aprobado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ingredientes.map((ing) => (
            <tr key={ing.id}>
              <td>{ing.nombre}</td>

              <td>
                {ing.aprobado ? (
                  <span className="badge bg-success">Sí</span>
                ) : (
                  <span className="badge bg-danger">No</span>
                )}
              </td>

              <td>
                {/* BOTONES UNIFORMES */}
                <button
                  className="btn btn-warning btn-admin me-2"
                  onClick={() => editarIngrediente(ing)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-info btn-admin me-2"
                  onClick={() => toggleAprobado(ing)}
                >
                  {ing.aprobado ? "Quitar Aprobación" : "Aprobar"}
                </button>

                <button
                  className="btn btn-danger btn-admin"
                  onClick={() => solicitarEliminar(ing.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <ConfirmModal
        visible={mostrarModal}
        title="Confirmar Eliminación"
        message="¿Está seguro de eliminar este ingrediente?"
        onCancel={() => setMostrarModal(false)}
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
