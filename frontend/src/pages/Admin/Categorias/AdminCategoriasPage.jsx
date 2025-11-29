import React, { useEffect, useState } from "react";
import authService from "../../../services/auth";
import ConfirmModal from "../../../components/common/ConfirmModal";

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [modoEditar, setModoEditar] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const token = localStorage.getItem("token");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

  // NUEVOS ESTADOS: sugerencias y error por duplicado
  const [sugerencias, setSugerencias] = useState([]);
  const [errorDuplicado, setErrorDuplicado] = useState("");

  // Cerrar modal con la tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMostrarModal(false);
      }
    };

    if (mostrarModal) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [mostrarModal]);

  // Cargar categorías
  const cargarCategorias = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/categorias", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        // Orden alfabético ascendente
        const ordenadas = [...data.data].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
        );
        setCategorias(ordenadas);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Filtrar sugerencias en tiempo real
  const buscarCoincidencias = (texto) => {
    if (!texto || texto.length < 1) {
      setSugerencias([]);
      return;
    }

    const coincidencias = categorias.filter((cat) =>
      cat.nombre.toLowerCase().includes(texto.toLowerCase())
    );

    setSugerencias(coincidencias);
  };

  // Crear o actualizar categoría
  const manejarSubmit = async (e) => {
    e.preventDefault();

    // Evitar duplicados (distinta categoría con el mismo nombre)
    const existeDuplicado = categorias.some(
      (cat) =>
        cat.nombre.toLowerCase() === nombre.toLowerCase() &&
        cat.id !== idEditar
    );

    if (existeDuplicado) {
      setErrorDuplicado("Esta categoría ya existe");
      return;
    }

    const url = modoEditar
      ? `http://localhost:5000/api/admin/categorias/${idEditar}`
      : "http://localhost:5000/api/admin/categorias";

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
        // Por si el backend también valida duplicados
        setErrorDuplicado(data.message || "Error guardando la categoría");
        return;
      }

      setNombre("");
      setModoEditar(false);
      setIdEditar(null);
      setErrorDuplicado("");
      setSugerencias([]);

      cargarCategorias();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Editar
  const editarCategoria = (categoria) => {
    setModoEditar(true);
    setIdEditar(categoria.id);
    setNombre(categoria.nombre);
    setErrorDuplicado("");
    setSugerencias([]);
  };

  // Abrir modal
  const solicitarEliminar = (id) => {
    setIdAEliminar(id);
    setMostrarModal(true);
  };

  // Eliminar categoría (confirmado)
  const confirmarEliminar = async () => {
    try {
      await fetch(`http://localhost:5000/api/admin/categorias/${idAEliminar}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setMostrarModal(false);
      setIdAEliminar(null);
      cargarCategorias();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4" style={{ color: "#652A1C" }}>
        Administrar Categorías
      </h2>

      {/* FORMULARIO */}
      <form onSubmit={manejarSubmit} className="mb-4">
        <label className="form-label fw-semibold">Nombre de la categoría</label>

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

        {/* Mensaje de duplicado */}
        {errorDuplicado && (
          <p className="text-danger fw-semibold">{errorDuplicado}</p>
        )}

        {/* Sugerencias en tiempo real */}
        {sugerencias.length > 0 && !modoEditar && (
          <div className="border rounded bg-light p-2 mb-2">
            <strong>Coincidencias:</strong>
            <ul className="m-0">
              {sugerencias.map((cat) => (
                <li key={cat.id}>{cat.nombre}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ backgroundColor: "#652A1C" }}
        >
          {modoEditar ? "Actualizar" : "Crear Categoría"}
        </button>

        {modoEditar && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setModoEditar(false);
              setNombre("");
              setSugerencias([]);
              setErrorDuplicado("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* TABLA DE CATEGORÍAS */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.nombre}</td>
              <td>
                <button
                  className="btn btn-warning btn-admin me-2"
                  onClick={() => editarCategoria(cat)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-admin"
                  onClick={() => solicitarEliminar(cat.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL ELEGANTE REUTILIZABLE */}
      <ConfirmModal
        visible={mostrarModal}
        title="Confirmar Eliminación"
        message="¿Está seguro de eliminar esta categoría?"
        onCancel={() => setMostrarModal(false)}
        onConfirm={confirmarEliminar}
      />
    </div>
  );
}
