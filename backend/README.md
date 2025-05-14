
# Backend de Entremente

Este es el servidor backend para la aplicación Entremente, una aplicación educativa de preguntas y respuestas.

## Requisitos previos

- Node.js v14 o superior
- MySQL 5.7 o superior

## Configuración

1. Primero, crea la base de datos en MySQL usando los siguientes comandos:

```sql
CREATE DATABASE entremente CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE entremente;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  nombre_completo VARCHAR(100),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de resultados de trivia jugada
CREATE TABLE resultados (
  id_resultado INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  puntaje INT NOT NULL,
  total_preguntas INT DEFAULT 10,
  fecha_jugada DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Vista de ranking global (mejor puntaje por usuario)
CREATE VIEW ranking_global AS
SELECT 
  u.id_usuario,
  u.nombre_usuario,
  MAX(r.puntaje) AS mejor_puntaje,
  COUNT(r.id_resultado) AS partidas_jugadas,
  ROUND(AVG(r.puntaje), 2) AS promedio_puntaje
FROM resultados r
JOIN usuarios u ON r.id_usuario = u.id_usuario
GROUP BY r.id_usuario
ORDER BY mejor_puntaje DESC;
```

2. Instala las dependencias:

```
npm install
```

3. Configura las variables de entorno:
   - Duplica el archivo `.env.example` y renómbralo a `.env`
   - Edita los valores según tu configuración local

4. Inicia el servidor:

```
npm start
```

Para desarrollo con recarga automática:

```
npm run dev
```

## Endpoints API

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuario

- `GET /api/user/profile` - Obtener perfil de usuario
- `GET /api/user/games` - Obtener partidas recientes

### Trivia

- `POST /api/quiz/results` - Guardar resultado de un quiz
- `GET /api/ranking` - Obtener ranking global
