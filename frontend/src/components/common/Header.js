import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Header() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const avatarUrl = user?.avatar
    ? `http://localhost:5000/uploads/usuarios/${user.avatar}`
    : null;

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm py-3"
      style={{
        backgroundColor: "#652A1C",
      }}
    >
      <div className="container">

        <span
          className="navbar-brand d-flex align-items-center gap-2"
          style={{ cursor: "pointer", color: "#F9ECDB" }}
          onClick={() => navigate("/")}
        >
          <i className="bi bi-book-half fs-3" style={{ color: "#FFC000" }}></i>
          <span className="fw-bold fs-4">Organizador de Recetas</span>
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          style={{ borderColor: "#F9ECDB" }}
        >
          <i className="bi bi-list fs-1" style={{ color: "#F9ECDB" }}></i>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink className="nav-link" to="/recetas"
                style={({ isActive }) => ({
                  color: isActive ? "#FFC000" : "#F9ECDB",
                })}
              >
                <i className="bi bi-journal-text me-2"></i>
                Recetario
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/ingredientes"
                style={({ isActive }) => ({
                  color: isActive ? "#FFC000" : "#F9ECDB",
                })}
              >
                <i className="bi bi-bag-check me-2"></i>
                Ingredientes
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/favoritos"
                style={({ isActive }) => ({
                  color: isActive ? "#FFC000" : "#F9ECDB",
                })}
              >
                <i className="bi bi-heart-fill me-2" style={{ color: "#FFC000" }}></i>
                Favoritos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/shopping-list"
                style={({ isActive }) => ({
                  color: isActive ? "#FFC000" : "#F9ECDB",
                })}
              >
                <i className="bi bi-cart-check me-2"></i>
                Lista de Compras
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">

            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                role="button"
                data-bs-toggle="dropdown"
                style={{ color: "#F9ECDB" }}
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

              <ul className="dropdown-menu dropdown-menu-end shadow-lg"
                style={{ backgroundColor: "#F5DFBE" }}
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
                    style={{ color: "#652A1C" }}
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
