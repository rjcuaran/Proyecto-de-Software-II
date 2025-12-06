import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSiteConfig } from "../../context/SiteConfigContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { config } = useSiteConfig();

  // Backend está en el puerto 5000
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Logo dinámico desde configuración del sitio (si existe)
const logoUrl = config?.logo
  ? `http://localhost:3000/uploads/configuracion/${config.logo}`
  : null;


  return (
    <footer
      className="mt-auto py-4"
      style={{
        backgroundColor: "var(--color-primario)",
        color: "var(--color-secundario)",
      }}
    >
      <div className="container">
        <div className="row gy-4">
          {/* BRAND / LOGO */}
          <div className="col-md-4 text-center">
            {logoUrl ? (
              <div>
                <img
                  src={logoUrl}
                  alt="Logo del sitio"
                  style={{
                    height: "45px",
                    width: "auto",
                    objectFit: "contain",
                    marginBottom: "8px",
                  }}
                />
                <p
                  className="small mb-0"
                  style={{ color: "var(--color-secundario)" }}
                >
                  Organiza tus recetas, ingredientes y lista de compras en un
                  solo lugar.
                </p>
              </div>
            ) : (
              <>
                <h4
                  className="fw-bold"
                  style={{ color: "var(--color-terciario)" }}
                >
                  <i className="bi bi-journal-bookmark-fill me-2"></i>
                  Organizador de Recetas
                </h4>
                <p
                  className="small"
                  style={{ color: "var(--color-secundario)" }}
                >
                  Administra tus recetas, ingredientes y lista de compras en un
                  solo lugar.
                </p>
              </>
            )}
          </div>

          {/* LINKS */}
          <div className="col-md-4 text-center">
            <h6
              className="text-uppercase"
              style={{ color: "var(--color-terciario)" }}
            >
              Navegación
            </h6>
            <ul className="list-unstyled small mb-0">
              <li>
                <a
                  href="/recetas"
                  className="text-decoration-none"
                  style={{ color: "var(--color-quinary)" }}
                >
                  Mis Recetas
                </a>
              </li>
              <li>
                <a
                  href="/favoritos"
                  className="text-decoration-none"
                  style={{ color: "var(--color-quinary)" }}
                >
                  Favoritos
                </a>
              </li>
              <li>
                <a
                  href="/shopping-list"
                  className="text-decoration-none"
                  style={{ color: "var(--color-quinary)" }}
                >
                  Lista de compras
                </a>
              </li>
              <li>
                <a
                  href="/perfil"
                  className="text-decoration-none"
                  style={{ color: "var(--color-quinary)" }}
                >
                  Mi perfil
                </a>
              </li>
            </ul>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="col-md-4 text-center">
            <div className="d-flex justify-content-center align-items-center gap-3">
              <h6
                className="text-uppercase m-0"
                style={{ color: "var(--color-terciario)" }}
              >
                Sígueme
              </h6>

              <div className="d-flex gap-2 fs-4">
                <a href="#" style={{ color: "var(--color-quinary)" }}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" style={{ color: "var(--color-quinary)" }}>
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" style={{ color: "var(--color-quinary)" }}>
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr
          style={{
            borderColor: "var(--color-cuaternario)",
          }}
          className="my-3"
        />

        <div
          className="text-center small"
          style={{ color: "var(--color-secundario)" }}
        >
          © {year} Organizador de Recetas – Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
