const mysql = require('mysql2');

// Crear la conexión con la base de datos
const connection = mysql.createConnection({
  host: 'localhost',        // Cambia a tu host si es remoto
  user: 'root',             // Cambia si usas otro usuario
  password: '', // Asegúrate de usar la contraseña correcta
  database: 'devwebcamp',   // Nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

module.exports = connection;
