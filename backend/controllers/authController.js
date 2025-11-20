const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    // Registrar nuevo usuario
    registrar: async function(req, res) {
        try {
            const { nombre, email, password } = req.body;

            // Validaciones básicas
            if (!nombre || !email || !password) {
                return res.status(400).json({
                    success: false,
                    mensaje: 'Todos los campos son obligatorios'
                });
            }

            // Verificar si el usuario ya existe
            User.obtenerPorEmail(email, (error, results) => {
                if (error) {
                    console.error('Error verificando usuario:', error);
                    return res.status(500).json({
                        success: false,
                        mensaje: 'Error interno del servidor'
                    });
                }

                if (results.length > 0) {
                    return res.status(400).json({
                        success: false,
                        mensaje: 'El usuario ya existe'
                    });
                }

                // Hash de la contraseña
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        return res.status(500).json({
                            success: false,
                            mensaje: 'Error interno del servidor'
                        });
                    }

                    console.log("🧩 Datos a insertar:", { nombre, correo: email, contraseña: hashedPassword });

                    // Crear usuario
                    User.crear({
                        nombre,
                        correo: email,
                        contraseña: hashedPassword
                    }, (error, results) => {


console.log("🧩 Resultado de inserción:", { error, results });


                        if (error) {
                            console.error('Error creando usuario:', error);
                            return res.status(500).json({
                                success: false,
                                mensaje: 'Error creando usuario'
                            });
                        }

                        // Generar token JWT
                        const token = jwt.sign(
                            { id: results.insertId, email: email },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' }
                        );

                        res.status(201).json({
                            success: true,
                            mensaje: 'Usuario registrado exitosamente',
                            token: token,
                            user: {
                                id: results.insertId,
                                nombre: nombre,
                                email: email
                            }
                        });
                    });
                });
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor'
            });
        }
    },

    // Login de usuario
    login: async function(req, res) {
        try {
            const { email, password } = req.body;

            // Validaciones básicas
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    mensaje: 'Email y contraseña son obligatorios'
                });
            }

            // Buscar usuario
            User.obtenerPorEmail(email, (error, results) => {
                if (error) {
                    console.error('Error buscando usuario:', error);
                    return res.status(500).json({
                        success: false,
                        mensaje: 'Error interno del servidor'
                    });
                }

                if (results.length === 0) {
                    return res.status(401).json({
                        success: false,
                        mensaje: 'Credenciales inválidas'
                    });
                }

                const user = results[0];

                // Verificar contraseña
                bcrypt.compare(password, user.contraseña, (err, isMatch) => {
                    if (err) {
                        console.error('Error comparando passwords:', err);
                        return res.status(500).json({
                            success: false,
                            mensaje: 'Error interno del servidor'
                        });
                    }

                    if (!isMatch) {
                        return res.status(401).json({
                            success: false,
                            mensaje: 'Credenciales inválidas'
                        });
                    }

                    // Generar token JWT
                    const token = jwt.sign(
                        { id: user.id_usuario, email: user.correo },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    res.json({
                        success: true,
                        mensaje: 'Login exitoso',
                        token: token,
                        user: {
                            id: user.id_usuario,
                            nombre: user.nombre,
                            email: user.correo
                        }
                    });
                });
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                mensaje: 'Error interno del servidor'
            });
        }
    },

    // Verificar token (para pruebas)
    verificarToken: function(req, res) {
        res.json({
            success: true,
            mensaje: 'Token válido',
            user: req.user
        });
    }
};

// VERIFICAR QUE ESTA LÍNEA ESTÉ EXACTAMENTE ASÍ:
module.exports = authController;