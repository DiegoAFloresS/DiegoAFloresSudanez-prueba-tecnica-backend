import { useEffect, useState } from 'react';
import api from '../services/api';
import './Clientes.css';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: '', documento: '', contacto: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = () => {
    api.get('/clientes')
      .then(res => setClientes(res.data))
      .catch(console.error);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensaje('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/clientes', form);
      setMensaje('✅ Cliente registrado');
      setForm({ nombre: '', documento: '', contacto: '' });
      obtenerClientes();
    } catch (err) {
      setMensaje('❌ Error al registrar cliente');
    }
  };

  return (
    <div className="clientes-container">
      <h2>Registrar Cliente</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input type="text" name="documento" value={form.documento} onChange={handleChange} placeholder="Documento" required />
        <input type="text" name="contacto" value={form.contacto} onChange={handleChange} placeholder="Contacto" required />
        <button type="submit">Registrar</button>
      </form>

      {mensaje && <p>{mensaje}</p>}

      <h3>Lista de Clientes</h3>
      <ul>
        {clientes.map(c => (
          <li key={c.id}>
            {c.nombre} - {c.documento} - {c.contacto}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clientes;
