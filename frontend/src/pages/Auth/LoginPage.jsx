import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { loginUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await loginUser(email, password);

    if (res.error) {
      setError(res.error);
    } else {
      navigate("/recetas");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "480px" }}>
      <Card className="p-4 shadow">
        <h3 className="text-center mb-3">Iniciar sesión</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
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

          <Button variant="primary" type="submit" className="w-100">
            Entrar
          </Button>
        </Form>

        <p className="text-center mt-3">
          ¿No tienes cuenta? <a href="/register">Crear cuenta</a>
        </p>
      </Card>
    </div>
  );
}
