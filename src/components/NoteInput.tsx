// src/components/NoteInput.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CATEGORIES, THEME_COLORS } from '../constants';
import { Category } from '../types';

/**
 * @interface NoteInputProps
 * @description Propiedades para el componente NoteInput.
 * @property {(title: string, content: string, category: string) => void} onSave - Función que se llama al guardar la nota.
 * @property {() => void} onCancel - Función que se llama al cancelar la edición/creación.
 * @property {string} [initialTitle] - Título inicial para pre-llenar el input (para edición).
 * @property {string} [initialContent] - Contenido inicial para pre-llenar el input (para edición).
 * @property {string} [initialCategory] - Categoría inicial para pre-seleccionar.
 */
interface NoteInputProps {
  onSave: (title: string, content: string, category: string) => void;
  onCancel: () => void;
  initialTitle?: string;
  initialContent?: string;
  initialCategory?: string;
}

/**
 * @function NoteInput
 * @description Componente de UI para introducir o editar el título, contenido y categoría de una nota.
 * Incluye campos de texto y un selector de categoría.
 * @param {NoteInputProps} props - Las propiedades del componente.
 * @returns {JSX.Element} El componente NoteInput renderizado.
 */
const NoteInput: React.FC<NoteInputProps> = ({
  onSave,
  onCancel,
  initialTitle = '',
  initialContent = '',
  initialCategory = 'Teologia', // Default to Teologia category
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  /**
   * @function handleSave
   * @description Maneja la acción de guardar la nota.
   * Llama a la prop `onSave` con los valores actuales de título, contenido y categoría.
   */
  const handleSave = () => {
    // Solo guarda si hay título y contenido
    if (title.trim() && content.trim()) {
      onSave(title, content, selectedCategory);
      // Opcional: Limpiar los campos después de guardar si es una nueva nota
      // setTitle('');
      // setContent('');
    } else {
      // Podrías añadir una alerta o mensaje al usuario si los campos están vacíos
      console.warn('Title and content cannot be empty.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: 'black', fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
        Formulario de Nota
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Título de la Nota"
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />
      
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Contenido de la Nota"
        placeholderTextColor="#666"
        multiline
        value={content}
        onChangeText={setContent}
        textAlignVertical="top"
      />

      <View style={styles.categorySelector}>
        {CATEGORIES.map((category: Category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.name && styles.selectedCategoryButtonText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Guardar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#333333',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  contentInput: {
    height: 120,
    marginBottom: 20,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategoryButton: {
    backgroundColor: THEME_COLORS.accent,
    borderColor: THEME_COLORS.accent,
  },
  categoryButtonText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedCategoryButtonText: {
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: THEME_COLORS.accent,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NoteInput;
