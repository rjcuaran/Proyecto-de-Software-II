import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const SiteConfigContext = createContext();

const DEFAULT_COLORS = {
  color_primario: "#652A1C",
  color_secundario: "#F9ECDB",
  color_terciario: "#FFC000",
  color_cuaternario: "#F5DFBE",
  color_quinary: "#FFFFFF",
};

const applyTheme = (cfg) => {
  const root = document.documentElement;

  root.style.setProperty(
    "--color-primario",
    cfg?.color_primario || DEFAULT_COLORS.color_primario
  );
  root.style.setProperty(
    "--color-secundario",
    cfg?.color_secundario || DEFAULT_COLORS.color_secundario
  );
  root.style.setProperty(
    "--color-terciario",
    cfg?.color_terciario || DEFAULT_COLORS.color_terciario
  );
  root.style.setProperty(
    "--color-cuaternario",
    cfg?.color_cuaternario || DEFAULT_COLORS.color_cuaternario
  );
  root.style.setProperty(
    "--color-quinary",
    cfg?.color_quinary || cfg?.color_quinto || DEFAULT_COLORS.color_quinary
  );
};

export const SiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarConfiguracion = async () => {
    try {
      const res = await api.get("/configuracion");
      // El backend responde { success: true, data: {...} }
      const cfg = res.data?.data || res.data;
      setConfig(cfg || null);
      applyTheme(cfg);
    } catch (error) {
      console.error("Error cargando configuración global:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  // Si cambias la config desde el admin y recargas el contexto:
  useEffect(() => {
    if (config) {
      applyTheme(config);
    }
  }, [config]);

  return (
    <SiteConfigContext.Provider value={{ config, loading, cargarConfiguracion }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => useContext(SiteConfigContext);
