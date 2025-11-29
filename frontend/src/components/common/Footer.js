// src/components/common/Footer.js
import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ backgroundColor: "#652A1C", color: "#F9ECDB" }}
      className="mt-auto py-4"
    >
      <div className="container">
        <div className="row gy-4">

          {/* BRAND */}
          <div className="col-md-4 text-center">
            <h4 className="fw-bold" style={{ color: "#FFC000" }}>
              <i className="bi bi-journal-bookmark-fill me-2"></i>
              Organizador de Recetas
            </h4>
            <p className="small" style={{ color: "#F9ECDB" }}>
              Administra tus recetas, ingredientes y lista de compras en un solo lugar.
            </p>
          </div>

          {/* LINKS */}
          <div className="col-md-4 text-center">
            <h6 className="text-uppercase" style={{ color: "#FFC000" }}>
              Navegación
            </h6>
            <ul className="list-unstyled small">
              <li>
                <a
                  href="/recetas"
                  style={{ color: "#FFFFFF" }}
                  className="text-decoration-none"
                >
                  Mis Recetas
                </a>
              </li>
              <li>
                <a
                  href="/favoritos"
                  style={{ color: "#FFFFFF" }}
                  className="text-decoration-none"
                >
                  Favoritos
                </a>
              </li>
              <li>
                <a
                  href="/shopping-list"
                  style={{ color: "#FFFFFF" }}
                  className="text-decoration-none"
                >
                  Lista de compras
                </a>
              </li>
              <li>
                <a
                  href="/perfil"
                  style={{ color: "#FFFFFF" }}
                  className="text-decoration-none"
                >
                  Mi perfil
                </a>
              </li>
            </ul>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="col-md-4 text-center">
            <div className="d-flex justify-content-center align-items-center gap-3">

              {/* Texto "Sígueme" pegado a los iconos */}
              <h6
                className="text-uppercase m-0"
                style={{ color: "#FFC000" }}
              >
                Sígueme
              </h6>

              {/* Iconos */}
              <div className="d-flex gap-2 fs-4">
                <a href="#" style={{ color: "#FFFFFF" }}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" style={{ color: "#FFFFFF" }}>
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" style={{ color: "#FFFFFF" }}>
                  <i className="bi bi-youtube"></i>
                </a>
              </div>

            </div>
          </div>

        </div>

        <hr style={{ borderColor: "#F5DFBE" }} className="my-3" />

        <div className="text-center small" style={{ color: "#F9ECDB" }}>
          © {year} Organizador de Recetas – Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
