import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/auth";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-lg border-0 p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "18px",
        }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-egg-fried text-warning" style={{ fontSize: "4rem" }}></i>
          <h2 className="fw-bold mt-2 text-primary">Organizador de Recetas</h2>
          <p className="text-muted">Bienvenido de nuevo, inicia sesión</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-envelope-fill me-2 text-primary"></i>
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

          <div className="mb-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-lock-fill me-2 text-primary"></i>
              Contraseña
            </label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100 py-2 fw-semibold mb-3">
            Iniciar sesión
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="fw-semibold">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
