import './Habitaciones.css';
import { useEffect, useState } from 'react';
import api from '../services/api';




function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);

  useEffect(() => {
    api.get('/habitaciones')
      .then(res => setHabitaciones(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="habitaciones-container">
  <h2>Habitaciones</h2>
  <table className="habitaciones-table">
    <thead>
      <tr>
        <th>Número</th>
        <th>Tipo</th>
        <th>Precio</th>
        <th>Disponible hoy</th>
        <th>Disponible desde</th>
      </tr>
    </thead>
    <tbody>
      {habitaciones.map((h) => (
        <tr key={h.id}>
          <td>{h.numero}</td>
          <td>{h.tipo}</td>
          <td>${h.precio}</td>
          <td className={h.disponible_hoy === 'Sí' ? 'disponible' : 'no-disponible'}>
            {h.disponible_hoy === 'Sí' ? '✅ Sí' : '❌ No'}
          </td>
          <td>
            {h.disponible_desde ? new Date(h.disponible_desde).toLocaleDateString() : '-'}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}

export default Habitaciones;
