import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Home/Dashboard';
import RecetasList from './pages/Recetas/RecetasList';
import RecetaDetail from './pages/Recetas/RecetaDetail';
import RecetaCreate from './pages/Recetas/RecetaCreate';
import RecetaEdit from './pages/Recetas/RecetaEdit';
import FavoritosList from './pages/Favoritos/FavoritosList';
import Profile from './pages/Usuario/Profile';
import ShoppingList from './pages/Recetas/ShoppingList'; // ✅ nueva importación

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private Routes */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/recetas" element={<PrivateRoute><RecetasList /></PrivateRoute>} />
            <Route path="/recetas/nueva" element={<PrivateRoute><RecetaCreate /></PrivateRoute>} />
            <Route path="/recetas/:id" element={<PrivateRoute><RecetaDetail /></PrivateRoute>} />
            <Route path="/recetas/:id/editar" element={<PrivateRoute><RecetaEdit /></PrivateRoute>} />
            <Route path="/favoritos" element={<PrivateRoute><FavoritosList /></PrivateRoute>} />
            <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />

            {/* ✅ Nueva ruta para la lista de compras */}
            <Route path="/shopping-list" element={<PrivateRoute><ShoppingList /></PrivateRoute>} />

            {/* Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
