import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUnidadesPage = () => {
  const [nombre, setNombre] = useState('');
  const [abreviatura, setAbreviatura] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [sugerenciasNombre, setSugerenciasNombre] = useState([]);
  const [sugerenciasAbreviatura, setSugerenciasAbreviatura] = useState([]);
  const [editando, setEditando] = useState(null);

  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const obtenerUnidades = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/unidades', axiosConfig);
      if (Array.isArray(res.data)) {
        setUnidades(res.data);
      } else if (res.data.data && Array.isArray(res.data.data)) {
        setUnidades(res.data.data);
      } else if (res.data.unidades && Array.isArray(res.data.unidades)) {
        setUnidades(res.data.unidades);
      } else {
        setUnidades([]);
      }
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
        const unidadExistente = unidades.find(u => u.nombre.toLowerCase() === nombre.toLowerCase() && u.id !== editando);
        if (unidadExistente) {
          setError('Ya existe una unidad con ese nombre');
          return;
        }
        await axios.put(`http://localhost:3000/api/admin/unidades/${editando}`, { nombre, abreviatura }, axiosConfig);
        setMensaje('Unidad actualizada correctamente');
      } else {
        const unidadExistente = unidades.find(u => u.nombre.toLowerCase() === nombre.toLowerCase());
        if (unidadExistente) {
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
      console.error(editando ? 'Error actualizando unidad:' : 'Error creando unidad:', err);
      setError(editando ? 'No se pudo actualizar la unidad' : 'No se pudo guardar la unidad');
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

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta unidad?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/api/admin/unidades/${id}`, axiosConfig);
      setMensaje('Unidad eliminada correctamente');
      obtenerUnidades();
    } catch (err) {
      console.error('Error al eliminar unidad:', err);
      setError('No se pudo eliminar la unidad');
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

      <div className="mb-2 position-relative">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setSugerenciasNombre(e.target.value ? filtrarSugerencias(e.target.value) : []);
            setSugerenciasAbreviatura([]);
          }}
          onFocus={() => setSugerenciasAbreviatura([])}
          className="form-control"
        />
        {sugerenciasNombre.length > 0 && nombre.trim() !== '' && (
          <ul className="list-group position-absolute w-100" style={{ zIndex: 1000, top: '100%', maxHeight: '150px', overflowY: 'auto' }}>
            {sugerenciasNombre.map((u) => (
              <li
                key={u.id}
                className="list-group-item list-group-item-action"
                onMouseDown={() => {
                  setNombre(u.nombre);
                  setAbreviatura(u.abreviatura);
                  setSugerenciasNombre([]);
                  setSugerenciasAbreviatura([]);
                }}
              >
                {u.nombre} ({u.abreviatura})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-2 position-relative">
        <input
          type="text"
          placeholder="Abreviatura"
          value={abreviatura}
          onChange={(e) => {
            setAbreviatura(e.target.value);
            setSugerenciasAbreviatura(e.target.value ? filtrarSugerencias(e.target.value) : []);
            setSugerenciasNombre([]);
          }}
          onFocus={() => setSugerenciasNombre([])}
          className="form-control"
        />
        {sugerenciasAbreviatura.length > 0 && abreviatura.trim() !== '' && (
          <ul className="list-group position-absolute w-100" style={{ zIndex: 1000, top: '100%', maxHeight: '150px', overflowY: 'auto' }}>
            {sugerenciasAbreviatura.map((u) => (
              <li
                key={u.id}
                className="list-group-item list-group-item-action"
                onMouseDown={() => {
                  setNombre(u.nombre);
                  setAbreviatura(u.abreviatura);
                  setSugerenciasNombre([]);
                  setSugerenciasAbreviatura([]);
                }}
              >
                {u.nombre} ({u.abreviatura})
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleGuardarUnidad} className="btn btn-primary mb-3">
        {editando ? 'Actualizar' : 'Crear'}
      </button>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

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
              <td colSpan="3" className="text-center">
                No hay unidades registradas
              </td>
            </tr>
          ) : (
            unidades.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.abreviatura}</td>
                <td>
                  <button onClick={() => handleEditar(u)} className="btn btn-sm btn-secondary me-2">
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(u.id)} className="btn btn-sm btn-danger">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUnidadesPage;
