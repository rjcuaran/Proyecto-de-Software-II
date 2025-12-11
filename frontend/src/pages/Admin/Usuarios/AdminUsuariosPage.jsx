import React, { useEffect, useState } from "react";
import ConfirmModal from "../../../components/common/ConfirmModal";

export default function AdminUsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const [busqueda, setBusqueda] = useState("");

    const token = localStorage.getItem("token");
    const BASE_URL = "http://localhost:5000/api/admin/usuarios";

    const [mostrarModalForm, setMostrarModalForm] = useState(false);
    const [modoEditar, setModoEditar] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState(null);

    const [nombreForm, setNombreForm] = useState("");
    const [correoForm, setCorreoForm] = useState("");
    const [roleForm, setRoleForm] = useState("user");

    const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalConfirmLabel, setModalConfirmLabel] = useState("Confirmar");
    const [accionConfirm, setAccionConfirm] = useState(() => () => { });

    const [modalClaveVisible, setModalClaveVisible] = useState(false);
    const [modalClaveTitulo, setModalClaveTitulo] = useState("");
    const [modalClaveTexto, setModalClaveTexto] = useState("");

    const [mostrarEliminados, setMostrarEliminados] = useState(false);

    const copiarClave = () => {
        try {
            const texto = modalClaveTexto.split(":").pop().trim();
            navigator.clipboard.writeText(texto);
        } catch (e) {
            console.error("No se pudo copiar la contraseña");
        }
    };

    // =========================================================
    // Cargar usuarios (solo se usa en carga inicial y al crear)
    // =========================================================
    const cargarUsuarios = async () => {
        setCargando(true);
        setError("");
        setMensaje("");

        try {
            const res = await fetch(`${BASE_URL}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message || "No se pudieron cargar los usuarios");
                setUsuarios([]);
                return;
            }

            const usuariosOrdenados = (data.data || []).sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            );

            setUsuarios(usuariosOrdenados);
        } catch (err) {
            console.error("Error cargando usuarios:", err);
            setError("Error al cargar usuarios");
            setUsuarios([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // =========================================================
    // Separar usuarios activos y eliminados + búsqueda
    // =========================================================
    const usuariosActivos = usuarios.filter(
        (u) =>
            u.eliminado === 0 ||
            u.eliminado === null ||
            u.eliminado === undefined
    );

    const usuariosEliminados = usuarios.filter((u) => u.eliminado === 1);

    const usuariosActivosFiltrados = usuariosActivos.filter(
        (u) =>
            u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            u.correo.toLowerCase().includes(busqueda.toLowerCase())
    );

    // =========================================================
    // Crear usuario
    // =========================================================
    const abrirCrearUsuario = () => {
        setModoEditar(false);
        setUsuarioEditando(null);
        setNombreForm("");
        setCorreoForm("");
        setRoleForm("user");
        setMensaje("");
        setError("");
        setMostrarModalForm(true);
    };

    // =========================================================
    // Editar usuario
    // =========================================================
    const abrirEditarUsuario = (usuario) => {
        setModoEditar(true);
        setUsuarioEditando(usuario);
        setNombreForm(usuario.nombre || "");
        setCorreoForm(usuario.correo || "");
        setRoleForm(usuario.role || "user");
        setMensaje("");
        setError("");
        setMostrarModalForm(true);
    };

    // =========================================================
    // Guardar usuario (crear/editar)
    // =========================================================
    const manejarSubmitForm = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        if (!nombreForm.trim() || !correoForm.trim()) {
            setError("Nombre y correo son obligatorios");
            return;
        }

        try {
            const payload = {
                nombre: nombreForm.trim(),
                correo: correoForm.trim(),
            };

            let url = "";
            let metodo = "";

            if (modoEditar && usuarioEditando) {
                url = `${BASE_URL}/${usuarioEditando.id_usuario}`;
                metodo = "PUT";
            } else {
                url = `${BASE_URL}/crear`;
                metodo = "POST";
                payload.role = roleForm;
            }

            const res = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message || "No se pudo guardar el usuario");
                return;
            }

            if (!modoEditar && data.contraseña_generada) {
                setMensaje("Usuario creado correctamente.");

                setModalClaveTitulo("Usuario creado correctamente");
                setModalClaveTexto(
                    `La contraseña temporal del usuario es: ${data.contraseña_generada}`
                );
                setModalClaveVisible(true);

                // Al crear un usuario NUEVO, recargamos lista desde el backend
                await cargarUsuarios();
            } else {
                setMensaje(data.message || "Usuario actualizado correctamente");

                // Al editar, actualizamos solo ese usuario en memoria
                if (usuarioEditando) {
                    setUsuarios((prev) => {
                        const actualizados = prev.map((u) =>
                            u.id_usuario === usuarioEditando.id_usuario
                                ? {
                                    ...u,
                                    nombre: nombreForm.trim(),
                                    correo: correoForm.trim(),
                                }
                                : u
                        );
                        return actualizados.sort((a, b) =>
                            a.nombre.localeCompare(b.nombre)
                        );
                    });
                }
            }

            setMostrarModalForm(false);
            setNombreForm("");
            setCorreoForm("");
            setRoleForm("user");
            setUsuarioEditando(null);
            setModoEditar(false);
        } catch (err) {
            console.error("Error guardando usuario:", err);
            setError("Error al guardar usuario");
        }
    };

    // =========================================================
    // Activar / desactivar usuario (sin recargar lista completa)
    // =========================================================
    const cambiarEstado = async (usuario) => {
        setError("");
        setMensaje("");

        const accion = usuario.estado === 1 ? "desactivar" : "activar";

        try {
            const res = await fetch(`${BASE_URL}/${usuario.id_usuario}/${accion}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message || "No se pudo cambiar el estado");
                return;
            }

            setMensaje(data.message || "Estado actualizado correctamente");

            // Actualizar solo ese usuario en memoria
            setUsuarios((prev) => {
                const actualizado = prev.map((u) =>
                    u.id_usuario === usuario.id_usuario
                        ? { ...u, estado: usuario.estado === 1 ? 0 : 1 }
                        : u
                );
                return actualizado.sort((a, b) => a.nombre.localeCompare(b.nombre));
            });
        } catch (err) {
            console.error("Error cambiando estado:", err);
            setError("Error cambiando estado");
        }
    };

    // =========================================================
    // Promover / quitar admin (sin recargar lista)
    // =========================================================
    const cambiarRolAdmin = async (usuario) => {
        setError("");
        setMensaje("");

        const esAdmin = usuario.role === "admin";
        const accion = esAdmin ? "quitar-admin" : "promover";
        const nuevoRol = esAdmin ? "user" : "admin";

        try {
            const res = await fetch(`${BASE_URL}/${usuario.id_usuario}/${accion}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message || "No se pudo actualizar el rol");
                return;
            }

            setMensaje(data.message || "Rol actualizado correctamente");

            setUsuarios((prev) =>
                prev.map((u) =>
                    u.id_usuario === usuario.id_usuario ? { ...u, role: nuevoRol } : u
                )
            );
        } catch (err) {
            console.error("Error cambiando rol:", err);
            setError("Error al cambiar rol");
        }
    };

    // =========================================================
    // Eliminar usuario (sin recargar lista, marcando eliminado/estado)
    // =========================================================
    const solicitarEliminar = (usuario) => {
        setModalTitle("Eliminar usuario");
        setModalMessage(
            `¿Está seguro de eliminar al usuario "${usuario.nombre}" (${usuario.correo})?`
        );
        setModalConfirmLabel("Eliminar");

        setAccionConfirm(() => async () => {
            try {
                const res = await fetch(`${BASE_URL}/${usuario.id_usuario}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!data.success) {
                    setError(data.message || "No se pudo eliminar el usuario");
                    return;
                }

                setMensaje("Usuario eliminado correctamente");

                // Marcamos como eliminado + estado inactivo en memoria
                setUsuarios((prev) => {
                    const actualizado = prev.map((u) =>
                        u.id_usuario === usuario.id_usuario
                            ? { ...u, eliminado: 1, estado: 0 }
                            : u
                    );
                    return actualizado.sort((a, b) => a.nombre.localeCompare(b.nombre));
                });
            } catch (err) {
                console.error("Error eliminando usuario:", err);
                setError("Error eliminando usuario");
            } finally {
                setModalConfirmVisible(false);
            }
        });

        setModalConfirmVisible(true);
    };

    // =========================================================
    // Resetear contraseña (no afecta la lista)
    // =========================================================
    const solicitarResetPassword = (usuario) => {
        setModalTitle("Restablecer contraseña");
        setModalMessage(
            `¿Desea restablecer la contraseña del usuario "${usuario.nombre}" (${usuario.correo})?`
        );
        setModalConfirmLabel("Restablecer");

        setAccionConfirm(() => async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/${usuario.id_usuario}/reset-password`,
                    {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!data.success) {
                    setError(data.message || "No se pudo restablecer contraseña");
                    return;
                }

                if (data.nueva_contraseña) {
                    setMensaje("Contraseña restablecida correctamente.");

                    setModalClaveTitulo("Contraseña restablecida");
                    setModalClaveTexto(
                        `La nueva contraseña temporal es: ${data.nueva_contraseña}`
                    );
                    setModalClaveVisible(true);
                } else {
                    setMensaje("Contraseña restablecida correctamente.");
                }
                // No hace falta recargar usuarios
            } catch (err) {
                console.error("Error reseteando contraseña:", err);
                setError("Error al restablecer contraseña");
            } finally {
                setModalConfirmVisible(false);
            }
        });

        setModalConfirmVisible(true);
    };

    // =========================================================
    // Restaurar usuario eliminado (sin recargar lista completa)
    // =========================================================
    const solicitarRestaurar = (usuario) => {
        setModalTitle("Restaurar usuario");
        setModalMessage(
            `¿Desea restaurar al usuario "${usuario.nombre}" (${usuario.correo})?`
        );
        setModalConfirmLabel("Restaurar");

        setAccionConfirm(() => async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/${usuario.id_usuario}/restaurar`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!data.success) {
                    setError(data.message || "No se pudo restaurar el usuario");
                    return;
                }

                setMensaje(data.message || "Usuario restaurado correctamente");

                // En memoria: eliminado = 0, estado = 1
                setUsuarios((prev) => {
                    const actualizado = prev.map((u) =>
                        u.id_usuario === usuario.id_usuario
                            ? { ...u, eliminado: 0, estado: 1 }
                            : u
                    );
                    return actualizado.sort((a, b) => a.nombre.localeCompare(b.nombre));
                });
            } catch (err) {
                console.error("Error restaurando usuario:", err);
                setError("Error restaurando usuario");
            } finally {
                setModalConfirmVisible(false);
            }
        });

        setModalConfirmVisible(true);
    };


    // Permitir cerrar modal con tecla ESC
    useEffect(() => {
        const manejarEscape = (e) => {
            if (e.key === "Escape" && mostrarModalForm) {
                setMostrarModalForm(false);
                setModoEditar(false);
                setUsuarioEditando(null);
            }
        };

        window.addEventListener("keydown", manejarEscape);

        return () => {
            window.removeEventListener("keydown", manejarEscape);
        };
    }, [mostrarModalForm]);



    // =========================================================
    // Render
    // =========================================================
    return (





        <div className="py-4" style={{ maxWidth: "1300px", margin: "0 auto" }}>
            <h2 className="fw-bold mb-4" style={{ color: "var(--color-primario)" }}>
                Administrar Usuarios
            </h2>

            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Buscador */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {/* Botones */}
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setMostrarEliminados(!mostrarEliminados)}
                >
                    {mostrarEliminados
                        ? "Ocultar usuarios eliminados"
                        : "Mostrar usuarios eliminados"}
                </button>

                <button
                    className="btn"
                    style={{
                        backgroundColor: "var(--color-primario)",
                        color: "var(--color-quinary)",
                    }}
                    onClick={abrirCrearUsuario}
                >
                    + Crear usuario
                </button>
            </div>






