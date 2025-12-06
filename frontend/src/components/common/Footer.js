import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSiteConfig } from "../../context/SiteConfigContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { config } = useSiteConfig();

  // Logo dinámico
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

                {/* SOLO TEXTO DINÁMICO */}
                {config?.footer_texto && (
                  <p
                    className="small mt-1 mb-0"
                    style={{ color: "var(--color-secundario)" }}
                  >
                    {config.footer_texto}
                  </p>
                )}
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

                {/* SOLO TEXTO DINÁMICO */}
                {config?.footer_texto && (
                  <p
                    className="small mt-1 mb-0"
                    style={{ color: "var(--color-secundario)" }}
                  >
                    {config.footer_texto}
                  </p>
                )}
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

          {/* SOCIAL */}
          <div className="col-md-4 text-center">
            <div className="d-flex justify-content-center align-items-center gap-3">
              <h6
                className="text-uppercase m-0"
                style={{ color: "var(--color-terciario)" }}
              >
                Sígueme
              </h6>

              <div className="d-flex gap-2 fs-4">

                {/* FACEBOOK */}
                {config?.link_facebook && (
                  <a
                    href={config.link_facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-quinary)" }}
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                )}

                {/* INSTAGRAM */}
                {config?.link_instagram && (
                  <a
                    href={config.link_instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-quinary)" }}
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                )}

                {/* YOUTUBE */}
                {config?.link_youtube && (
                  <a
                    href={config.link_youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-quinary)" }}
                  >
                    <i className="bi bi-youtube"></i>
                  </a>
                )}

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
