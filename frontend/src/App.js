// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Habitaciones from './pages/Habitaciones';
import FormularioReserva from './pages/FormularioReserva';
import Clientes from './pages/Clientes';


import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <h1 className="title">Sistema de Reservas de Hotel 🏨</h1>
        <nav className="navbar">
          <Link to="/habitaciones">Habitaciones</Link>
          <Link to="/reservar">Reservar</Link>
          <Link to="/clientes">Clientes</Link>
          
        </nav>
        <Routes>
          <Route path="/habitaciones" element={<Habitaciones />} />
          <Route path="/reservar" element={<FormularioReserva />} />
          <Route path="*" element={<div>Selecciona una opción del menú.</div>} />

<Route path="/clientes" element={<Clientes />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;