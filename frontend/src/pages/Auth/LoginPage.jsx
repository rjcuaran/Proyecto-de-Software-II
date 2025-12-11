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

  // Modal de error elegante
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const closeModal = () => {
    setShowErrorModal(false);
    setModalMessage("");
  };


// Cerrar modal con tecla ESC
React.useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape" && showErrorModal) {
      closeModal();
    }
  };

  window.addEventListener("keydown", handleEsc);

  return () => {
    window.removeEventListener("keydown", handleEsc);
  };
}, [showErrorModal]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      authService.login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      console.error(err);

      const msg =
        err.response?.data?.mensaje || "Credenciales incorrectas.";

      // Activar modal elegante
      setModalMessage(msg);
      setShowErrorModal(true);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundColor: "var(--color-secundario)",
      }}
    >
      {/* MODAL ELEGANTE DE ERROR */}
      {showErrorModal && (
        <div
          className="modal-backdrop-custom"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={closeModal}
        >
          <div
            className="modal-contenido"
            style={{
              backgroundColor: "var(--color-quinary)",
              borderRadius: "15px",
              padding: "25px",
              width: "90%",
              maxWidth: "420px",
              border: "3px solid var(--color-primario)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.2s ease-in-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4
              className="fw-bold text-center mb-3"
              style={{ color: "var(--color-primario)" }}
            >
              Atención
            </h4>

            <p
              className="text-center"
              style={{ color: "var(--color-texto)", fontSize: "1.1rem" }}
            >
              {modalMessage}
            </p>

            <div className="d-flex justify-content-center mt-4">
              <button
                onClick={closeModal}
                style={{
                  backgroundColor: "var(--color-primario)",
                  color: "var(--color-quinary)",
                  border: "none",
                  padding: "10px 25px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARD LOGIN */}
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
