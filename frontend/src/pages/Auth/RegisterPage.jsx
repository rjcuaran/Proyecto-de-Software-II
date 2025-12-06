import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Form,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  const [password, setPassword] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ------------------------ VALIDACIÓN DE CONTRASEÑA ------------------------ */
  const requisitos = {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /[0-9]/.test(password),
    simbolo: /[\W_]/.test(password),
  };

  const passwordValida = Object.values(requisitos).every(Boolean);

  /* ---------------------------- ENVÍO DEL FORM ----------------------------- */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordValida) {
      setError("La contraseña no cumple los requisitos mínimos.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
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
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundColor: "var(--color-secundario)",
      }}
    >
      <Card
        className="shadow-lg p-4 rounded-4"
        style={{
          maxWidth: "430px",
          width: "100%",
          backgroundColor: "var(--color-quinary)",
          border: "2px solid var(--color-cuaternario)",
        }}
      >
        <h2
          className="fw-bold text-center mb-3"
          style={{ color: "var(--color-primario)" }}
        >
          Crear una cuenta
        </h2>

        <p className="text-center mb-4" style={{ color: "var(--color-texto)" }}>
          Regístrate para comenzar a organizar tus recetas 🍽️
        </p>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleRegister}>
          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ color: "var(--color-primario)" }}>
              Nombre completo
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          {/* Correo */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold" style={{ color: "var(--color-primario)" }}>
              Correo electrónico
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="ejemplo@gmail.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </Form.Group>

          {/* CONTRASEÑA + VALIDACIONES */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold" style={{ color: "var(--color-primario)" }}>
              Contraseña
            </Form.Label>

            {/* Campo con mostrar/ocultar */}
            <InputGroup>
              <Form.Control
                type={mostrarPass ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="button"
                onClick={() => setMostrarPass(!mostrarPass)}
                style={{
                  backgroundColor: "var(--color-cuaternario)",
                  borderColor: "var(--color-cuaternario)",
                }}
              >
                <i
                  className={
                    mostrarPass ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
                  }
                ></i>
              </Button>
            </InputGroup>

            {/* Reglas dinámicas */}
            {password.length > 0 && (
              <div className="mt-3 ms-1 small">
                <p className="fw-semibold mb-1" style={{ color: "var(--color-primario)" }}>
                  La contraseña debe contener:
                </p>

                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {Object.entries(requisitos).map(([regla, cumple], idx) => {
                    const textos = {
                      longitud: "Mínimo 8 caracteres",
                      mayuscula: "Una letra mayúscula",
                      minuscula: "Una letra minúscula",
                      numero: "Un número",
                      simbolo: "Un símbolo especial (!@#$%&*)",
                    };

                    return (
                      <li key={idx}>
                        <i
                          className={`bi ${
                            cumple
                              ? "bi-check-circle-fill"
                              : "bi-x-circle-fill"
                          } me-2`}
                          style={{
                            color: cumple ? "green" : "red",
                          }}
                        ></i>
                        {textos[regla]}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </Form.Group>

          {/* BOTÓN */}
          <Button
            type="submit"
            className="w-100 py-2 fw-semibold"
            style={{
              backgroundColor: "var(--color-primario)",
              borderColor: "var(--color-primario)",
              color: "var(--color-quinary)",
              borderRadius: "8px",
              opacity: passwordValida ? 1 : 0.6,
            }}
            disabled={loading || !passwordValida}
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

        {/* LOGIN */}
        <div className="text-center mt-3">
          <small style={{ color: "var(--color-texto)" }}>
            ¿Ya tienes cuenta?{" "}
            <span
              className="fw-semibold"
              style={{ color: "var(--color-terciario)", cursor: "pointer" }}
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
