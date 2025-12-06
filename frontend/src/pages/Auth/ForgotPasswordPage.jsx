import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const res = await api.post("/auth/forgot-password", { correo });
      setMensaje(res.data.mensaje);

      if (res.data.existe) {
        setTimeout(() => {
          navigate(`/reset-password/${correo}`);
        }, 1200);
      }

    } catch (err) {
      console.error(err);
      setError("Hubo un problema procesando la solicitud.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "var(--color-secundario)" }}
    >
      <div
        className="p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "22px",
          backgroundColor: "var(--color-quinary)",
          border: "2px solid var(--color-cuaternario)",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <div className="text-center mb-3">
          <i
            className="bi bi-key-fill"
            style={{ fontSize: "3.5rem", color: "var(--color-terciario)" }}
          ></i>

          <h2 className="fw-bold mt-2" style={{ color: "var(--color-primario)" }}>
            Recuperar contraseña
          </h2>

          <p style={{ color: "var(--color-texto)" }}>
            Escribe tu correo registrado
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        {mensaje && (
          <div className="alert alert-success py-2">{mensaje}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-semibold" style={{ color: "var(--color-primario)" }}>
            Correo electrónico
          </label>

          <input
            type="email"
            className="form-control form-control-lg mb-4"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <button
            className="w-100 py-2 fw-semibold"
            style={{
              backgroundColor: "var(--color-primario)",
              color: "var(--color-quinary)",
              borderRadius: "10px",
              border: "none",
              transition: "0.3s",
            }}
          >
            Buscar cuenta
          </button>
        </form>
      </div>
    </div>
  );
}
