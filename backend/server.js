
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'entremente-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'entremente',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Se requiere token de autenticación' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Rutas de autenticación
app.post('/api/auth/register', async (req, res) => {
  const { username, password, fullName } = req.body;
  
  if (!username || !password || !fullName) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  try {
    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.query(
      'SELECT * FROM usuarios WHERE nombre_usuario = ?',
      [username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }
    
    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insertar nuevo usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre_usuario, contraseña, nombre_completo) VALUES (?, ?, ?)',
      [username, hashedPassword, fullName]
    );
    
    if (result.affectedRows === 1) {
      // Obtener el usuario recién creado
      const [newUser] = await pool.query(
        'SELECT id_usuario, nombre_usuario, nombre_completo FROM usuarios WHERE id_usuario = ?',
        [result.insertId]
      );
      
      // Generar token JWT
      const token = jwt.sign(
        { userId: newUser[0].id_usuario },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      return res.status(201).json({
        message: 'Usuario registrado con éxito',
        user: {
          id: newUser[0].id_usuario,
          username: newUser[0].nombre_usuario,
          nombre_completo: newUser[0].nombre_completo
        },
        token
      });
    }
    
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  } catch (error) {
    console.error('Error en el registro:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Nombre de usuario y contraseña requeridos' });
  }
  
  try {
    // Buscar usuario
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE nombre_usuario = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = users[0];
    
    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.contraseña);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { userId: user.id_usuario },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id_usuario,
        username: user.nombre_usuario,
        nombre_completo: user.nombre_completo
      },
      token
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

// Rutas de perfil de usuario
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    // Obtener datos del usuario
    const [userData] = await pool.query(
      'SELECT id_usuario, nombre_usuario, nombre_completo FROM usuarios WHERE id_usuario = ?',
      [req.userId]
    );
    
    if (userData.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const user = userData[0];
    
    // Obtener estadísticas
    const [results] = await pool.query(
      'SELECT COUNT(*) as totalGames, ROUND(AVG(puntaje), 1) as averageScore, MAX(puntaje) as highestScore FROM resultados WHERE id_usuario = ?',
      [req.userId]
    );
    
    // Obtener categoría favorita
    const [favoriteCategory] = await pool.query(
      `SELECT categoria, COUNT(*) as count 
       FROM resultados 
       WHERE id_usuario = ? 
       GROUP BY categoria 
       ORDER BY count DESC 
       LIMIT 1`,
      [req.userId]
    );
    
    const stats = {
      totalGames: results[0].totalGames || 0,
      averageScore: results[0].averageScore || 0,
      highestScore: results[0].highestScore || 0,
      favoriteCategory: favoriteCategory.length > 0 ? favoriteCategory[0].categoria : 'Ninguna'
    };
    
    return res.json({
      user: {
        id: user.id_usuario,
        username: user.nombre_usuario,
        nombre_completo: user.nombre_completo
      },
      stats
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

// Rutas de juego
app.post('/api/quiz/results', verifyToken, async (req, res) => {
  const { categoryId, score, totalQuestions } = req.body;
  
  if (!categoryId || score === undefined || !totalQuestions) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }
  
  try {
    // Obtener el nombre de la categoría basado en el ID
    const categoryMap = {
      9: 'Conocimiento General',
      17: 'Ciencias',
      23: 'Historia',
      22: 'Geografía',
      21: 'Deportes',
      11: 'Películas',
      12: 'Música',
      14: 'Televisión',
      15: 'Videojuegos',
      18: 'Informática'
    };
    
    const categoryName = categoryMap[categoryId] || `Categoría ${categoryId}`;
    
    // Guardar resultado
    const [result] = await pool.query(
      'INSERT INTO resultados (id_usuario, categoria, puntaje, total_preguntas) VALUES (?, ?, ?, ?)',
      [req.userId, categoryName, score, totalQuestions]
    );
    
    if (result.affectedRows === 1) {
      return res.status(201).json({
        message: 'Resultado guardado con éxito',
        resultId: result.insertId
      });
    }
    
    return res.status(500).json({ error: 'Error al guardar el resultado' });
  } catch (error) {
    console.error('Error guardando resultado:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/user/games', verifyToken, async (req, res) => {
  try {
    // Obtener partidas recientes
    const [games] = await pool.query(
      `SELECT 
        id_resultado as id, 
        DATE_FORMAT(fecha_jugada, '%Y-%m-%d') as date, 
        categoria as category, 
        puntaje as score, 
        total_preguntas as total 
       FROM resultados 
       WHERE id_usuario = ? 
       ORDER BY fecha_jugada DESC 
       LIMIT 10`,
      [req.userId]
    );
    
    return res.json(games);
  } catch (error) {
    console.error('Error obteniendo partidas:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/api/ranking', async (req, res) => {
  try {
    // Obtener ranking global
    const [ranking] = await pool.query(
      `SELECT 
        u.id_usuario as id,
        u.nombre_usuario as username,
        MAX(r.puntaje) as bestScore,
        COUNT(r.id_resultado) as gamesPlayed,
        ROUND(AVG(r.puntaje), 2) as averageScore
       FROM resultados r
       JOIN usuarios u ON r.id_usuario = u.id_usuario
       GROUP BY r.id_usuario
       ORDER BY bestScore DESC, averageScore DESC
       LIMIT 10`
    );
    
    return res.json(ranking);
  } catch (error) {
    console.error('Error obteniendo ranking:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
