// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts & rutas protegidas
import PrivateRoute from "../components/common/PrivateRoute";

// Pages - Auth
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

// Pages - Home
import HomePage from "../pages/Home/HomePage";

// Pages - Recetas
import RecetasList from "../pages/Recetas/RecetasList";
import CrearRecetaPage from "../pages/Recetas/CrearRecetaPage";
import RecetaDetailPage from "../pages/Recetas/RecetaDetailPage";
import EditarRecetaPage from "../pages/Recetas/EditarRecetaPage";
import IngredientesListPage from "../pages/Recetas/IngredientesListPage";
import EditarIngredientePage from "../pages/Recetas/EditarIngredientePage";
import ShoppingList from "../pages/Recetas/ShoppingList";

// Pages - Favoritos y Usuario
import FavoritosList from "../pages/Favoritos/FavoritosList";
import ProfilePage from "../pages/Usuario/ProfilePage";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ------------------------------------ */}
      {/* 🔓 RUTAS PÚBLICAS */}
      {/* ------------------------------------ */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ------------------------------------ */}
      {/* 🔐 RUTAS PRIVADAS */}
      {/* ------------------------------------ */}

      {/* HOME */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      {/* RECETAS */}
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

      {/* INGREDIENTES */}
      <Route
        path="/recetas/:id/ingredientes"
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

      {/* FAVORITOS */}
      <Route
        path="/favoritos"
        element={
          <PrivateRoute>
            <FavoritosList />
          </PrivateRoute>
        }
      />

      {/* PERFIL DE USUARIO */}
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* LISTA DE COMPRAS */}
      <Route
        path="/shopping-list"
        element={
          <PrivateRoute>
            <ShoppingList />
          </PrivateRoute>
        }
      />

      {/* Cualquier ruta desconocida → redirigir al Home */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
