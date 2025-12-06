import React, { useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const { correo } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const validarPassword = (txt) => {
    if (txt.length < 6) return "Muy corta";
    if (!/[A-Z]/.test(txt)) return "Debe incluir una mayúscula";
    if (!/[0-9]/.test(txt)) return "Debe incluir un número";
    return "Segura";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (validarPassword(password) !== "Segura") {
      setError("La contraseña no cumple los requisitos de seguridad.");
      return;
    }

    try {
      const res = await api.post("/auth/reset-password", {
        correo,
        password,
      });

      setMensaje(res.data.mensaje);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError("No fue posible actualizar la contraseña.");
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
            className="bi bi-shield-lock-fill"
            style={{ fontSize: "3.5rem", color: "var(--color-terciario)" }}
          ></i>

          <h2 className="fw-bold mt-2" style={{ color: "var(--color-primario)" }}>
            Nueva contraseña
          </h2>

          <p style={{ color: "var(--color-texto)" }}>
            Para el correo: <strong>{correo}</strong>
          </p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-semibold" style={{ color: "var(--color-primario)" }}>
            Nueva contraseña
          </label>

          <div className="input-group mb-2">
            <input
              type={mostrar ? "text" : "password"}
              className="form-control form-control-lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="btn"
              onClick={() => setMostrar(!mostrar)}
              style={{
                backgroundColor: "var(--color-cuaternario)",
                border: "1px solid var(--color-cuaternario)",
              }}
            >
              <i className={`bi ${mostrar ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
            </button>
          </div>

          {/* Indicador de fuerza */}
          <small
            className="fw-semibold"
            style={{
              color:
                validarPassword(password) === "Segura"
                  ? "green"
                  : "var(--color-terciario)",
            }}
          >
            {password.length > 0 && validarPassword(password)}
          </small>

          <button
            className="w-100 py-2 fw-semibold mt-4"
            style={{
              backgroundColor: "var(--color-primario)",
              color: "var(--color-quinary)",
              borderRadius: "10px",
              border: "none",
              transition: "0.3s",
            }}
          >
            Guardar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
