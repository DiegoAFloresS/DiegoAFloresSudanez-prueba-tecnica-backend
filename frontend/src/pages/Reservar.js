import { useState, useEffect } from 'react';
import api from '../services/api';
import './Reservar.css';

function Reservar() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [reserva, setReserva] = useState({
    habitacion_id: '',
    cliente_id: '',
    fecha_entrada: '',
    fecha_salida: ''
  });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    api.get('/habitaciones').then(res => setHabitaciones(res.data));
    api.get('/clientes').then(res => setClientes(res.data));
  }, []);

  const handleChange = (e) => {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/reservas', reserva);
      setMensaje(`✅ Reserva realizada con éxito. Total: $${res.data.total}`);
    } catch (err) {
      setMensaje(`❌ Error: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="reserva-container">
      <h2>Realizar Reserva</h2>
      <form onSubmit={handleSubmit} className="form-reserva">
        <label>Habitación:</label>
        <select name="habitacion_id" onChange={handleChange} required>
          <option value="">Seleccione</option>
          {habitaciones.map(h => (
            <option key={h.id} value={h.id}>
              {h.numero} - {h.tipo} - ${h.precio}
            </option>
          ))}
        </select>

        <label>Cliente:</label>
        <select name="cliente_id" onChange={handleChange} required>
          <option value="">Seleccione</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre} ({c.documento})
            </option>
          ))}
        </select>

        <label>Fecha Entrada:</label>
        <input type="date" name="fecha_entrada" onChange={handleChange} required />

        <label>Fecha Salida:</label>
        <input type="date" name="fecha_salida" onChange={handleChange} required />

        <button type="submit">Reservar</button>
      </form>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}

export default Reservar;
