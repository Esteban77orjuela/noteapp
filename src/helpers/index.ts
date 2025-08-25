// src/helpers/index.ts

/**
 * @function generateUniqueId
 * @description Genera un identificador único utilizando el timestamp actual
 * combinado con un número aleatorio, lo que reduce la probabilidad de colisiones.
 * Es útil para asignar IDs a nuevas notas.
 * @returns {string} Un string que representa un ID único.
 */
export const generateUniqueId = (): string => {
  // Combina la marca de tiempo actual con un número aleatorio para mayor unicidad
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Puedes añadir otras funciones de ayuda aquí en el futuro, por ejemplo:
// export const formatTimestamp = (timestamp: number): string => { /* ... */ };
// export const validateNoteContent = (content: string): boolean => { /* ... */ };
