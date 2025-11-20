// src/components/common/Footer.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// Botón para volver arriba
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #0d0d0d 0%, #000 100%)",
        color: "#ccc",
        paddingTop: "50px",
        marginTop: "80px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Container>

        {/* SECCIÓN SUPERIOR */}
        <Row className="text-center text-md-start mb-5">
          {/* Columna 1 */}
          <Col md={4} className="mb-4">
            <h5 className="text-uppercase fw-bold text-light mb-3">
              Organizador de Recetas
            </h5>
            <p style={{ maxWidth: "300px" }}>
              Administra tus recetas, ingredientes y listas de compras
              con una interfaz moderna y profesional.
            </p>
          </Col>

          {/* Columna 2 */}
          <Col md={4} className="mb-4">
            <h6 className="fw-bold text-light mb-3">Enlaces útiles</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Términos y Condiciones</a></li>
              <li><a href="#" className="footer-link">Política de Privacidad</a></li>
              <li><a href="#" className="footer-link">Centro de Ayuda</a></li>
              <li><a href="#" className="footer-link">Contacto</a></li>
            </ul>
          </Col>

          {/* Columna 3 */}
          <Col md={4} className="mb-4">
            <h6 className="fw-bold text-light mb-3">Síguenos</h6>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <a href="#" className="footer-social">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="footer-social">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="footer-social">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="#" className="footer-social">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* SECCIÓN INFERIOR */}
        <Row className="py-3 text-center text-md-between justify-content-between">
          <Col md="auto" className="mb-2">
            <span className="text-muted small">
              © {new Date().getFullYear()} Organizador de Recetas — Todos los derechos reservados.
            </span>
          </Col>

          <Col md="auto">
            <button
              onClick={scrollToTop}
              className="btn btn-outline-light btn-sm rounded-pill shadow-sm px-3 py-1"
            >
              ↑ Volver arriba
            </button>
          </Col>
        </Row>
      </Container>

      {/* ESTILOS ESPECIALES */}
      <style>{`
        .footer-link {
          color: #ccc;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer-link:hover {
          color: #fff;
          text-decoration: underline;
        }

        .footer-social {
          font-size: 1.5rem;
          color: #ccc;
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .footer-social:hover {
          color: #0d6efd;
          transform: translateY(-3px);
        }
      `}</style>
    </footer>
  );
}
