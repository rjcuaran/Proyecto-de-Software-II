// src/services/auth.js

const authService = {
  login(token) {
    localStorage.setItem("token", token);
  },

  logout() {
    localStorage.removeItem("token");
  },

  isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token; // devuelve true si existe token
  }
};

export default authService;
