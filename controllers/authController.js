const User = require('../models/User');

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

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: newUser
      });

    } catch (error) {
      console.error('Error en registro:', error);
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