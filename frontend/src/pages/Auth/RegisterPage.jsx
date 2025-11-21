import React, { useState } from "react";
import axios from "axios";
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        nombre,
        correo,
        password,
      });

      setSuccess("Registro exitoso. Redirigiendo...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("❌ Error en registro:", err);
      setError("No fue posible registrarte. Revisa tus datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card className="shadow-lg p-4 rounded-4" style={{ maxWidth: "430px", width: "100%" }}>
        <h2 className="fw-bold text-center mb-3 text-primary">
          Crear una cuenta
        </h2>
        <p className="text-center text-muted mb-4">
          Regístrate para comenzar a organizar tus recetas 🍽️
        </p>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="ejemplo@gmail.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Registrando...
              </>
            ) : (
              "Registrarme"
            )}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small>
            ¿Ya tienes cuenta?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Inicia sesión
            </span>
          </small>
        </div>
      </Card>
    </div>
  );
}
