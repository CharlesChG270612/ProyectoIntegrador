import db from '../database/Database';
import Tendencia from '../modules/Tendencia';

export const TendenciaController = {
  // CREATE
  create: async (titulo, subtitulo, tipo, miembros, porcentaje, imgSource) => {
    try {
      const result = await db.runAsync(
        `INSERT INTO tendencias (titulo, subtitulo, tipo, miembros, porcentaje, img_source) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [titulo, subtitulo, tipo, miembros, porcentaje, imgSource]
      );
      return { success: true, id: result.lastInsertRowId };
    } catch (error) {
      console.error('Error creando tendencia:', error);
      return { success: false, error };
    }
  },

  // READ (Todas)
  getAll: async () => {
    try {
      const rows = await db.getAllAsync('SELECT * FROM tendencias WHERE active = 1');
      const tendencias = rows.map(row => Tendencia.fromDB(row));
      return { success: true, data: tendencias };
    } catch (error) {
      console.error('Error obteniendo tendencias:', error);
      return { success: false, error };
    }
  },

  // READ (Por tipo: 'estudiante', 'tema', 'reto')
  getByType: async (tipo) => {
    try {
      const rows = await db.getAllAsync(
        'SELECT * FROM tendencias WHERE tipo = ? AND active = 1', 
        [tipo]
      );
      const tendencias = rows.map(row => Tendencia.fromDB(row));
      return { success: true, data: tendencias };
    } catch (error) {
      return { success: false, error };
    }
  },

  // UPDATE
  update: async (id, titulo, porcentaje) => {
    try {
      await db.runAsync(
        'UPDATE tendencias SET titulo = ?, porcentaje = ? WHERE id = ?',
        [titulo, porcentaje, id]
      );
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  // DELETE (Soft delete)
  delete: async (id) => {
    try {
      await db.runAsync('UPDATE tendencias SET active = 0 WHERE id = ?', [id]);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },
  
  // SEED (Datos de prueba iniciales para que no esté vacío)
  seedDatosIniciales: async () => {
    // Verificamos si está vacía
    const count = await db.getFirstAsync('SELECT COUNT(*) as c FROM tendencias');
    if (count.c === 0) {
      console.log('Sembrando datos de prueba...');
      // Estudiantes
      await TendenciaController.create('Demian', 'Ing. Automotriz', 'estudiante', 0, 0, 'carlos.png');
      await TendenciaController.create('Pedro', 'Ing. Mecatrónica', 'estudiante', 0, 0, 'pedro.png');
      await TendenciaController.create('Maria', 'Ing. Sistemas', 'estudiante', 0, 0, 'maria.png');
      
      // Temas
      await TendenciaController.create('Cálculo Integral', '', 'tema', 0, 93, '');
      await TendenciaController.create('Física Mecánica', '', 'tema', 0, 85, '');
      
      // Retos
      await TendenciaController.create('Reto: 7 días Física', '', 'reto', 5, 0, '#96CEB4');
      await TendenciaController.create('IA Aplicada', '', 'reto', 3, 0, '#FFEEAD');
    }
  }
};