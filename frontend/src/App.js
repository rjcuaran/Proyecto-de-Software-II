// src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Layout
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// Rutas centralizadas
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">

        {/* HEADER GLOBAL */}
        <Header />

        {/* CONTENIDO CENTRAL */}
        <main className="flex-grow-1 py-3">
          <AppRoutes />
        </main>

        {/* FOOTER GLOBAL */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;
