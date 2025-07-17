// src/pages/FormularioReserva.js
import './FormularioReserva.css';
import { useEffect, useState } from 'react';
import api from '../services/api';

function FormularioReserva() {
  const [form, setForm] = useState({
    habitacion_id: '',
    cliente_id: '',
    fecha_entrada: '',
    fecha_salida: ''
  });

  const [habitaciones, setHabitaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    api.get('/habitaciones')
      .then(res => setHabitaciones(res.data))
      .catch(console.error);

    api.get('/clientes')
      .then(res => setClientes(res.data))
      .catch(console.error);

    obtenerReservas();
  }, []);

  const obtenerReservas = () => {
    api.get('/reservas')
      .then(res => setReservas(res.data))
      .catch(console.error);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/reservas', form);
      setMensaje(`✅ Reserva creada! Total: $${res.data.total}`);
      setForm({ habitacion_id: '', cliente_id: '', fecha_entrada: '', fecha_salida: '' });
      obtenerReservas();
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al crear reserva';
      setMensaje(`❌ ${msg}`);
    }
  };

  const eliminarReserva = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;
    try {
      await api.delete(`/reservas/${id}`);
      setMensaje('✅ Reserva eliminada');
      obtenerReservas();
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al eliminar la reserva';
      setMensaje(`❌ ${msg}`);
    }
  };

  return (
    <div className="formulario-reserva">
      <h2>Crear Reserva</h2>
      <form onSubmit={handleSubmit}>
        <label>Habitación:</label>
        <select name="habitacion_id" value={form.habitacion_id} onChange={handleChange} required>
          <option value="">-- Selecciona --</option>
          {habitaciones.map(h => (
            <option key={h.id} value={h.id}>
              {h.numero} - {h.tipo} (${h.precio})
            </option>
          ))}
        </select>

        <label>Cliente:</label>
        <select name="cliente_id" value={form.cliente_id} onChange={handleChange} required>
          <option value="">-- Selecciona --</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <label>Fecha Entrada:</label>
        <input type="date" name="fecha_entrada" value={form.fecha_entrada} onChange={handleChange} required />

        <label>Fecha Salida:</label>
        <input type="date" name="fecha_salida" value={form.fecha_salida} onChange={handleChange} required />

        <button type="submit">Reservar</button>
      </form>

      {mensaje && <p className={mensaje.startsWith('✅') ? 'success' : 'error'}>{mensaje}</p>}

      <h2>Reservas existentes</h2>
      <table className="tabla-reservas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Habitación</th>
            <th>Cliente</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.numero_habitacion}</td>
              <td>{r.cliente}</td>
              <td>{new Date(r.fecha_entrada).toLocaleDateString()}</td>
              <td>{new Date(r.fecha_salida).toLocaleDateString()}</td>
              <td>${r.total_pagado}</td>
              <td>
                <button onClick={() => eliminarReserva(r.id)}>🗑 Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FormularioReserva;