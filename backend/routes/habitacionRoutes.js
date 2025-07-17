const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /habitaciones — Lista todas las habitaciones con disponibilidad hoy
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        h.id, 
        h.numero, 
        h.tipo, 
        h.precio,
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM reserva r 
            WHERE r.habitacion_id = h.id AND CURDATE() BETWEEN r.fecha_entrada AND r.fecha_salida
          ) THEN 'No'
          ELSE 'Sí'
        END AS disponible_hoy,
        (
          SELECT MIN(r.fecha_salida)
          FROM reserva r
          WHERE r.habitacion_id = h.id
            AND CURDATE() BETWEEN r.fecha_entrada AND r.fecha_salida
        ) AS disponible_desde
      FROM habitacion h
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener habitaciones' });
  }
});

// GET /habitaciones/disponibilidad?tipo=doble&entrada=2025-07-20&salida=2025-07-25
// Endpoint opcional para consultar disponibilidad según fechas y tipo
router.get('/disponibilidad', async (req, res) => {
  const { tipo, entrada, salida } = req.query;

  if (!tipo || !entrada || !salida) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos: tipo, entrada y salida' });
  }

  try {
    const [habitaciones] = await db.query(`
      SELECT h.*
      FROM habitacion h
      WHERE h.tipo = ?
      AND h.id NOT IN (
        SELECT r.habitacion_id
        FROM reserva r
        WHERE (
          (r.fecha_entrada <= ? AND r.fecha_salida > ?) OR
          (r.fecha_entrada < ? AND r.fecha_salida >= ?) OR
          (r.fecha_entrada >= ? AND r.fecha_salida <= ?)
        )
      )
    `, [tipo, entrada, entrada, salida, salida, entrada, salida]);

    res.json(habitaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar disponibilidad' });
  }
});

module.exports = router;
