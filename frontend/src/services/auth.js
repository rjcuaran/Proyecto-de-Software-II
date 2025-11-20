// src/services/auth.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const authService = {
  loginUser: async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
  },

  registerUser: async (nombre, email, password) => {
    const res = await axios.post(`${API_URL}/register`, {
      nombre,
      email,
      password,
    });
    return res.data;
  },
};

export default authService;
