// src/components/common/Footer.js
import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-auto py-4">
      <div className="container">
        <div className="row gy-4">

          {/* BRAND */}
          <div className="col-md-4 text-center text-md-start">
            <h4 className="fw-bold text-info">
              <i className="bi bi-journal-bookmark-fill me-2"></i>
              Organizador de Recetas
            </h4>
            <p className="text-muted small">
              Administra tus recetas, ingredientes y lista de compras en un solo lugar.
            </p>
          </div>

          {/* LINKS */}
          <div className="col-md-4 text-center">
            <h6 className="text-uppercase text-info">Navegación</h6>
            <ul className="list-unstyled small">
              <li><a href="/recetas" className="text-light text-decoration-none">Mis Recetas</a></li>
              <li><a href="/favoritos" className="text-light text-decoration-none">Favoritos</a></li>
              <li><a href="/shopping-list" className="text-light text-decoration-none">Lista de compras</a></li>
              <li><a href="/perfil" className="text-light text-decoration-none">Mi perfil</a></li>
            </ul>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="col-md-4 text-center text-md-end">
            <h6 className="text-uppercase text-info">Sígueme</h6>
            <div className="d-flex justify-content-center justify-content-md-end gap-3 fs-4">
              <a href="#" className="text-light">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

        </div>

        <hr className="border-secondary my-3"/>

        <div className="text-center small text-muted">
          © {year} Organizador de Recetas – Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
