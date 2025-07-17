const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /clientes - Registrar nuevo cliente
router.post('/', async (req, res) => {
  const { nombre, documento, contacto } = req.body;

  if (!nombre || !documento || !contacto) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    await db.query(
      'INSERT INTO cliente (nombre, documento, contacto) VALUES (?, ?, ?)',
      [nombre, documento, contacto]
    );
    res.json({ mensaje: 'Cliente registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
});

// GET /clientes - Listar todos los clientes
router.get('/', async (req, res) => {
  try {
    const [clientes] = await db.query('SELECT * FROM cliente');
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

module.exports = router;
