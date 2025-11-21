import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../components/common/PrivateRoute";

// Pages
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

// Recetas
import RecetasList from "../pages/Recetas/RecetasList";
import CrearRecetaPage from "../pages/Recetas/CrearRecetaPage";
import EditarRecetaPage from "../pages/Recetas/EditarRecetaPage";
import RecetaDetailPage from "../pages/Recetas/RecetaDetailPage";

// Ingredientes
import IngredientesListPage from "../pages/Recetas/IngredientesListPage";
import EditarIngredientePage from "../pages/Recetas/EditarIngredientePage";

// Favoritos
import FavoritosListPage from "../pages/Favoritos/FavoritosListPage";

// Perfil
import ProfilePage from "../pages/Usuario/ProfilePage";

// Lista de compras
import ShoppingList from "../pages/Recetas/ShoppingList";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Privadas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      {/* Recetas */}
      <Route
        path="/recetas"
        element={
          <PrivateRoute>
            <RecetasList />
          </PrivateRoute>
        }
      />

      <Route
        path="/recetas/nueva"
        element={
          <PrivateRoute>
            <CrearRecetaPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/recetas/:id"
        element={
          <PrivateRoute>
            <RecetaDetailPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/recetas/:id/editar"
        element={
          <PrivateRoute>
            <EditarRecetaPage />
          </PrivateRoute>
        }
      />

      {/* Ingredientes */}
      <Route
        path="/ingredientes"
        element={
          <PrivateRoute>
            <IngredientesListPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/ingredientes/:id/editar"
        element={
          <PrivateRoute>
            <EditarIngredientePage />
          </PrivateRoute>
        }
      />

      {/* Favoritos */}
      <Route
        path="/favoritos"
        element={
          <PrivateRoute>
            <FavoritosListPage />
          </PrivateRoute>
        }
      />

      {/* Perfil */}
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* Lista de compras */}
      <Route
        path="/shopping-list"
        element={
          <PrivateRoute>
            <ShoppingList />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
