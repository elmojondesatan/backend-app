const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Permitir peticiones desde el frontend

// Configuración de la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'alonsov1234',
  database: 'todo_list'
});

// Conectar a MySQL
connection.connect(err => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL');
});

// **Endpoint para login**
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  const query = 'SELECT * FROM usuario WHERE correo = ? AND contrasena = ?';
  connection.query(query, [correo, contrasena], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length > 0) {
      res.json({ message: 'Login exitoso' });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  });
});

// **Endpoint para registro**
app.post('/register', (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  const query = 'INSERT INTO usuario (nombre, correo, contrasena) VALUES (?, ?, ?)';
  connection.query(query, [nombre, correo, contrasena], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }
    res.json({ message: 'Cuenta creada con éxito' });
  });
});

// **Endpoint para obtener tareas**
app.get('/tareas', (req, res) => {
  const query = 'SELECT * FROM tarea';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener tareas' });
    }
    res.json(results);
  });
});

// **Iniciar el servidor**
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
