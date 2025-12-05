import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import ConfirmModal from "../../../components/common/ConfirmModal";

export default function AdminConfiguracionPage() {
  // Logo
  const [logo, setLogo] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  // Colores (5 colores)
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

  // Estados del sistema
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Modal
  const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);

  // --------------------------
  // Cargar configuración inicial
  // --------------------------
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const res = await api.get("/configuracion");
        const data = res.data?.data || {};

        setLogo(data.logo || "");
        setLogoPreview(data.logo || "");

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
        console.error("Error cargando configuración:", err);
        setError("No se pudo cargar la configuración del sitio");
      } finally {
        setCargando(false);
      }
    };

    cargarConfiguracion();
  }, []);

  // --------------------------
  // Subida del logo
  // --------------------------
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("El archivo seleccionado no es una imagen válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen debe pesar máximo 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setLogo(base64);
      setLogoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  // Abrir modal al enviar
  const manejarSubmit = (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setMostrarModalGuardar(true);
  };

  // --------------------------
  // Guardar configuración
  // --------------------------
  const guardarConfiguracion = async () => {
    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      await api.put("/configuracion", {
        logo,
        color_primario: colorPrimario,
        color_secundario: colorSecundario,
        color_terciario: colorTerciario,
        color_cuaternario: colorCuaternario,
        color_quinary: colorQuinary,
        footer_texto: footerTexto,
        link_facebook: linkFacebook,
        link_instagram: linkInstagram,
        link_youtube: linkYoutube,
      });

      setMensaje("Configuración actualizada correctamente");
      setMostrarModalGuardar(false);

    } catch (err) {
      console.error("Error guardando configuración:", err);
      setError("No se pudo actualizar la configuración del sitio");
      setMostrarModalGuardar(false);

    } finally {
      setGuardando(false);
    }
  };

  // --------------------------
  // Vista de carga
  // --------------------------
  if (cargando) {
    return (
      <div className="container py-4">
        <h2 className="fw-bold mb-4" style={{ color: "#652A1C" }}>
          Configuración del Sitio
        </h2>
        <p>Cargando configuración...</p>
      </div>
    );
  }

  // --------------------------
  // VISTA PRINCIPAL
  // --------------------------
  return (
    <div className="container py-4">

      <h2 className="fw-bold mb-4" style={{ color: "#652A1C" }}>
        Configuración del Sitio
      </h2>

      {/* Mensajes */}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* NOTA ELEGANTE */}
      <div className="alert alert-warning text-center" style={{ fontSize: "0.9rem" }}>
        Nota: Los colores estándar del sistema son 
        <strong> #F9ECDB, #652A1C, #FFC000, #F5DFBE y #FFFFFF</strong>.
      </div>

      <form onSubmit={manejarSubmit}>
        <div className="row">

          {/* ------------------------------------------------------ */}
          {/* IZQUIERDA: LOGO */}
          {/* ------------------------------------------------------ */}
          <div className="col-md-4 mb-4">
            <div
              className="p-3 rounded shadow-sm"
              style={{ backgroundColor: "#F9ECDB" }}
            >
              <h5 className="fw-semibold mb-3" style={{ color: "#652A1C" }}>
                Logo del sitio
              </h5>

              <div
                className="d-flex justify-content-center align-items-center mb-3"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  border: "2px solid #F5DFBE",
                  height: "180px",
                  overflow: "hidden",
                }}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo del sitio"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                ) : (
                  <span className="text-muted">Sin logo cargado</span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleLogoChange}
              />
              <small className="text-muted">
                Formato recomendado: PNG/JPG. Máx. 5MB.
              </small>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* DERECHA: COLORES + REDES + FOOTER */}
          {/* ------------------------------------------------------ */}
          <div className="col-md-8 mb-4">

            {/* COLORES */}
            <div
              className="p-3 rounded shadow-sm mb-3"
              style={{ backgroundColor: "#F9ECDB" }}
            >
              <h5 className="fw-semibold mb-3" style={{ color: "#652A1C" }}>
                Colores del sitio
              </h5>

              <div className="row">

                {/* 1 */}
                <div className="col-md-4 mb-3 text-center">
                  <label className="form-label fw-semibold">Primario</label>
                  <input
                    type="color"
                    className="form-control form-control-color mx-auto"
                    value={colorPrimario}
                    onChange={(e) => setColorPrimario(e.target.value)}
                  />
                  <div className="small text-muted mt-1">{colorPrimario}</div>
                </div>

                {/* 2 */}
                <div className="col-md-4 mb-3 text-center">
                  <label className="form-label fw-semibold">Secundario</label>
                  <input
                    type="color"
                    className="form-control form-control-color mx-auto"
                    value={colorSecundario}
                    onChange={(e) => setColorSecundario(e.target.value)}
                  />
                  <div className="small text-muted mt-1">{colorSecundario}</div>
                </div>

                {/* 3 */}
                <div className="col-md-4 mb-3 text-center">
                  <label className="form-label fw-semibold">Terciario</label>
                  <input
                    type="color"
                    className="form-control form-control-color mx-auto"
                    value={colorTerciario}
                    onChange={(e) => setColorTerciario(e.target.value)}
                  />
                  <div className="small text-muted mt-1">{colorTerciario}</div>
                </div>

                {/* 4 */}
                <div className="col-md-4 mb-3 text-center">
                  <label className="form-label fw-semibold">Cuaternario</label>
                  <input
                    type="color"
                    className="form-control form-control-color mx-auto"
                    value={colorCuaternario}
                    onChange={(e) => setColorCuaternario(e.target.value)}
                  />
                  <div className="small text-muted mt-1">{colorCuaternario}</div>
                </div>

                {/* 5 */}
                <div className="col-md-4 mb-3 text-center">
                  <label className="form-label fw-semibold">Quinto color</label>
                  <input
                    type="color"
                    className="form-control form-control-color mx-auto"
                    value={colorQuinary}
                    onChange={(e) => setColorQuinary(e.target.value)}
                  />
                  <div className="small text-muted mt-1">{colorQuinary}</div>
                </div>

              </div>
            </div>

            {/* REDES SOCIALES */}
            <div
              className="p-3 rounded shadow-sm mb-3"
              style={{ backgroundColor: "#F9ECDB" }}
            >
              <h5 className="fw-semibold mb-3" style={{ color: "#652A1C" }}>
                Redes sociales
              </h5>

              <div className="mb-3">
                <label className="form-label fw-semibold">Facebook</label>
                <input
                  type="url"
                  className="form-control"
                  value={linkFacebook}
                  onChange={(e) => setLinkFacebook(e.target.value)}
                  placeholder="https://facebook.com/tu_pagina"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Instagram</label>
                <input
                  type="url"
                  className="form-control"
                  value={linkInstagram}
                  onChange={(e) => setLinkInstagram(e.target.value)}
                  placeholder="https://instagram.com/tu_perfil"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">YouTube</label>
                <input
                  type="url"
                  className="form-control"
                  value={linkYoutube}
                  onChange={(e) => setLinkYoutube(e.target.value)}
                  placeholder="https://youtube.com/tu_canal"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div
              className="p-3 rounded shadow-sm"
              style={{ backgroundColor: "#F9ECDB" }}
            >
              <h5 className="fw-semibold mb-3" style={{ color: "#652A1C" }}>
                Texto del footer
              </h5>
              <textarea
                className="form-control"
                rows={3}
                value={footerTexto}
                onChange={(e) => setFooterTexto(e.target.value)}
                placeholder="Texto que aparecerá en el pie de página del sitio"
              />
            </div>

          </div>
        </div>

        {/* BOTÓN GUARDAR */}
        <div className="mt-3">
          <button
            type="submit"
            className="btn btn-primary btn-admin"
            disabled={guardando}
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
