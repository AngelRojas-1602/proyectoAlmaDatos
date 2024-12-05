const bcrypt = require('bcryptjs');
const connection = require('./db'); // Asegúrate de que './db' esté correctamente configurado

const registerUser = async (req, res) => {
  const { nombre, apellido, email, contraseña } = req.body;

  try {
    // Verificar si el email ya está en uso
    const [rows] = await connection.promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Inserta el nuevo usuario en la base de datos
    const query = 'INSERT INTO usuarios (nombre, apellido, email, contraseña) VALUES (?, ?, ?, ?)';
    const [result] = await connection.promise().query(query, [nombre, apellido || null, email, hashedPassword]);

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = registerUser;
