import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import { useSiteConfig } from "../../context/SiteConfigContext";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Header() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const { config } = useSiteConfig();

  // Logo dinámico (si existe)


const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const logoUrl = config?.logo
  ? `http://localhost:3000/uploads/configuracion/${config.logo}`
  : null; // o fallback si quieres mostrar algo






  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Avatar usuario
  const avatarUrl = user?.avatar
    ? `http://localhost:3000/uploads/usuarios/${user.avatar}`
    : null;

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm py-3"
      style={{
        backgroundColor: "var(--color-primario)",
      }}
    >
      <div className="container">

        {/* LOGO + NOMBRE */}
        <span
          className="navbar-brand d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          {/* LOGO DINÁMICO (SI EXISTE) */}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="logo"
              style={{
                height: "40px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          ) : (
            <i
              className="bi bi-book-half"
              style={{
                fontSize: "2rem",
                color: "var(--color-terciario)",
              }}
            ></i>
          )}

          {/* TEXTO DEL SITIO */}
          <span
            className="fw-bold fs-4"
            style={{ color: "var(--color-secundario)" }}
          >
            Organizador de Recetas
          </span>
        </span>

        {/* BOTÓN RESPONSIVE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          style={{ borderColor: "var(--color-secundario)" }}
        >
          <i
            className="bi bi-list fs-1"
            style={{ color: "var(--color-secundario)" }}
          ></i>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">

          {/* MENÚ DE OPCIONES */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/recetas"
                style={({ isActive }) => ({
                  color: isActive
                    ? "var(--color-terciario)"
                    : "var(--color-secundario)",
                })}
              >
                <i className="bi bi-journal-text me-2"></i>
                Recetario
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/ingredientes"
                style={({ isActive }) => ({
                  color: isActive
                    ? "var(--color-terciario)"
                    : "var(--color-secundario)",
                })}
              >
                <i className="bi bi-bag-check me-2"></i>
                Ingredientes
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/favoritos"
                style={({ isActive }) => ({
                  color: isActive
                    ? "var(--color-terciario)"
                    : "var(--color-secundario)",
                })}
              >
                <i
                  className="bi bi-heart-fill me-2"
                  style={{ color: "var(--color-terciario)" }}
                ></i>
                Favoritos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/shopping-list"
                style={({ isActive }) => ({
                  color: isActive
                    ? "var(--color-terciario)"
                    : "var(--color-secundario)",
                })}
              >
                <i className="bi bi-cart-check me-2"></i>
                Lista de Compras
              </NavLink>
            </li>

            {user?.role === "admin" && (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/admin"
                  style={({ isActive }) => ({
                    color: isActive
                      ? "var(--color-terciario)"
                      : "var(--color-secundario)",
                  })}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Panel Admin
                </NavLink>
              </li>
            )}
          </ul>

          {/* DERECHA: INGRESAR / USUARIO */}
          <ul className="navbar-nav ms-auto">

            {/* SI NO HAY USUARIO: MOSTRAR INGRESAR */}
            {!user && (
              <li className="nav-item">
                <span
                  className="nav-link d-flex align-items-center gap-2"
                  style={{ cursor: "pointer", color: "var(--color-secundario)" }}
                  onClick={() => navigate("/login")}
                >
                  <i className="bi bi-person-circle fs-4"></i>
                  <span className="fw-semibold">Ingresar</span>
                </span>
              </li>
            )}

            {/* SI HAY USUARIO: MOSTRAR PERFIL */}
            {user && (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{ color: "var(--color-secundario)" }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="bi bi-person-circle fs-4"></i>
                  )}

                  <span>{user?.nombre || "Usuario"}</span>
                </span>

                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg"
                  style={{ backgroundColor: "var(--color-cuaternario)" }}
                >
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
                      className="dropdown-item fw-semibold"
                      onClick={handleLogout}
                      style={{ color: "var(--color-primario)" }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}
