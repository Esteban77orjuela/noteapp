// src/types/index.ts

/**
 * @interface Note
 * @description Define la estructura de una nota individual en la aplicación.
 * @property {string} id - Identificador único de la nota.
 * @property {string} title - Título de la nota.
 * @property {string} content - Contenido principal de la nota.
 * @property {string} category - Categoría a la que pertenece la nota (e.g., "Teología", "Filosofía").
 * @property {number} timestamp - Marca de tiempo de creación o última modificación de la nota.
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  timestamp: number;
}

/**
 * @interface Category
 * @description Define la estructura de una categoría para las notas.
 * @property {string} name - Nombre de la categoría (e.g., "Teología", "Filosofía", "General").
 * @property {string} icon - Icono representativo de la categoría (puedes usar nombres de íconos o rutas de imágenes).
 */
export interface Category {
  name: string;
  icon: string; // Podrías usar un nombre de ícono de una librería como FontAwesome o un SVG
}