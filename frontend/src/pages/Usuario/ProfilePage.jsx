import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const apiBaseUrl = useMemo(
    () => process.env.REACT_APP_API_URL || "http://localhost:5000",
    []
  );

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${apiBaseUrl}/api/usuarios/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.data);
      } catch (err) {
        console.error("Error cargando perfil", err);
        setError(
          err.response?.data?.message ||
            "No pudimos cargar tu perfil. Intenta nuevamente."
        );
      }
    };

    loadProfile();
  }, [apiBaseUrl]);

  if (error) {
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
        <div className="d-flex align-items-center gap-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span className="fw-semibold">Cargando tu perfil…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3">
                <div>
                  <p className="text-muted mb-1">Cuenta</p>
                  <h2 className="h4 mb-0">👤 Mi Perfil</h2>
                  <p className="text-muted mb-0 small">{user.correo}</p>
                </div>

                <button type="button" className="btn btn-outline-primary mt-3 mt-md-0">
                  Editar perfil
                </button>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="border rounded-3 p-3 bg-light">
                    <p className="text-muted mb-1">Nombre</p>
                    <p className="h6 mb-0">{user.nombre}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border rounded-3 p-3 bg-light">
                    <p className="text-muted mb-1">Registrado</p>
                    <p className="h6 mb-0">
                      {new Date(user.fecha_registro).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
