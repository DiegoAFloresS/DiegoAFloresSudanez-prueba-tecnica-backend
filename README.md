# DiegoAFloresSudanez - Prueba Técnica Backend 

Sistema de Reservas para una cadena hotelera. Esta API permite gestionar habitaciones, clientes y reservas, validando la disponibilidad en tiempo real y evitando sobre-reservas.


- Node.js
- Express
- MySQL
- Axios (en frontend)
- Git

Instalación del backend

1. Clona el repositorio:
   ```bash
   git clone https://github.com/DiegoAFloresS/DiegoAFloresSudanez-prueba-tecnica-backend.git
   cd DiegoAFloresSudanez-prueba-tecnica-backend
npm install
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hotel_db',
});

npm start en frontend 
npm run dev en backend

Tomar en cuenta esta base de datos enMysql Workbench
CREATE DATABASE IF NOT EXISTS hotel_reservas;
USE hotel_reservas;

CREATE TABLE habitacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(10) NOT NULL,
  tipo ENUM('individual', 'doble', 'suite') NOT NULL,
  precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  documento VARCHAR(20),
  contacto VARCHAR(100)
);

CREATE TABLE reserva (
  id INT AUTO_INCREMENT PRIMARY KEY,
  habitacion_id INT,
  cliente_id INT,
  fecha_entrada DATE,
  fecha_salida DATE,
  total_pagado DECIMAL(10,2),
  FOREIGN KEY (habitacion_id) REFERENCES habitacion(id),
  FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

INSERT INTO habitacion (numero, tipo, precio) VALUES
('101', 'individual', 100.00),
('102', 'doble', 150.00),
('201', 'suite', 250.00),
('202', 'doble', 160.00),
('301', 'individual', 90.00);

INSERT INTO cliente (nombre, documento, contacto) VALUES
('Carlos Pérez', 'CI-123456', 'carlos@example.com'),
('María Gómez', 'CI-654321', 'maria@example.com'),
('Luis Fernández', 'CI-789012', 'luis@example.com');

INSERT INTO reserva (habitacion_id, cliente_id, fecha_entrada, fecha_salida, total_pagado)
VALUES (3, 1, '2025-07-16', '2025-07-20', 750.00);





