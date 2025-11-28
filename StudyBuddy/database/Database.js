import * as SQLite from 'expo-sqlite';

// Nombre de la base de datos
const DB_NAME = 'studybuddy.db';

// Función para obtener la conexión a la base de datos
// Usamos openDatabaseSync para simplificar la sincronía en operaciones básicas
const db = SQLite.openDatabaseSync(DB_NAME);

export const initDatabase = async () => {
  try {
    // Habilitar el uso de claves foráneas
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Crear tabla de USUARIOS (Para Inicio y Registro)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        carrera TEXT,
        cuatrimestre TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla de TENDENCIAS (Para la pantalla de Tendencias - CRUD)
    // Tipos: 'estudiante', 'tema', 'reto'
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tendencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        subtitulo TEXT,
        tipo TEXT NOT NULL, 
        miembros INTEGER DEFAULT 0,
        porcentaje INTEGER DEFAULT 0,
        img_source TEXT,
        active INTEGER DEFAULT 1
      );
    `);

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};

export default db;