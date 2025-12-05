import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmModal from "../../../components/common/ConfirmModal";

const AdminUnidadesPage = () => {
  const [nombre, setNombre] = useState('');
  const [abreviatura, setAbreviatura] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [sugerenciasNombre, setSugerenciasNombre] = useState([]);
  const [sugerenciasAbreviatura, setSugerenciasAbreviatura] = useState([]);
  const [editando, setEditando] = useState(null);

  // Modal unificado (igual que ingredientes)
  const [mostrarModal, setMostrarModal] = useState(false);
  const [unidadAEliminar, setUnidadAEliminar] = useState(null);

  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const obtenerUnidades = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/unidades', axiosConfig);

      if (Array.isArray(res.data)) setUnidades(res.data);
      else if (res.data.data && Array.isArray(res.data.data)) setUnidades(res.data.data);
      else if (res.data.unidades && Array.isArray(res.data.unidades)) setUnidades(res.data.unidades);
      else setUnidades([]);

    } catch (err) {
      console.error('Error al obtener unidades:', err);
      setUnidades([]);
    }
  };

  useEffect(() => {
    obtenerUnidades();
  }, []);

  const handleGuardarUnidad = async () => {
    setMensaje('');
    setError('');

    if (!nombre.trim() || !abreviatura.trim()) {
      setError('Nombre y abreviatura son obligatorios');
      return;
    }

    try {
      if (editando) {
        const repetido = unidades.find(u => u.nombre.toLowerCase() === nombre.toLowerCase() && u.id !== editando);
        if (repetido) {
          setError('Ya existe una unidad con ese nombre');
          return;
        }

        await axios.put(`http://localhost:3000/api/admin/unidades/${editando}`, { nombre, abreviatura }, axiosConfig);
        setMensaje('Unidad actualizada correctamente');
      } else {
        const repetido = unidades.find(u => u.nombre.toLowerCase() === nombre.toLowerCase());
        if (repetido) {
          setError('Ya existe una unidad con ese nombre');
          return;
        }

        await axios.post('http://localhost:3000/api/admin/unidades', { nombre, abreviatura }, axiosConfig);
        setMensaje('Unidad guardada correctamente');
      }

      setNombre('');
      setAbreviatura('');
      setEditando(null);
      setSugerenciasNombre([]);
      setSugerenciasAbreviatura([]);

      obtenerUnidades();
    } catch (err) {
      console.error('Error guardando:', err);
      setError(editando ? 'No se pudo actualizar la unidad' : 'No se pudo crear la unidad');
    }
  };

  const handleEditar = (unidad) => {
    setNombre(unidad.nombre);
    setAbreviatura(unidad.abreviatura);
    setEditando(unidad.id);
    setMensaje('');
    setError('');
    setSugerenciasNombre([]);
    setSugerenciasAbreviatura([]);
  };

  // Abrir modal de confirmación
  const solicitarEliminar = (id) => {
    setUnidadAEliminar(id);
    setMostrarModal(true);
  };

  // Eliminar desde modal
  const confirmarEliminar = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/admin/unidades/${unidadAEliminar}`,
        axiosConfig
      );

      setMensaje('Unidad eliminada correctamente');
      setMostrarModal(false);
      setUnidadAEliminar(null);

      obtenerUnidades();
    } catch (err) {
      console.error('Error al eliminar unidad:', err);
      setError('No se pudo eliminar la unidad');
      setMostrarModal(false);
    }
  };

  const filtrarSugerencias = (valor) => {
    const valorLower = valor.toLowerCase();
    return unidades.filter(u =>
      u.nombre.toLowerCase().includes(valorLower) ||
      u.abreviatura.toLowerCase().includes(valorLower)
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Administrar Unidades de Medida</h2>

      {/* Input nombre */}
      <div className="mb-2 position-relative">
        <input
          type="text"
          placeholder="Nombre"
          className="form-control"
          value={nombre}
          onChange={(e) => {
            const value = e.target.value;
            setNombre(value);
            setSugerenciasNombre(value ? filtrarSugerencias(value) : []);
            setSugerenciasAbreviatura([]);
          }}
          onFocus={() => setSugerenciasAbreviatura([])}
        />

        {sugerenciasNombre.length > 0 && nombre.trim() !== '' && (
          <ul className="list-group position-absolute w-100"
              style={{ zIndex: 1000, top: "100%", maxHeight: "150px", overflowY: "auto" }}>
            {sugerenciasNombre.map((u) => (
              <li key={u.id}
                  className="list-group-item list-group-item-action"
                  onMouseDown={() => {
                    setNombre(u.nombre);
                    setAbreviatura(u.abreviatura);
                    setSugerenciasNombre([]);
                    setSugerenciasAbreviatura([]);
                  }}>
                {u.nombre} ({u.abreviatura})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Input abreviatura */}
      <div className="mb-2 position-relative">
        <input
          type="text"
          placeholder="Abreviatura"
          className="form-control"
          value={abreviatura}
          onChange={(e) => {
            const value = e.target.value;
            setAbreviatura(value);
            setSugerenciasAbreviatura(value ? filtrarSugerencias(value) : []);
            setSugerenciasNombre([]);
          }}
          onFocus={() => setSugerenciasNombre([])}
        />

        {sugerenciasAbreviatura.length > 0 && abreviatura.trim() !== '' && (
          <ul className="list-group position-absolute w-100"
              style={{ zIndex: 1000, top: "100%", maxHeight: "150px", overflowY: "auto" }}>
            {sugerenciasAbreviatura.map((u) => (
              <li key={u.id}
                  className="list-group-item list-group-item-action"
                  onMouseDown={() => {
                    setNombre(u.nombre);
                    setAbreviatura(u.abreviatura);
                    setSugerenciasNombre([]);
                    setSugerenciasAbreviatura([]);
                  }}>
                {u.nombre} ({u.abreviatura})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Crear / Actualizar */}
      <button onClick={handleGuardarUnidad} className="btn btn-primary mb-3">
        {editando ? "Actualizar" : "Crear"}
      </button>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabla */}
      <h4>Unidades Registradas</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Abreviatura</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {unidades.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No hay unidades registradas</td>
            </tr>
          ) : (
            unidades.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.abreviatura}</td>
                
                
                
 <td>
  <button
    className="btn btn-secondary btn-admin me-2"
    onClick={() => handleEditar(u)}
  >
    Editar
  </button>

  <button
    className="btn btn-danger btn-admin"
    onClick={() => solicitarEliminar(u.id)}
  >
    Eliminar
  </button>
</td>






              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal unificado ConfirmModal */}
      <ConfirmModal
        visible={mostrarModal}
        title="Confirmar Eliminación"
        message="¿Está seguro de eliminar esta unidad de medida?"
        onCancel={() => setMostrarModal(false)}
        onConfirm={confirmarEliminar}
      />

    </div>
  );
};

export default AdminUnidadesPage;
