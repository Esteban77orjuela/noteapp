// src/components/NoteInput.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CATEGORIES, THEME_COLORS } from '../constants';
import { Category } from '../types';
import { improveNoteText } from '../application/services/ai';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  isEditing?: boolean;
}

const NoteInput: React.FC<NoteInputProps> = ({
  onSave,
  onCancel,
  initialTitle = '',
  initialContent = '',
  initialCategory = 'Teologia', // Default to Teologia category
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [improving, setImproving] = useState<boolean>(false);
  const draftKeyRef = useRef<string>('@NoteApp:draft:new');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadDraft = async () => {
      if (isEditing) return;
      try {
        const raw = await AsyncStorage.getItem(draftKeyRef.current);
        if (!mounted || !raw) return;
        const d = JSON.parse(raw);
        if (d && typeof d === 'object') {
          if (typeof d.title === 'string') setTitle(d.title);
          if (typeof d.content === 'string') setContent(d.content);
          if (typeof d.category === 'string') setSelectedCategory(d.category);
        }
      } catch (e) {
        console.warn('No se pudo cargar el borrador');
      }
    };
    loadDraft();
    return () => {
      mounted = false;
    };
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const hasData = title.trim() || content.trim();
      const payload = hasData
        ? JSON.stringify({ title, content, category: selectedCategory, ts: Date.now() })
        : null;
      if (payload) {
        AsyncStorage.setItem(draftKeyRef.current, payload).catch(() => {});
      } else {
        AsyncStorage.removeItem(draftKeyRef.current).catch(() => {});
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [title, content, selectedCategory, isEditing]);

  const handleSave = () => {
    // Solo guarda si hay título y contenido
    if (title.trim() && content.trim()) {
      if (!isEditing) {
        AsyncStorage.removeItem(draftKeyRef.current).catch(() => {});
      }
      onSave(title, content, selectedCategory);
      // Opcional: Limpiar los campos después de guardar si es una nueva nota
      // setTitle('');
      // setContent('');
    } else {
      // Podrías añadir una alerta o mensaje al usuario si los campos están vacíos
      console.warn('Title and content cannot be empty.');
    }
  };

  const handleCancel = () => {
    if (!isEditing) {
      AsyncStorage.setItem(
        draftKeyRef.current,
        JSON.stringify({ title, content, category: selectedCategory, ts: Date.now() })
      ).catch(() => {});
    }
    onCancel();
  };

  const handleImprove = async () => {
    const raw = content.trim();
    if (!raw) {
      Alert.alert('Nada que mejorar', 'Escribe el contenido de la nota y vuelve a intentarlo.');
      return;
    }
    try {
      setImproving(true);
      // Enfocado sólo en el contenido; no pasamos el título para que no influya.
      const improved = await improveNoteText(raw, { category: selectedCategory });
      setContent(improved);
    } catch (e: any) {
      const message = e?.message || 'No se pudo mejorar el texto.';
      Alert.alert('No se pudo redactar mejor', message);
      console.warn(message);
    } finally {
      setImproving(false);
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
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.improveContainer}>
        <TouchableOpacity
          style={[styles.button, styles.improveButton]}
          onPress={handleImprove}
          disabled={improving || !content.trim()}
        >
          <View style={[styles.buttonGradient, styles.improveButtonInner, improving && { opacity: 0.85 }]}> 
            {improving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Redactar mejor</Text>
            )}
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
  improveContainer: {
    marginTop: 10,
    width: '100%',
  },
  improveButton: {
    flex: 0,
    marginHorizontal: 10,
  },
  improveButtonInner: {
    backgroundColor: '#4b8bff',
  },
});

export default NoteInput;
