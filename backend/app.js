const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const habitacionRoutes = require('./routes/habitacionRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');


const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/habitaciones', habitacionRoutes);
app.use('/reservas', reservaRoutes);
app.use('/clientes', clienteRoutes);

app.get('/', (req, res) => {
  res.send('✅ API del sistema hotelero funcionando');
});

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
