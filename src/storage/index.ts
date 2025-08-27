// src/storage/index.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';
import { STORAGE_KEY } from '../constants';

/**
 * @function saveNotes
 * @description Guarda un array de notas en el almacenamiento local (AsyncStorage).
 * Las notas se serializan a formato JSON antes de ser almacenadas.
 * @param {Note[]} notes - Array de objetos Note a guardar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando las notas han sido guardadas.
 */
export const saveNotes = async (notes: Note[]): Promise<void> => {
  try {
    // Convierte el array de notas a una cadena JSON
    const jsonValue = JSON.stringify(notes);
    // Guarda la cadena JSON en AsyncStorage bajo la clave definida
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    // Manejo de errores en caso de fallo al guardar
    console.error('Error al guardar las notas:', e);
    throw e; // Relanza el error para que pueda ser manejado por el componente que llama
  }
};

/**
 * @function loadNotes
 * @description Carga las notas del almacenamiento local (AsyncStorage).
 * Las notas se deserializan de formato JSON a un array de objetos Note.
 * @returns {Promise<Note[]>} Una promesa que se resuelve con un array de objetos Note.
 * Retorna un array vacío si no hay notas almacenadas o si ocurre un error.
 */
export const loadNotes = async (): Promise<Note[]> => {
  try {
    // Intenta obtener el valor almacenado bajo la clave definida
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    // Si no hay valor, retorna un array vacío
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    // Manejo de errores en caso de fallo al cargar
    console.error('Error al cargar las notas:', e);
    // Podrías retornar un array vacío o lanzar el error, dependiendo de la UX deseada
    return [];
  }
};

/**
 * @function clearAllNotes
 * @description Elimina todas las notas almacenadas en AsyncStorage.
 * Útil para pruebas o para funcionalidades de "resetear" la aplicación.
 * @returns {Promise<void>} Una promesa que se resuelve cuando las notas han sido eliminadas.
 */
export const clearAllNotes = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error al limpiar todas las notas:', e);
    throw e;
  }
};

/**
 * @function exportNotes
 * @description Exporta las notas a una cadena JSON.
 * @param {Note[]} notes - Array de objetos Note a exportar.
 * @returns {string} Una cadena JSON que representa las notas.
 */
export const exportNotes = (notes: Note[]): string => {
  return JSON.stringify(notes, null, 2);
};

/**
 * @function importNotes
 * @description Importa notas desde una cadena JSON.
 * @param {string} data - Cadena JSON que representa las notas.
 * @returns {Note[]} Un array de objetos Note.
 * @throws {Error} Si los datos no son válidos JSON o no representan notas válidas.
 */
export const importNotes = (data: string): Note[] => {
  try {
    const parsedData = JSON.parse(data);
    
    // Validar que los datos sean un array
    if (!Array.isArray(parsedData)) {
      throw new Error('Los datos importados no son un array válido');
    }
    
    // Validar que cada elemento tenga las propiedades requeridas
    for (const item of parsedData) {
      if (
        typeof item.id !== 'string' ||
        typeof item.title !== 'string' ||
        typeof item.content !== 'string' ||
        typeof item.category !== 'string' ||
        typeof item.timestamp !== 'number'
      ) {
        throw new Error('Los datos importados no tienen el formato correcto');
      }
    }
    
    return parsedData as Note[];
  } catch (error) {
    console.error('Error al importar notas:', error);
    throw error;
  }
};
