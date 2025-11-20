// src/components/common/Header.js
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";

export default function Header() {
  const navigate = useNavigate();
  const usuario = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-sm py-2"
      style={{ background: "#1f1f1f" }}
    >
      <Container>

        {/* LOGO */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold d-flex align-items-center gap-2"
          style={{ fontSize: "1.35rem" }}
        >
          <img
            src="/logo192.png"
            alt="Logo"
            width="32"
            height="32"
            className="rounded"
          />
          Organizador de Recetas
        </Navbar.Brand>

        {/* Toggle */}
        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">

          {/* MENÚ IZQUIERDO */}
          {usuario && (
            <Nav className="me-auto">

              <NavLink
                to="/"
                className="nav-link px-3"
              >
                🏠 Inicio
              </NavLink>

              <NavLink
                to="/recetas"
                className="nav-link px-3"
              >
                📖 Mis Recetas
              </NavLink>

              <NavLink
                to="/recetas/nueva"
                className="nav-link px-3"
              >
                ✨ Crear Receta
              </NavLink>

              <NavLink
                to="/favoritos"
                className="nav-link px-3"
              >
                ⭐ Favoritos
              </NavLink>

              <NavLink
                to="/shopping-list"
                className="nav-link px-3"
              >
                🛒 Lista de Compras
              </NavLink>

  {/* 👇 Ícono temporal para pruebas */}
  <i className="bi bi-star-fill text-warning fs-3"></i>

            </Nav>
          )}

          {/* MENÚ DERECHO */}
          <Nav>
            {!usuario ? (
              <>
                <NavLink to="/login" className="nav-link px-3">
                  Iniciar Sesión
                </NavLink>
                <NavLink to="/register" className="nav-link px-3">
                  Registrarse
                </NavLink>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-light"
                  id="dropdown-user"
                  className="d-flex align-items-center gap-2"
                  style={{
                    borderRadius: "50px",
                    padding: "6px 12px",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Image
                    src={`https://ui-avatars.com/api/?name=${usuario.nombre}&background=random`}
                    roundedCircle
                    width="32"
                    height="32"
                  />
                  <span>{usuario.nombre}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow rounded-3">
                  <Dropdown.Item as={Link} to="/perfil">
                    👤 Mi Perfil
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={cerrarSesion} className="text-danger">
                    🚪 Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
