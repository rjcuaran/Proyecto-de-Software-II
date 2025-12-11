import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminHomePage() {
  return (
    <div className="container py-4">

      <h2 className="fw-bold mb-4" style={{ color: "#652A1C" }}>
        Panel Administrativo
      </h2>

      <div className="list-group">

        <NavLink
          to="/admin/categorias"
          className="list-group-item list-group-item-action py-3"
        >
          📂 Administrar Categorías
        </NavLink>

        <NavLink
          to="/admin/ingredientes"
          className="list-group-item list-group-item-action py-3"
        >
          🥘 Ingredientes Globales
        </NavLink>

        {/* Línea eliminada:
        <NavLink
          to="/admin/ingredientes/pendientes"
          className="list-group-item list-group-item-action py-3"
        >
          ⏳ Ingredientes Pendientes
        </NavLink>
        */}

        <NavLink
          to="/admin/unidades"
          className="list-group-item list-group-item-action py-3"
        >
          ⚖️ Unidades de Medida
        </NavLink>

        <NavLink
          to="/admin/configuracion"
          className="list-group-item list-group-item-action py-3"
        >
          ⚙️ Configuración del Sitio
        </NavLink>

        <NavLink
          to="/admin/usuarios"
          className="list-group-item list-group-item-action py-3"
        >
          👥 Usuarios
        </NavLink>

      </div>
    </div>
  );
}
