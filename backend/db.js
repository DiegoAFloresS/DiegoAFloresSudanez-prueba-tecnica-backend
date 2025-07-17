const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'diegoflores$', 
  database: 'hotel_reservas'
});

module.exports = pool;
