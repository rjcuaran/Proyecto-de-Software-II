const Receta = require('../models/Receta');
const Ingrediente = require('../models/Ingrediente');

const recetaController = {
    // Obtener todas las recetas del usuario
    obtenerRecetas: function(req, res) {
        const userId = req.user.id;
        
        Receta.obtenerPorUsuario(userId, (error, results) => {
            if (error) {
                console.error('Error obteniendo recetas:', error);
                return res.status(500).json({
                    success: false,
                    mensaje: 'Error interno del servidor'
                });
            }
            
            res.json({
                success: true,
                recetas: results
            });
        });
    },

    // Obtener receta por ID
    obtenerRecetaPorId: function(req, res) {
        const recetaId = req.params.id;
        const userId = req.user.id;

        Receta.obtenerPorId(recetaId, (error, results) => {
            if (error) {
                console.error('Error obteniendo receta:', error);
                return res.status(500).json({
                    success: false,
                    mensaje: 'Error interno del servidor'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Receta no encontrada'
                });
            }

            const receta = results[0];

            // Verificar que la receta pertenece al usuario
            if (receta.id_usuario !== userId) {
                return res.status(403).json({
                    success: false,
                    mensaje: 'No tienes permiso para ver esta receta'
                });
            }

            // Obtener ingredientes de la receta
            Ingrediente.obtenerPorReceta(recetaId, (error, ingredientes) => {
                if (error) {
                    console.error('Error obteniendo ingredientes:', error);
                    return res.status(500).json({
                        success: false,
                        mensaje: 'Error interno del servidor'
                    });
                }

                res.json({
                    success: true,
                    receta: {
                        ...receta,
                        ingredientes: ingredientes
                    }
                });
            });
        });
    },

    // Buscar recetas
    buscarRecetas: function(req, res) {
        const termino = req.query.q;
        const userId = req.user.id;

        if (!termino) {
            return res.status(400).json({
                success: false,
                mensaje: 'Término de búsqueda requerido'
            });
        }

        Receta.buscar(termino, userId, (error, results) => {
            if (error) {
                console.error('Error buscando recetas:', error);
                return res.status(500).json({
                    success: false,
                    mensaje: 'Error interno del servidor'
                });
            }

            res.json({
                success: true,
                recetas: results
            });
        });
    },

    // Crear nueva receta
    crearReceta: function(req, res) {
        const userId = req.user.id;
        const { nombre, categoria, descripcion, preparacion, ingredientes } = req.body;

        // Validaciones básicas
        if (!nombre) {
            return res.status(400).json({
                success: false,
                mensaje: 'El nombre de la receta es requerido'
            });
        }

        const recetaData = {
            nombre,
            categoria,
            descripcion,
            preparacion,
            id_usuario: userId
        };

        Receta.crear(recetaData, (error, results) => {
            if (error) {
                console.error('Error creando receta:', error);
                return res.status(500).json({
                    success: false,
                    mensaje: 'Error interno del servidor'
                });
            }

            const recetaId = results.id_receta;

            // Agregar ingredientes si existen
            if (ingredientes && ingredientes.length > 0) {
                Ingrediente.agregarAReceta(recetaId, ingredientes, (error) => {
                    if (error) {
                        console.error('Error agregando ingredientes:', error);
                        // Pero la receta ya se creó, así que respondemos éxito
                    }

                    res.status(201).json({
                        success: true,
                        mensaje: 'Receta creada exitosamente',
                        receta: {
                            id_receta: recetaId,
                            ...recetaData
                        }
                    });
                });
            } else {
                res.status(201).json({
                    success: true,
                    mensaje: 'Receta creada exitosamente',
                    receta: {
                        id_receta: recetaId,
                        ...recetaData
                    }
                });
            }
        });
    },

    // Actualizar receta
    actualizarReceta: function(req, res) {
        const recetaId = req.params.id;
        const userId = req.user.id;
        const { nombre, categoria, descripcion, preparacion, ingredientes } = req.body;

        // Primero verificar que la receta existe y pertenece al usuario
        Receta.obtenerPorId(recetaId, (error, results) => {
            if (error) {
                console.error('Error obteniendo receta:', error);
                return res.status(500).json({
                    success: false,
                    mensaje: 'Error interno del servidor'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Receta no encontrada'
                });
            }

            if (results[0].id_usuario !== userId) {
                return res.status(403).json({
                    success: false,
                    mensaje: 'No tienes permiso para editar esta receta'
                });
            }

            const recetaData = {
                nombre,
                categoria,
                descripcion,
                preparacion
            };

            // Actualizar receta
            Receta.actualizar(recetaId, recetaData, (error) => {
                if (error) {
                    console.error('Error actualizando receta:', error);
                    return res.status(500).json({
                        success: false,
                        mensaje: 'Error interno del servidor'
                    });
                }

                // Actualizar ingredientes si se proporcionaron
                if (ingredientes) {
                    Ingrediente.actualizarPorReceta(recetaId, ingredientes, (error) => {
                        if (error) {
                            console.error('Error actualizando ingredientes:', error);
                        }

                        res.json({
                            success: true,
                            mensaje: 'Receta actualizada exitosamente'
                        });
                    });
                } else {
                    res.json({
                        success: true,
                        mensaje: 'Receta actualizada exitosamente'
                    });
                }
            });
        });
    },

    // Eliminar receta
    eliminarReceta: function(req, res) {
        const recetaId = req.params.id;
        const userId = req.user.id;

        // Primero verificar que la receta existe y pertenece al usuario
        Receta.obtenerPorId(recetaId, (error, results) => {
            if (error) {
                console.error('Error obteniendo receta:', error);
                return res.status(500).json({
                    success: false,
                    mensaje: 'Error interno del servidor'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Receta no encontrada'
                });
            }

            if (results[0].id_usuario !== userId) {
                return res.status(403).json({
                    success: false,
                    mensaje: 'No tienes permiso para eliminar esta receta'
                });
            }

            // Eliminar receta (los ingredientes se eliminarán en cascada)
            Receta.eliminar(recetaId, (error) => {
                if (error) {
                    console.error('Error eliminando receta:', error);
                    return res.status(500).json({
                        success: false,
                        mensaje: 'Error interno del servidor'
                    });
                }

                res.json({
                    success: true,
                    mensaje: 'Receta eliminada exitosamente'
                });
            });
        });
    }
};

module.exports = recetaController;