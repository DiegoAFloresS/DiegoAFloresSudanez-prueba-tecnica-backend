const db = require('../db');

// Calcular número de noches entre dos fechas
function calcularNoches(fechaInicio, fechaFin) {
  const entrada = new Date(fechaInicio);
  const salida = new Date(fechaFin);
  const diff = salida.getTime() - entrada.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const crearReserva = async (req, res) => {
  try {
    const { habitacion_id, cliente_id, fecha_entrada, fecha_salida } = req.body;

    // 1. Verificar disponibilidad (superposición de fechas)
    const [conflictos] = await db.query(
      `SELECT * FROM reserva
       WHERE habitacion_id = ?
       AND (
         (fecha_entrada < ? AND fecha_salida > ?)
         OR
         (fecha_entrada < ? AND fecha_salida > ?)
         OR
         (fecha_entrada >= ? AND fecha_salida <= ?)
       )`,
      [
        habitacion_id,
        fecha_salida, fecha_salida,
        fecha_entrada, fecha_entrada,
        fecha_entrada, fecha_salida
      ]
    );

    if (conflictos.length > 0) {
      return res.status(400).json({ error: 'La habitación ya está reservada en esas fechas.' });
    }

    // 2. Obtener precio de la habitación
    const [habitacion] = await db.query(
      'SELECT precio FROM habitacion WHERE id = ?',
      [habitacion_id]
    );

    if (habitacion.length === 0) {
      return res.status(404).json({ error: 'Habitación no encontrada.' });
    }

    const precioPorNoche = habitacion[0].precio;
    const noches = calcularNoches(fecha_entrada, fecha_salida);
    const total_pagado = noches * precioPorNoche;

    // 3. Insertar reserva
    await db.query(
      `INSERT INTO reserva (habitacion_id, cliente_id, fecha_entrada, fecha_salida, total_pagado)
       VALUES (?, ?, ?, ?, ?)`,
      [habitacion_id, cliente_id, fecha_entrada, fecha_salida, total_pagado]
    );

    res.json({
      mensaje: '✅ Reserva creada exitosamente',
      noches,
      total_pagado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

module.exports = {
  crearReserva
};
