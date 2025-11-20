import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await authService.loginUser(form.email, form.password);

      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "430px" }}>
      <h3 className="text-center mb-4">Iniciar Sesión</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={onSubmit}>
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
        <button className="btn btn-primary w-100">Ingresar</button>
      </form>
    </div>
  );
}
