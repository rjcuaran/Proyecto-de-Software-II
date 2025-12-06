import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/auth";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      authService.login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundColor: "var(--color-secundario)",
      }}
    >
      <div
        className="shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "20px",
          backgroundColor: "var(--color-quinary)",
          border: "2px solid var(--color-cuaternario)",
        }}
      >
        {/* ICONO / LOGO */}
        <div className="text-center mb-4">
          <i
            className="bi bi-egg-fried"
            style={{
              fontSize: "4rem",
              color: "var(--color-terciario)",
            }}
          ></i>

          <h2
            className="fw-bold mt-2"
            style={{ color: "var(--color-primario)" }}
          >
            Organizador de Recetas
          </h2>

          <p style={{ color: "var(--color-texto)" }}>
            Bienvenido de nuevo, inicia sesión
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="mb-3">
            <label
              className="form-label fw-semibold"
              style={{ color: "var(--color-primario)" }}
            >
              <i
                className="bi bi-envelope-fill me-2"
                style={{ color: "var(--color-terciario)" }}
              ></i>
              Correo electrónico
            </label>

            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD + SHOW/HIDE */}
          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{ color: "var(--color-primario)" }}
            >
              <i
                className="bi bi-lock-fill me-2"
                style={{ color: "var(--color-terciario)" }}
              ></i>
              Contraseña
            </label>

            <div className="input-group">
              <input
                type={mostrar ? "text" : "password"}
                className="form-control form-control-lg"
                placeholder="••••••••"
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
                <i
                  className={`bi ${
                    mostrar ? "bi-eye-slash-fill" : "bi-eye-fill"
                  }`}
                ></i>
              </button>
            </div>
          </div>

          {/* BOTÓN LOGIN */}
          <button
            className="w-100 py-2 fw-semibold"
            style={{
              backgroundColor: "var(--color-primario)",
              color: "var(--color-quinary)",
              borderRadius: "8px",
              border: "none",
            }}
          >
            Iniciar sesión
          </button>
        </form>

        {/* ENLACES */}
        <div className="text-center mt-3">
          <p style={{ color: "var(--color-texto)" }}>
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="fw-semibold"
              style={{ color: "var(--color-terciario)" }}
            >
              Crear cuenta
            </Link>
          </p>

          <Link
            to="/forgot-password"
            style={{ color: "var(--color-terciario)" }}
            className="fw-semibold"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
}
