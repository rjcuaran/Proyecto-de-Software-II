const AdminUsuario = require("../models/AdminUsuario");
const bcrypt = require("bcryptjs");

const adminUsuarioController = {

  // =====================================================
  // LISTAR TODOS LOS USUARIOS (ACTIVOS Y ELIMINADOS)
  // =====================================================
  obtenerTodos: (req, res) => {
    AdminUsuario.obtenerTodos((error, usuarios) => {
      if (error) {
        console.error("Error obteniendo usuarios:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno",
        });
      }

      // Enviar TODOS (activos + eliminados)
      res.json({ success: true, data: usuarios });
    });
  },

  // =====================================================
  // PROMOVER A ADMIN
  // =====================================================
  promoverAdmin: (req, res) => {
    const { id } = req.params;

    AdminUsuario.actualizarRol(id, "admin", (error) => {
      if (error) {
        console.error("Error actualizando rol:", error);
        return res.status(500).json({
          success: false,
          message: "Error actualizando rol",
        });
      }

      res.json({
        success: true,
        message: "Usuario promovido a administrador",
      });
    });
  },

  // =====================================================
  // QUITAR ROL ADMIN
  // =====================================================
  quitarAdmin: (req, res) => {
    const { id } = req.params;

    AdminUsuario.actualizarRol(id, "user", (error) => {
      if (error) {
        console.error("Error actualizando rol:", error);
        return res.status(500).json({
          success: false,
          message: "Error actualizando rol",
        });
      }

      res.json({
        success: true,
        message: "El usuario ya no es administrador",
      });
    });
  },

  // =====================================================
  // ACTIVAR USUARIO
  // =====================================================
  activar: (req, res) => {
    const { id } = req.params;

    AdminUsuario.actualizarEstado(id, 1, (error) => {
      if (error) {
        console.error("Error activando usuario:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno",
        });
      }

      res.json({
        success: true,
        message: "Usuario activado correctamente",
      });
    });
  },

  // =====================================================
  // DESACTIVAR USUARIO
  // =====================================================
  desactivar: (req, res) => {
    const { id } = req.params;

    AdminUsuario.actualizarEstado(id, 0, (error) => {
      if (error) {
        console.error("Error desactivando usuario:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno",
        });
      }

      res.json({
        success: true,
        message: "Usuario desactivado correctamente",
      });
    });
  },

  // =====================================================
  // CREAR USUARIO
  // =====================================================
  crearUsuario: async (req, res) => {
    try {
      const { nombre, correo, role } = req.body;

      if (!nombre || !correo) {
        return res.status(400).json({
          success: false,
          message: "Nombre y correo son obligatorios",
        });
      }

      const contrasenaPlano = Math.random().toString(36).slice(-8);
      const contrasenaHash = await bcrypt.hash(contrasenaPlano, 10);

      const datos = {
        nombre,
        correo,
        contraseña: contrasenaHash,
        role: role || "user",
        estado: 1,
        eliminado: 0,
      };

      AdminUsuario.crearUsuario(datos, (error, result) => {
        if (error) {
          console.error("Error creando usuario:", error);
          return res.status(500).json({
            success: false,
            message: "Error interno al crear usuario",
          });
        }

        res.json({
          success: true,
          message: "Usuario creado correctamente",
          contraseña_generada: contrasenaPlano,
        });
      });
    } catch (error) {
      console.error("Error en crearUsuario:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },

  // =====================================================
  // EDITAR USUARIO
  // =====================================================
  editarUsuario: (req, res) => {
    const { id } = req.params;
    const { nombre, correo } = req.body;

    if (!nombre || !correo) {
      return res.status(400).json({
        success: false,
        message: "Nombre y correo son obligatorios",
      });
    }

    AdminUsuario.actualizarUsuario(id, { nombre, correo }, (error) => {
      if (error) {
        console.error("Error actualizando usuario:", error);
        return res.status(500).json({
          success: false,
          message: "Error interno al actualizar usuario",
        });
      }

      res.json({
        success: true,
        message: "Usuario actualizado correctamente",
      });
    });
  },

  // =====================================================
  // RESETEAR CONTRASEÑA
  // =====================================================
  resetearPassword: async (req, res) => {
    try {
      const { id } = req.params;

      const nuevaContrasenaPlano = Math.random().toString(36).slice(-8);
      const nuevaContrasenaHash = await bcrypt.hash(nuevaContrasenaPlano, 10);

      AdminUsuario.actualizarContraseña(id, nuevaContrasenaHash, (error) => {
        if (error) {
          console.error("Error reseteando contraseña:", error);
          return res.status(500).json({
            success: false,
            message: "Error interno al resetear contraseña",
          });
        }

        res.json({
          success: true,
          message: "Contraseña restablecida correctamente",
          nueva_contraseña: nuevaContrasenaPlano,
        });
      });
    } catch (error) {
      console.error("Error en resetearPassword:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },

  // =====================================================
  // ELIMINAR USUARIO (ELIMINACIÓN LÓGICA PROFESIONAL)
  // =====================================================
  eliminarUsuario: (req, res) => {
    const { id } = req.params;

    // 1️⃣ Poner estado en 0 (inactivo)
    AdminUsuario.actualizarEstado(id, 0, (error1) => {
      if (error1) {
        console.error("Error actualizando estado:", error1);
        return res.status(500).json({
          success: false,
          message: "Error interno al eliminar usuario",
        });
      }

      // 2️⃣ Marcar como eliminado
      AdminUsuario.marcarEliminado(id, (error2) => {
        if (error2) {
          console.error("Error marcando eliminado:", error2);
          return res.status(500).json({
            success: false,
            message: "Error interno al eliminar usuario",
          });
        }

        res.json({
          success: true,
          message: "Usuario eliminado correctamente",
        });
      });
    });
  },

  // =====================================================
  // RESTAURAR USUARIO (CORREGIDO)
  // =====================================================
  restaurarUsuario: (req, res) => {
    const { id } = req.params;

    // 1️⃣ Quitar eliminado = 0
    AdminUsuario.restaurar(id, (error1) => {
      if (error1) {
        console.error("Error restaurando usuario:", error1);
        return res.status(500).json({
          success: false,
          message: "Error interno al restaurar usuario",
        });
      }

      // 2️⃣ Activar usuario → estado = 1
      AdminUsuario.actualizarEstado(id, 1, (error2) => {
        if (error2) {
          console.error("Error activando usuario:", error2);
          return res.status(500).json({
            success: false,
            message: "Usuario restaurado, pero no activado",
          });
        }

        res.json({
          success: true,
          message: "Usuario restaurado y activado correctamente",
        });
      });
    });
  },
};

module.exports = adminUsuarioController;
