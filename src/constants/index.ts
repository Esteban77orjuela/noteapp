// src/constants/index.ts
import { Category } from '../types';

/**
 * @constant STORAGE_KEY
 * @description Clave utilizada para almacenar y recuperar las notas del AsyncStorage.
 * Es crucial que esta clave sea única para evitar conflictos con otros datos almacenados.
 */
export const STORAGE_KEY = '@NoteApp:notes';

/**
 * @constant CATEGORIES
 * @description Array de categorías predefinidas para las notas.
 * Cada objeto Category incluye un nombre y un icono representativo.
 * Puedes expandir o modificar estas categorías según las necesidades de tu aplicación.
 */
export const CATEGORIES: Category[] = [
  { name: 'Teología', icon: 'book' }, // Puedes usar iconos de una librería o SVGs
  { name: 'Filosofía', icon: 'lightbulb' },
  { name: 'General', icon: 'clipboard' },
  { name: 'Personal', icon: 'user' },
];

/**
 * @constant THEME_COLORS
 * @description Define una paleta de colores para el tema de la aplicación,
 * especialmente útil para los gradientes y el estilo general.
 */
export const THEME_COLORS = {
  primary: '#4c669f',
  secondary: '#3b5998',
  tertiary: '#192f6a',
  background: '#f0f2f5',
  text: '#333333',
  lightText: '#ffffff',
  accent: '#007bff',
};
