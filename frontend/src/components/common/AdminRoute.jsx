import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../../services/auth";

export default function AdminRoute({ children }) {
  const user = authService.getUser();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
