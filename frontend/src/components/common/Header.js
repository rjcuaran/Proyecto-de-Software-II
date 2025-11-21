// src/components/common/Header.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className="container">

        {/* LOGO */}
        <span
          className="navbar-brand d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <i className="bi bi-book-half fs-3 text-warning"></i>
          <span className="fw-bold fs-4">Organizador de Recetas</span>
        </span>

        {/* BOTÓN RESPONSIVE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-1"></i>
        </button>

        {/* CONTENIDO */}
        <div className="collapse navbar-collapse" id="mainNavbar">

          {/* MENÚ IZQUIERDA */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink className="nav-link" to="/recetas">
                <i className="bi bi-journal-text me-2"></i>
                Recetario
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/ingredientes">
                <i className="bi bi-bag-check me-2"></i>
                Ingredientes
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/favoritos">
                <i className="bi bi-heart-fill text-danger me-2"></i>
                Favoritos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/shopping-list">
                <i className="bi bi-cart-check me-2"></i>
                Lista de Compras
              </NavLink>
            </li>
          </ul>

          {/* MENÚ DERECHO (Perfil) */}
          <ul className="navbar-nav ms-auto">

            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                role="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle fs-4"></i> Usuario
              </span>

              <ul className="dropdown-menu dropdown-menu-end shadow-lg">

                <li>
                  <NavLink className="dropdown-item" to="/perfil">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    Mi Perfil
                  </NavLink>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <button
                    className="dropdown-item text-danger fw-semibold"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar sesión
                  </button>
                </li>

              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
