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

// Admin
import AdminRoute from "../components/common/AdminRoute";
import AdminHomePage from "../pages/Admin/AdminHomePage";
import AdminCategoriasPage from "../pages/Admin/Categorias/AdminCategoriasPage";
import AdminIngredientesPage from "../pages/Admin/Ingredientes/AdminIngredientesPage";
import AdminUnidadesPage from "../pages/Admin/Unidades/AdminUnidadesPage";

// ⭐ NUEVO: Configuración del sitio
import AdminConfiguracionPage from "../pages/Admin/Configuracion/AdminConfiguracionPage";

import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

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

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminHomePage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <AdminRoute>
            <AdminCategoriasPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/ingredientes"
        element={
          <AdminRoute>
            <AdminIngredientesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/unidades"
        element={
          <AdminRoute>
            <AdminUnidadesPage />
          </AdminRoute>
        }
      />

      {/* ⭐ NUEVO: Configuración del Sitio */}
      <Route
        path="/admin/configuracion"
        element={
          <AdminRoute>
            <AdminConfiguracionPage />
          </AdminRoute>
        }
      />


<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password/:correo" element={<ResetPasswordPage />} />



      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>






  );
}
