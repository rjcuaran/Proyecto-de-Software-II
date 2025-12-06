// ===============================================
//  AdminConfiguracionPage.jsx (VERSIÓN ELEGANTE)
// ===============================================

import React, { useEffect, useState, useContext } from "react";
import api from "../../../services/api";
import ConfirmModal from "../../../components/common/ConfirmModal";
import ThemeContext from "../../../context/ThemeContext";
import { useSiteConfig } from "../../../context/SiteConfigContext";

export default function AdminConfiguracionPage() {
  const { setTheme } = useContext(ThemeContext);
  const { cargarConfiguracion } = useSiteConfig();

  // Logo
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  // Colores
  const [colorPrimario, setColorPrimario] = useState("#652A1C");
  const [colorSecundario, setColorSecundario] = useState("#F9ECDB");
  const [colorTerciario, setColorTerciario] = useState("#FFC000");
  const [colorCuaternario, setColorCuaternario] = useState("#F5DFBE");
  const [colorQuinary, setColorQuinary] = useState("#FFFFFF");

  // Otros campos
  const [footerTexto, setFooterTexto] = useState("");
  const [linkFacebook, setLinkFacebook] = useState("");
  const [linkInstagram, setLinkInstagram] = useState("");
  const [linkYoutube, setLinkYoutube] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);

  // ---------------------------------------------------------
  // Cargar configuración existente
  // ---------------------------------------------------------
  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get("/configuracion");
        const data = res.data?.data || {};

        if (data.logo) {
          setLogoPreview(`http://localhost:5000/uploads/configuracion/${data.logo}`);
        }

        setColorPrimario(data.color_primario || "#652A1C");
        setColorSecundario(data.color_secundario || "#F9ECDB");
        setColorTerciario(data.color_terciario || "#FFC000");
        setColorCuaternario(data.color_cuaternario || "#F5DFBE");
        setColorQuinary(data.color_quinary || "#FFFFFF");

        setFooterTexto(data.footer_texto || "");
        setLinkFacebook(data.link_facebook || "");
        setLinkInstagram(data.link_instagram || "");
        setLinkYoutube(data.link_youtube || "");
      } catch (err) {
        setError("No se pudo cargar la configuración del sitio");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  // ---------------------------------------------------------
  // Manejar cambio de logo
  // ---------------------------------------------------------
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Debe seleccionar una imagen válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Peso máximo permitido: 5MB");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // ---------------------------------------------------------
  // Enviar formulario → Abre modal
  // ---------------------------------------------------------
  const manejarSubmit = (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setMostrarModalGuardar(true);
  };

  // ---------------------------------------------------------
  // Guardar configuración
  // ---------------------------------------------------------
  const guardarConfiguracion = async () => {
    setGuardando(true);
    setError("");

    try {
      const formData = new FormData();
      if (logoFile) formData.append("logo", logoFile);

      formData.append("color_primario", colorPrimario);
      formData.append("color_secundario", colorSecundario);
      formData.append("color_terciario", colorTerciario);
      formData.append("color_cuaternario", colorCuaternario);
      formData.append("color_quinary", colorQuinary);

      formData.append("footer_texto", footerTexto);
      formData.append("link_facebook", linkFacebook);
      formData.append("link_instagram", linkInstagram);
      formData.append("link_youtube", linkYoutube);

      await api.put("/configuracion", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Aplicar tema global
      const newTheme = {
        color_primario: colorPrimario,
        color_secundario: colorSecundario,
        color_terciario: colorTerciario,
        color_cuaternario: colorCuaternario,
        color_quinary: colorQuinary
      };

      setTheme(newTheme);

      Object.entries(newTheme).forEach(([key, value]) =>
        document.documentElement.style.setProperty(`--${key.replace("_", "-")}`, value)
      );

      // Recargar configuración global
      await cargarConfiguracion();

      setMensaje("Configuración actualizada correctamente");
      setMostrarModalGuardar(false);

    } catch (err) {
      setError("No se pudo actualizar la configuración del sitio");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  // ---------------------------------------------------------
  // 🎨 ESTILOS ELEGANTES — Reforzando la paleta dinámica
  // ---------------------------------------------------------
  const cardStyle = {
    background: "var(--color-quinary)",
    border: "2px solid var(--color-cuaternario)",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
    animation: "fadeIn 0.3s ease"
  };

  const titleStyle = {
    color: "var(--color-primario)",
    fontWeight: "700",
    marginBottom: "12px",
    fontSize: "1.15rem"
  };

  const sectionSeparator = {
    height: "2px",
    background: "var(--color-cuaternario)",
    margin: "18px 0",
    borderRadius: "2px"
  };

  const inputLabel = {
    fontWeight: "600",
    color: "var(--color-primario)"
  };

  // ---------------------------------------------------------
  // RENDER PRINCIPAL
  // ---------------------------------------------------------
  return (
    <div className="container py-4">

      <h2 className="fw-bold mb-4" style={{ color: "var(--color-primario)" }}>
        Configuración del Sitio
      </h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={manejarSubmit}>

        <div className="row g-4">

          {/* ====================== LOGO ======================= */}
          <div className="col-md-4">
            <div style={cardStyle}>
              <h5 style={titleStyle}>Logo del sitio</h5>

              <div
                className="d-flex justify-content-center align-items-center mb-3"
                style={{
                  background: "var(--color-secundario)",
                  borderRadius: "12px",
                  border: "2px solid var(--color-cuaternario)",
                  height: "190px",
                  overflow: "hidden",
                  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)"
                }}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="logo" style={{ width: "100%", objectFit: "contain" }} />
                ) : (
                  <span className="text-muted">Sin logo</span>
                )}
              </div>

              <input type="file" accept="image/*" className="form-control" onChange={handleLogoChange} />
            </div>
          </div>

          {/* ====================== DERECHA ======================= */}
          <div className="col-md-8">

            {/* ------- COLORES ------- */}
            <div style={cardStyle} className="mb-3">
              <h5 style={titleStyle}>Colores del sitio</h5>

              <div className="row">
                {[
                  ["Primario", colorPrimario, setColorPrimario],
                  ["Secundario", colorSecundario, setColorSecundario],
                  ["Terciario", colorTerciario, setColorTerciario],
                  ["Cuaternario", colorCuaternario, setColorCuaternario],
                  ["Quinto color", colorQuinary, setColorQuinary]
                ].map(([label, value, setter]) => (
                  <div key={label} className="col-md-4 mb-3 text-center">
                    <label style={inputLabel}>{label}</label>
                    <input
                      type="color"
                      className="form-control form-control-color mx-auto"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      style={{ width: "60px", height: "50px", cursor: "pointer" }}
                    />
                    <div className="small mt-1">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ------- REDES ------- */}
            <div style={cardStyle} className="mb-3">
              <h5 style={titleStyle}>Redes sociales</h5>

              <label style={inputLabel}>Facebook</label>
              <input className="form-control mb-2" value={linkFacebook} onChange={(e) => setLinkFacebook(e.target.value)} />

              <label style={inputLabel}>Instagram</label>
              <input className="form-control mb-2" value={linkInstagram} onChange={(e) => setLinkInstagram(e.target.value)} />

              <label style={inputLabel}>YouTube</label>
              <input className="form-control" value={linkYoutube} onChange={(e) => setLinkYoutube(e.target.value)} />
            </div>

            {/* ------- FOOTER ------- */}
            <div style={cardStyle}>
              <h5 style={titleStyle}>Texto del footer</h5>
              <textarea
                rows="3"
                className="form-control"
                value={footerTexto}
                onChange={(e) => setFooterTexto(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* BOTÓN GUARDAR */}
        <div className="text-end mt-4">
          <button
            type="submit"
            disabled={guardando}
            style={{
              background: "var(--color-primario)",
              color: "var(--color-quinary)",
              padding: "12px 34px",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 3px 8px rgba(0,0,0,0.28)",
              transition: "0.3s"
            }}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

      </form>

      {/* MODAL */}
      <ConfirmModal
        visible={mostrarModalGuardar}
        title="Confirmar cambios"
        message="¿Desea guardar los cambios de configuración del sitio?"
        onCancel={() => setMostrarModalGuardar(false)}
        onConfirm={guardarConfiguracion}
        confirmLabel="Guardar"
      />
    </div>
  );
}
