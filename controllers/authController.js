const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  // Registrar nuevo usuario
  async register(req, res) {
    try {
      const { nombre, correo, contraseña } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(correo);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El correo ya está registrado'
        });
      }

      // Crear nuevo usuario
      const userId = await User.create({
        nombre,
        correo,
        contraseña
      });

      // Obtener datos del usuario creado (sin contraseña)
      const newUser = await User.findById(userId);

      // Generar token JWT
      const token = jwt.sign(
        { userId: newUser.id_usuario, email: newUser.correo },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: newUser,
          token: token
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Login de usuario
  async login(req, res) {
    try {
      const { correo, contraseña } = req.body;

      // Verificar si el usuario existe
      const user = await User.findByEmail(correo);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isPasswordValid = await User.verifyPassword(contraseña, user.contraseña);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar token JWT
      const token = jwt.sign(
        { userId: user.id_usuario, email: user.correo },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Obtener datos del usuario sin contraseña
      const userData = await User.findById(user.id_usuario);

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: userData,
          token: token
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Obtener perfil del usuario actual (usando el token)
  async getProfile(req, res) {
    try {
      const user = req.user;
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  },

  // Obtener todos los usuarios (solo para desarrollo)
  async getUsers(req, res) {
    try {
      const users = await User.getAll();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
};

module.exports = authController;