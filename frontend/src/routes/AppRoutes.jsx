import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/common/PrivateRoute";

// Pages
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

import RecetasList from "../pages/Recetas/RecetasList";
import CrearRecetaPage from "../pages/Recetas/CrearRecetaPage";
import EditarRecetaPage from "../pages/Recetas/EditarRecetaPage";
import RecetaDetailPage from "../pages/Recetas/RecetaDetailPage";

import IngredientesListPage from "../pages/Recetas/IngredientesListPage";
import EditarIngredientePage from "../pages/Recetas/EditarIngredientePage";

import FavoritosListPage from "../pages/Favoritos/FavoritosListPage";
import ProfilePage from "../pages/Usuario/ProfilePage";
import ShoppingList from "../pages/Recetas/ShoppingList";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Privadas */}
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />

      <Route path="/recetas" element={<PrivateRoute><RecetasList /></PrivateRoute>} />
      <Route path="/recetas/nueva" element={<PrivateRoute><CrearRecetaPage /></PrivateRoute>} />
      <Route path="/recetas/:id" element={<PrivateRoute><RecetaDetailPage /></PrivateRoute>} />
      <Route path="/recetas/:id/editar" element={<PrivateRoute><EditarRecetaPage /></PrivateRoute>} />

      <Route path="/ingredientes" element={<PrivateRoute><IngredientesListPage /></PrivateRoute>} />
      <Route path="/ingredientes/:id/editar" element={<PrivateRoute><EditarIngredientePage /></PrivateRoute>} />

      <Route path="/favoritos" element={<PrivateRoute><FavoritosList /></PrivateRoute>} />
      <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/shopping-list" element={<PrivateRoute><ShoppingList /></PrivateRoute>} />

      {/* Default */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
