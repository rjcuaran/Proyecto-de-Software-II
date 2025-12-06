const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {

  // =====================================================
  // REGISTRO DE USUARIO
  // =====================================================
  registrar: async function (req, res) {
    try {
      const { nombre, email, password } = req.body;

      if (!nombre || !email || !password) {
        return res.status(400).json({
          success: false,
          mensaje: "Todos los campos son obligatorios",
        });
      }

      User.obtenerPorEmail(email, (error, results) => {
        if (error) {
          console.error("Error verificando usuario:", error);
          return res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor",
          });
        }

        if (results.length > 0) {
          return res.status(400).json({
            success: false,
            mensaje: "El usuario ya existe",
          });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({
              success: false,
              mensaje: "Error interno del servidor",
            });
          }

          // Role por defecto = user
          User.crear(
            {
              nombre,
              correo: email,
              contraseña: hashedPassword,
              role: "user",
            },
            (error, results) => {
              if (error) {
                console.error("Error creando usuario:", error);
                return res.status(500).json({
                  success: false,
                  mensaje: "Error creando usuario",
                });
              }

              const token = jwt.sign(
                {
                  id: results.insertId,
                  email: email,
                  role: "user",
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
              );

              res.status(201).json({
                success: true,
                mensaje: "Usuario registrado exitosamente",
                token: token,
                user: {
                  id: results.insertId,
                  nombre: nombre,
                  email: email,
                  role: "user",
                  avatar: null,
                },
              });
            }
          );
        });
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error interno del servidor",
      });
    }
  },

  // =====================================================
  // LOGIN DE USUARIO
  // =====================================================
  login: async function (req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          mensaje: "Email y contraseña son obligatorios",
        });
      }

      User.obtenerPorEmail(email, (error, results) => {
        if (error) {
          console.error("Error buscando usuario:", error);
          return res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor",
          });
        }

        if (results.length === 0) {
          return res.status(401).json({
            success: false,
            mensaje: "Credenciales inválidas",
          });
        }

        const user = results[0];

        bcrypt.compare(password, user.contraseña, (err, isMatch) => {
          if (err) {
            console.error("Error comparando passwords:", err);
            return res.status(500).json({
              success: false,
              mensaje: "Error interno del servidor",
            });
          }

          if (!isMatch) {
            return res.status(401).json({
              success: false,
              mensaje: "Credenciales inválidas",
            });
          }

          const token = jwt.sign(
            {
              id: user.id_usuario,
              email: user.correo,
              role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );

          res.json({
            success: true,
            mensaje: "Login exitoso",
            token: token,
            user: {
              id: user.id_usuario,
              nombre: user.nombre,
              email: user.correo,
              role: user.role,
              avatar: user.avatar,
            },
          });
        });
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        success: false,
        mensaje: "Error interno del servidor",
      });
    }
  },

  // =====================================================
  // VERIFICACIÓN DEL TOKEN
  // =====================================================
  verificarToken: function (req, res) {
    res.json({
      success: true,
      mensaje: "Token válido",
      user: req.user,
    });
  },

  // =====================================================
  // RECUPERAR CONTRASEÑA — PARTE 1
  // =====================================================
  forgotPassword: async function (req, res) {
    try {
      const { correo } = req.body;

      if (!correo) {
        return res.json({ existe: false, mensaje: "Debe ingresar un correo." });
      }

      User.obtenerPorEmail(correo, (error, results) => {
        if (error) {
          console.error("Error buscando usuario:", error);
          return res.json({ existe: false, mensaje: "Error interno." });
        }

        if (results.length === 0) {
          return res.json({
            existe: false,
            mensaje: "Este correo no está registrado.",
          });
        }

        return res.json({
          existe: true,
          mensaje: "Correo encontrado. Redirigiendo...",
        });
      });
    } catch (error) {
      console.error("Error en forgotPassword:", error);
      res.json({ existe: false, mensaje: "Error interno del servidor." });
    }
  },

  // =====================================================
  // RECUPERAR CONTRASEÑA — PARTE 2
  // =====================================================
  resetPassword: async function (req, res) {
    try {
      const { correo, password } = req.body;

      if (!correo || !password) {
        return res.json({ mensaje: "Datos incompletos." });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.json({ mensaje: "Error interno." });
        }

        User.actualizarContraseña(correo, hashedPassword, (error) => {
          if (error) {
            console.error("Error actualizando contraseña:", error);
            return res.json({ mensaje: "No se pudo actualizar la contraseña." });
          }

          return res.json({
            mensaje: "Contraseña actualizada correctamente.",
          });
        });
      });
    } catch (error) {
      console.error("Error en resetPassword:", error);
      res.json({ mensaje: "Error interno del servidor." });
    }
  },
};

module.exports = authController;
