import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authService.registerUser(
        form.nombre,
        form.email,
        form.password
      );

      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("No se pudo registrar");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "430px" }}>
      <h3 className="text-center mb-4">Crear Cuenta</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="nombre"
          className="form-control mb-3"
          placeholder="Nombre completo"
          onChange={onChange}
        />

        <input
          type="email"
          name="email"
          className="form-control mb-3"
          placeholder="Correo"
          onChange={onChange}
        />

        <input
          type="password"
          name="password"
          className="form-control mb-3"
          placeholder="Contraseña"
          onChange={onChange}
        />

        <button className="btn btn-success w-100">Registrarse</button>
      </form>
    </div>
  );
}
