import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Actividad del usuario
  const [misRecetas, setMisRecetas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loadingRecetas, setLoadingRecetas] = useState(true);
  const [loadingFavoritos, setLoadingFavoritos] = useState(true);

  const apiBaseUrl = useMemo(
    () => process.env.REACT_APP_API_URL || "http://localhost:5000",
    []
  );

  // Cargar perfil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiBaseUrl}/api/usuarios/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data;
        setUser(data);
        setForm({
          nombre: data?.nombre || "",
          email: data?.correo || "",
        });
      } catch (err) {
        console.error("Error cargando perfil", err);
        setError(
          err.response?.data?.message ||
            "No pudimos cargar tu perfil. Intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [apiBaseUrl]);

  // Cargar recetas del usuario
  useEffect(() => {
    const loadRecetas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiBaseUrl}/api/recetas`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMisRecetas(res.data || []);
      } catch (err) {
        console.error("Error cargando recetas del usuario", err);
      } finally {
        setLoadingRecetas(false);
      }
    };

    loadRecetas();
  }, [apiBaseUrl]);

  // Cargar favoritos
  useEffect(() => {
    const loadFavoritos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiBaseUrl}/api/favoritos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavoritos(res.data?.data || []);
      } catch (err) {
        console.error("Error cargando favoritos", err);
      } finally {
        setLoadingFavoritos(false);
      }
    };

    loadFavoritos();
  }, [apiBaseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleEdit = () => {
    setError(null);
    setSuccess(null);
    setIsEditing((prev) => {
      const next = !prev;
      // Si estamos cancelando, restaurar valores originales
      if (!next && user) {
        setForm({
          nombre: user.nombre || "",
          email: user.correo || "",
        });
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiBaseUrl}/api/usuarios/profile`,
        { nombre: form.nombre, email: form.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar usuario en memoria
      setUser((prev) =>
        prev
          ? {
              ...prev,
              nombre: form.nombre,
              correo: form.email,
            }
          : prev
      );

      setSuccess("Perfil actualizado exitosamente.");
      setIsEditing(false);
    } catch (err) {
      console.error("Error actualizando perfil", err);
      setError(
        err.response?.data?.message ||
          "No se pudo actualizar el perfil. Intenta nuevamente."
      );
    } finally {
      setSaving(false);
    }
  };

  // Distintos estados de carga / error
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span className="fw-semibold">Cargando tu perfil…</span>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-4">
        <p>No se encontró la información del usuario.</p>
      </div>
    );
  }

  const inicial = user.nombre?.trim().charAt(0).toUpperCase() || "?";
  const fechaFormateada = user.fecha_registro
    ? new Date(user.fecha_registro).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="profile-page-wrapper py-4">
      <div className="container">
        {/* HERO SUPERIOR */}
        <div className="profile-hero mb-4">
          <div className="profile-hero-gradient" />
          <div className="profile-hero-content container">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="profile-avatar">
                  <span>{inicial}</span>
                </div>
                <div>
                  <p className="text-uppercase small mb-1 text-white-50">
                    Mi cuenta
                  </p>
                  <h1 className="h4 mb-1 text-white">{user.nombre}</h1>
                  <p className="mb-0 text-white-50">{user.correo}</p>
                </div>
              </div>

              <div className="text-md-end">
                {fechaFormateada && (
                  <p className="text-white-50 small mb-1">
                    Usuario desde {fechaFormateada}
                  </p>
                )}

                <button
                  type="button"
                  className={`btn ${
                    isEditing ? "btn-outline-light" : "btn-light"
                  } btn-sm fw-semibold`}
                  onClick={handleToggleEdit}
                >
                  {isEditing ? "Cancelar" : "Editar perfil"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Información básica */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">Información básica</h2>

                {error && (
                  <div className="alert alert-danger py-2 small">{error}</div>
                )}
                {success && (
                  <div className="alert alert-success py-2 small">
                    {success}
                  </div>
                )}

                {!isEditing ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <p className="text-muted mb-1 small">Nombre</p>
                      <p className="fw-semibold mb-0">{user.nombre}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="text-muted mb-1 small">Correo</p>
                      <p className="fw-semibold mb-0">{user.correo}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-2">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleToggleEdit}
                        disabled={saving}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm px-3"
                        disabled={saving}
                      >
                        {saving ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <h2 className="h6 mb-3">📊 Actividad reciente</h2>

                {loadingRecetas && loadingFavoritos ? (
                  <div>Cargando actividad...</div>
                ) : (
                  <div className="row g-3">
                    {/* Última receta creada */}
                    <div className="col-md-6">
                      <div className="activity-card">
                        <p className="text-muted small mb-1">
                          Última receta creada
                        </p>
                        {misRecetas.length > 0 ? (
                          <>
                            <p className="fw-semibold mb-1">
                              {misRecetas[misRecetas.length - 1].nombre}
                            </p>
                            <Link
                              to={`/recetas/${
                                misRecetas[misRecetas.length - 1].id_receta
                              }`}
                              className="btn btn-sm btn-outline-primary rounded-pill"
                            >
                              Ver receta
                            </Link>
                          </>
                        ) : (
                          <p className="text-muted small">
                            No tienes recetas.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Último favorito */}
                    <div className="col-md-6">
                      <div className="activity-card">
                        <p className="text-muted small mb-1">
                          Último favorito agregado
                        </p>
                        {favoritos.length > 0 ? (
                          <>
                            <p className="fw-semibold mb-1">
                              {favoritos[0].nombre}
                            </p>
                            <Link
                              to={`/recetas/${favoritos[0].id_receta}`}
                              className="btn btn-sm btn-outline-warning rounded-pill"
                            >
                              Ver receta ⭐
                            </Link>
                          </>
                        ) : (
                          <p className="text-muted small">
                            No has agregado favoritos.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mis Recetas */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <h2 className="h6 mb-3">👨‍🍳 Mis Recetas</h2>

                {loadingRecetas ? (
                  <p>Cargando recetas...</p>
                ) : misRecetas.length === 0 ? (
                  <p className="text-muted small">Aún no has creado recetas.</p>
                ) : (
                  <div className="row g-3">
                    {misRecetas.map((receta) => (
                      <div key={receta.id_receta} className="col-md-6">
                        <div className="recipe-card shadow-sm rounded-3">
                          <div className="recipe-img">
                            <img
                              src={`${apiBaseUrl}/uploads/recetas/${receta.imagen}`}
                              alt={receta.nombre}
                            />
                          </div>
                          <div className="recipe-content">
                            <h6 className="fw-semibold mb-1">
                              {receta.nombre}
                            </h6>
                            <p className="text-muted small mb-2">
                              {receta.categoria}
                            </p>
                            <Link
                              to={`/recetas/${receta.id_receta}`}
                              className="btn btn-sm btn-outline-primary rounded-pill"
                            >
                              Ver receta
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mis Favoritos */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <h2 className="h6 mb-3">⭐ Mis Favoritos</h2>

                {loadingFavoritos ? (
                  <p>Cargando favoritos...</p>
                ) : favoritos.length === 0 ? (
                  <p className="text-muted small">
                    No tienes recetas en favoritos.
                  </p>
                ) : (
                  <div className="row g-3">
                    {favoritos.map((fav) => (
                      <div key={fav.id_receta} className="col-md-6">
                        <div className="recipe-card shadow-sm rounded-3">
                          <div className="recipe-img">
                            <img
                              src={`${apiBaseUrl}/uploads/recetas/${fav.imagen}`}
                              alt={fav.nombre}
                            />
                          </div>
                          <div className="recipe-content">
                            <h6 className="fw-semibold mb-1">{fav.nombre}</h6>
                            <p className="text-muted small mb-2">
                              {fav.categoria}
                            </p>
                            <Link
                              to={`/recetas/${fav.id_receta}`}
                              className="btn btn-sm btn-outline-warning rounded-pill"
                            >
                              Ver receta ⭐
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estilos específicos de esta página */}
        <style>{`
          .profile-page-wrapper {
            background: radial-gradient(circle at top left, #f5f3ff, #f9fafb 40%, #f1f5f9);
            min-height: 100vh;
          }

          .profile-hero {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            background: linear-gradient(135deg, #4f46e5, #6366f1, #0ea5e9);
            color: #fff;
          }

          .profile-hero-gradient {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at top left, rgba(250,250,250,0.18), transparent 60%);
            opacity: 0.9;
          }

          .profile-hero-content {
            position: relative;
            padding: 20px 16px;
          }

          @media (min-width: 768px) {
            .profile-hero-content {
              padding: 24px 32px;
            }
          }

          .profile-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.4rem;
            color: #f9fafb;
            backdrop-filter: blur(6px);
          }

          .activity-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 12px;
            border-radius: 12px;
          }

          .recipe-card {
            background: white;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            display: flex;
          }

          .recipe-img img {
            width: 90px;
            height: 90px;
            object-fit: cover;
            border-right: 1px solid #e2e8f0;
          }

          .recipe-content {
            padding: 10px;
            flex: 1;
          }
        `}</style>
      </div>
    </div>
  );
}
