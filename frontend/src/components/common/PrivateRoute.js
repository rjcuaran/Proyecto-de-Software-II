// frontend/src/components/common/PrivateRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import authService from "../../services/auth";

export default function PrivateRoute({ children }) {
  const isLogged = authService.isAuthenticated();

  // 🔥 Esto detecta cambios en la URL (incluyendo ?updated=xxxx)
  const location = useLocation();

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 Forzar que React Router vuelva a montar el componente hijo cuando cambia la URL
  return (
    <React.Fragment key={location.pathname + location.search}>
      {children}
    </React.Fragment>
  );
}
