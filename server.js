const express = require('express');
const connection = require('./db');
const path = require('path');
const bodyParser = require('body-parser');
const registerUser = require('./register'); // Importar lógica del registro
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

// Configuración de middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error al autenticar el usuario:', err.stack);
      res.status(500).send('Error del servidor');
      return;
    }

    if (results.length === 0) {
      res.status(401).send('Usuario no encontrado');
      return;
    }

    const usuario = results[0];
    const esCorrecta = await bcrypt.compare(password, usuario.contraseña);

    if (esCorrecta) {
      res.redirect('/dashboard');
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  });
});

// Rutas
app.post('/register', registerUser);


app.get('/cursos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cursos.html'));
});

app.get('/api/cursos', (req, res) => {
  connection.query('SELECT * FROM cursos', (err, results) => {
    if (err) {
      console.error('Error al obtener los cursos:', err.stack);
      res.status(500).send('Error al obtener los cursos');
      return;
    }
    res.json(results);
  });
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
