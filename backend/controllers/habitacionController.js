const db = require('../db');

const getHabitaciones = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM habitacion');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener habitaciones' });
  }
};

module.exports = { getHabitaciones };
