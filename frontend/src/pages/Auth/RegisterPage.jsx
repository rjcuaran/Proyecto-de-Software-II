import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { registerUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await registerUser(nombre, email, password);

    if (res.error) {
      setError(res.error);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "480px" }}>
      <Card className="p-4 shadow">
        <h3 className="text-center mb-3">Crear cuenta</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Registrarse
          </Button>
        </Form>

        <p className="text-center mt-3">
          ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </p>
      </Card>
    </div>
  );
}
