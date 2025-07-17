const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /reservas - Obtener todas las reservas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.id,
        h.numero AS numero_habitacion,
        c.nombre AS cliente,
        r.fecha_entrada,
        r.fecha_salida,
        r.total_pagado
      FROM reserva r
      JOIN habitacion h ON h.id = r.habitacion_id
      JOIN cliente c ON c.id = r.cliente_id
      ORDER BY r.fecha_entrada DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
});




router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(`DELETE FROM reserva WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    res.json({ mensaje: 'Reserva eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la reserva' });
  }
});


router.post('/', async (req, res) => {
  const { habitacion_id, cliente_id, fecha_entrada, fecha_salida } = req.body;

  if (!habitacion_id || !cliente_id || !fecha_entrada || !fecha_salida) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {

    const [conflictos] = await db.query(`
      SELECT * FROM reserva
      WHERE habitacion_id = ?
        AND (
          (fecha_entrada <= ? AND fecha_salida > ?) OR
          (fecha_entrada < ? AND fecha_salida >= ?) OR
          (fecha_entrada >= ? AND fecha_salida <= ?)
        )
    `, [habitacion_id, fecha_entrada, fecha_entrada, fecha_salida, fecha_salida, fecha_entrada, fecha_salida]);

    if (conflictos.length > 0) {
      return res.status(400).json({ error: 'La habitación ya está reservada en esas fechas' });
    }


    const [habitaciones] = await db.query(`SELECT precio FROM habitacion WHERE id = ?`, [habitacion_id]);
    if (habitaciones.length === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada' });
    }

    const precio = habitaciones[0].precio;
    const noches = Math.ceil((new Date(fecha_salida) - new Date(fecha_entrada)) / (1000 * 60 * 60 * 24));
    const total = noches * precio;

    await db.query(`
      INSERT INTO reserva (habitacion_id, cliente_id, fecha_entrada, fecha_salida, total_pagado)
      VALUES (?, ?, ?, ?, ?)
    `, [habitacion_id, cliente_id, fecha_entrada, fecha_salida, total]);

    res.json({ mensaje: 'Reserva registrada correctamente', total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
});

module.exports = router;