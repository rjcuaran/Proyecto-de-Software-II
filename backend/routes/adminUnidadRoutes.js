const express = require('express');
const router = express.Router();
const AdminUnidad = require('../models/AdminUnidad');

// Obtener todas las unidades
router.get('/', (req, res) => {
  AdminUnidad.obtenerTodas((err, resultados) => {
    if (err) {
      console.error('Error al obtener unidades:', err);
      return res.status(500).json({ mensaje: 'Error al obtener unidades' });
    }
    res.json(resultados); // ✅ RESPUESTA JSON CORRECTA
  });
});

// Crear unidad
router.post('/', (req, res) => {
  const { nombre, abreviatura } = req.body;
  if (!nombre || !abreviatura) {
    return res.status(400).json({ mensaje: 'Nombre y abreviatura son obligatorios' });
  }

  AdminUnidad.crear(nombre, abreviatura, (err, resultado) => {
    if (err) {
      console.error('Error al crear unidad:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ mensaje: 'Ya existe una unidad con ese nombre o abreviatura' });
      }
      return res.status(500).json({ mensaje: 'Error al crear unidad' });
    }
    res.status(201).json({ mensaje: 'Unidad creada correctamente', id: resultado.insertId });
  });
});

// Actualizar unidad
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, abreviatura } = req.body;

  if (!nombre || !abreviatura) {
    return res.status(400).json({ mensaje: 'Nombre y abreviatura son obligatorios' });
  }

  AdminUnidad.actualizar(id, nombre, abreviatura, (err) => {
    if (err) {
      console.error('Error al actualizar unidad:', err);
      return res.status(500).json({ mensaje: 'Error al actualizar unidad' });
    }
    res.json({ mensaje: 'Unidad actualizada correctamente' });
  });
});

// Eliminar unidad
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  AdminUnidad.eliminar(id, (err) => {
    if (err) {
      console.error('Error al eliminar unidad:', err);
      return res.status(500).json({ mensaje: 'Error al eliminar unidad' });
    }
    res.json({ mensaje: 'Unidad eliminada correctamente' });
  });
});

module.exports = router;