{/* Tabla usuarios activos */}
{cargando ? (
  <p>Cargando usuarios...</p>
) : (
  <div 
    className="d-flex justify-content-center mt-3"
    style={{ width: "100%" }}
  >
    <div style={{ width: "fit-content" }}>
      <table
        className="table table-striped align-middle"
        style={{ width: "auto", margin: "0 auto" }}
      >
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Registro</th>
            <th style={{ minWidth: "260px" }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuariosActivosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No hay usuarios registrados
              </td>
            </tr>
          ) : (
            usuariosActivosFiltrados.map((u) => (
              <tr key={u.id_usuario}>

                {/* Nombre en una sola línea */}
                <td
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "320px",
                  }}
                >
                  {u.nombre}
                </td>

                <td>{u.correo}</td>

                <td>
                  {u.role === "admin" ? (
                    <span className="badge bg-warning text-dark">Admin</span>
                  ) : (
                    <span className="badge bg-secondary">Usuario</span>
                  )}
                </td>

                <td>
                  {u.estado === 1 ? (
                    <span className="badge bg-success">Activo</span>
                  ) : (
                    <span className="badge bg-danger">Inactivo</span>
                  )}
                </td>

                <td
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "220px",
                  }}
                >
                  {u.fecha_registro
                    ? new Date(u.fecha_registro).toLocaleString()
                    : "-"}
                </td>

                <td>
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ gap: "6px", flexWrap: "nowrap" }}
                  >
                    <button
                      className="btn btn-warning btn-admin"
                      onClick={() => abrirEditarUsuario(u)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-secondary btn-admin"
                      onClick={() => cambiarEstado(u)}
                    >
                      {u.estado === 1 ? "Desactivar" : "Activar"}
                    </button>

                    <button
                      className="btn btn-info btn-admin"
                      onClick={() => cambiarRolAdmin(u)}
                    >
                      {u.role === "admin" ? "Quitar Admin" : "Hacer Admin"}
                    </button>

                    <button
                      className="btn btn-outline-primary btn-admin"
                      onClick={() => solicitarResetPassword(u)}
                    >
                      Reset clave
                    </button>

                    <button
                      className="btn btn-danger btn-admin"
                      onClick={() => solicitarEliminar(u)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}











            {/* Tabla usuarios eliminados */}
            {mostrarEliminados && (
                <div className="mt-4">
                    <h5 className="mb-3" style={{ color: "var(--color-primario)" }}>
                        Usuarios eliminados
                    </h5>

                    {usuariosEliminados.length === 0 ? (
                        <p className="text-muted">No hay usuarios eliminados.</p>
                    ) : (





                        <table
                            className="table table-striped align-middle"
                            style={{ width: "auto", margin: "0 auto" }}
                        >










                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosEliminados.map((u) => (
                                    <tr key={`eliminado-${u.id_usuario}`}>
                                        <td
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "320px"
                                            }}
                                        >
                                            {u.nombre}
                                        </td>                    <td>{u.correo}</td>
                                        <td>
                                            {u.role === "admin" ? (
                                                <span className="badge bg-warning text-dark">Admin</span>
                                            ) : (
                                                <span className="badge bg-secondary">Usuario</span>
                                            )}
                                        </td>

                                        <td>
                                            {u.estado === 1 ? (
                                                <span className="badge bg-success">Activo</span>
                                            ) : (
                                                <span className="badge bg-danger">Inactivo</span>
                                            )}
                                        </td>

                                        <td
                                            style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "220px"
                                            }}
                                        >
                                            {u.fecha_registro
                                                ? new Date(u.fecha_registro).toLocaleString()
                                                : "-"}
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-success btn-admin mb-1"
                                                onClick={() => solicitarRestaurar(u)}
                                            >
                                                Restaurar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Modal crear/editar usuario */}
            {mostrarModalForm && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div
                                className="modal-header"
                                style={{ backgroundColor: "var(--color-primario)" }}
                            >
                                <h5 className="modal-title text-white">
                                    {modoEditar ? "Editar usuario" : "Crear usuario"}
                                </h5>
                            </div>

                            <form onSubmit={manejarSubmitForm}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={nombreForm}
                                            onChange={(e) => setNombreForm(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Correo</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={correoForm}
                                            onChange={(e) => setCorreoForm(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {!modoEditar && (
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Rol inicial
                                            </label>
                                            <select
                                                className="form-select"
                                                value={roleForm}
                                                onChange={(e) => setRoleForm(e.target.value)}
                                            >
                                                <option value="user">Usuario</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="alert alert-danger py-2 mt-2">{error}</div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setMostrarModalForm(false);
                                            setModoEditar(false);
                                            setUsuarioEditando(null);
                                        }}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn"
                                        style={{
                                            backgroundColor: "var(--color-primario)",
                                            color: "var(--color-quinary)",
                                        }}
                                    >
                                        {modoEditar ? "Guardar cambios" : "Crear usuario"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal confirmar */}
            <ConfirmModal
                visible={modalConfirmVisible}
                title={modalTitle}
                message={modalMessage}
                onCancel={() => setModalConfirmVisible(false)}
                onConfirm={accionConfirm}
                confirmLabel={modalConfirmLabel}
            />

            {/* Modal contraseña */}
            {modalClaveVisible && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <div className="modal-dialog">
                        <div
                            className="modal-content"
                            style={{
                                borderRadius: "10px",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                            }}
                        >
                            <div
                                className="modal-header"
                                style={{ backgroundColor: "var(--color-primario)" }}
                            >
                                <h5 className="modal-title text-white">
                                    {modalClaveTitulo}
                                </h5>
                            </div>

                            <div className="modal-body">
                                <p>{modalClaveTexto}</p>

                                <p className="small text-muted mb-0">
                                    Recomiende al usuario cambiar esta contraseña temporal
                                    cuando inicie sesión por primera vez.
                                </p>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary me-2"
                                    onClick={copiarClave}
                                >
                                    Copiar contraseña
                                </button>

                                <button
                                    type="button"
                                    className="btn"
                                    style={{
                                        backgroundColor: "var(--color-primario)",
                                        color: "var(--color-quinary)",
                                    }}
                                    onClick={() => setModalClaveVisible(false)}
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}