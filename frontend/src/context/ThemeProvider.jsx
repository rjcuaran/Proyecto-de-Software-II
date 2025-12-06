import React, { useState, useEffect } from "react";
import ThemeContext from "./ThemeContext";
import api from "../services/api";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState({
    color_primario: "#652A1C",
    color_secundario: "#F9ECDB",
    color_terciario: "#FFC000",
    color_cuaternario: "#F5DFBE",
    color_quinary: "#FFFFFF",
  });

  // Aplicar el theme al DOM como variables CSS
  const applyThemeToCSS = (config) => {
    Object.keys(config).forEach((key) => {
      document.documentElement.style.setProperty(
        `--${key.replace("_", "-")}`,
        config[key]
      );
    });
  };

  // Cargar configuración desde backend una sola vez al iniciar
  const loadTheme = async () => {
    try {
      const res = await api.get("/configuracion");
      const data = res.data.data;

      const themeData = {
        color_primario: data.color_primario,
        color_secundario: data.color_secundario,
        color_terciario: data.color_terciario,
        color_cuaternario: data.color_cuaternario,
        color_quinary: data.color_quinary,
      };

      setTheme(themeData);
      applyThemeToCSS(themeData);

    } catch (error) {
      console.log("No se pudo cargar el tema dinámico:", error);
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
