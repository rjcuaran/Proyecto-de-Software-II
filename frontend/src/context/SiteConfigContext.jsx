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

const LOCAL_STORAGE_KEY = "siteConfig";

/**
 * Aplica los colores de la configuración al :root
 */
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
  // 1) Intentar cargar primero desde localStorage (si existe)
  const [config, setConfig] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Aplicar tema inmediatamente con lo último guardado
        applyTheme(parsed);
        return parsed;
      }
    } catch (e) {
      console.error("Error leyendo configuración desde localStorage:", e);
    }
    // Si no hay nada guardado, config inicia en null
    return null;
  });

  const [loading, setLoading] = useState(true);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const res = await api.get("/configuracion");
      // El backend responde { success: true, data: {...} }
      const cfg = res.data?.data || res.data || null;

      if (cfg) {
        setConfig(cfg);
        applyTheme(cfg);

        // Guardar también en localStorage para que persista
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cfg));
        } catch (e) {
          console.error("No se pudo guardar configuración en localStorage:", e);
        }
      }
    } catch (error) {
      console.error("Error cargando configuración global:", error);
      // Si falla, dejamos la config que ya estaba (por ejemplo, la de localStorage)
    } finally {
      setLoading(false);
    }
  };

  // 2) Cargar configuración desde el backend al montar el proveedor
  useEffect(() => {
    cargarConfiguracion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) Si la config cambia por cualquier motivo, aplicar el tema de nuevo
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
