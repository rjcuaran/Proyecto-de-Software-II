import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../../services/auth";

export default function PrivateRoute({ children }) {
  const isLogged = authService.isAuthenticated();

  return isLogged ? children : <Navigate to="/login" replace />;
}
