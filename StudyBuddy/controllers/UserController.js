import db from '../database/Database';
import User from '../modules/User';

export const UserController = {
  // REGISTRAR USUARIO
  registrar: async (usuario, email, password) => {
    try {
      // Verificar si ya existe
      const existing = await db.getFirstAsync(
        'SELECT * FROM users WHERE usuario = ? OR email = ?',
        [usuario, email]
      );

      if (existing) {
        return { success: false, message: 'El usuario o correo ya existen.' };
      }

      // Insertar nuevo usuario
      const result = await db.runAsync(
        'INSERT INTO users (usuario, email, password) VALUES (?, ?, ?)',
        [usuario, email, password]
      );

      return { success: true, id: result.lastInsertRowId, message: 'Usuario creado exitosamente.' };
    } catch (error) {
      console.error('Error en registrar:', error);
      return { success: false, message: 'Error en la base de datos.' };
    }
  },

  // INICIAR SESIÓN
  login: async (usuario, password) => {
    try {
      const row = await db.getFirstAsync(
        'SELECT * FROM users WHERE usuario = ? AND password = ?',
        [usuario, password]
      );

      if (row) {
        const user = User.fromDB(row);
        return { success: true, user: user };
      } else {
        return { success: false, message: 'Credenciales inválidas.' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error al iniciar sesión.' };
    }
  }
};