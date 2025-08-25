// src/screens/NotesScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert, // Usaremos Alert de React Native para confirmaciones
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importar componentes y utilidades
import NoteCard from '../components/NoteCard';
import NoteInput from '../components/NoteInput';
import Modal from '../components/Modal';
import CategorySelector from '../components/CategorySelector';
import { Note } from '../types';
import { saveNotes, loadNotes } from '../storage';
import { generateUniqueId } from '../helpers';
import { THEME_COLORS } from '../constants';

/**
 * @function NotesScreen
 * @description Pantalla principal de la aplicación NoteApp.
 * Gestiona el estado de las notas, su carga, guardado, filtrado, adición, edición y eliminación.
 * Integra los componentes NoteInput, NoteCard, Modal y CategorySelector.
 * @returns {JSX.Element} El componente NotesScreen renderizado.
 */
const NotesScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null); // Para almacenar la nota que se está editando
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  /**
   * @function fetchNotes
   * @description Carga las notas desde AsyncStorage al iniciar la aplicación.
   * Utiliza useCallback para memorizar la función y evitar re-creaciones innecesarias.
   */
  const fetchNotes = useCallback(async () => {
    try {
      const storedNotes = await loadNotes();
      // Asegúrate de que las notas estén ordenadas por timestamp (las más recientes primero)
      setNotes(storedNotes.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      // Podrías mostrar un Toast o un mensaje de error en la UI
    }
  }, []);

  // Cargar notas cuando el componente se monta
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  /**
   * @function handleSaveNote
   * @description Guarda una nueva nota o actualiza una existente.
   * @param {string} title - El título de la nota.
   * @param {string} content - El contenido de la nota.
   * @param {string} category - La categoría de la nota.
   */
  const handleSaveNote = async (title: string, content: string, category: string) => {
    let updatedNotes: Note[];
    if (editingNote) {
      // Editar nota existente
      updatedNotes = notes.map((note) =>
        note.id === editingNote.id
          ? { ...note, title, content, category, timestamp: Date.now() }
          : note
      );
      setEditingNote(null); // Limpiar la nota en edición
    } else {
      // Crear nueva nota
      const newNote: Note = {
        id: generateUniqueId(),
        title,
        content,
        category,
        timestamp: Date.now(),
      };
      updatedNotes = [newNote, ...notes]; // Añadir la nueva nota al principio
    }
    setNotes(updatedNotes.sort((a, b) => b.timestamp - a.timestamp)); // Reordenar por timestamp
    await saveNotes(updatedNotes);
    setIsModalVisible(false);
  };

  /**
   * @function handleEditNote
   * @description Prepara el modal para editar una nota existente.
   * @param {Note} note - La nota a editar.
   */
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalVisible(true);
  };

  /**
   * @function handleDeleteNote
   * @description Elimina una nota después de la confirmación del usuario.
   * @param {string} id - El ID de la nota a eliminar.
   */
  const handleDeleteNote = (id: string) => {
    setNoteToDelete(id);
    setIsDeleteConfirmationVisible(true);
  };

  /**
   * @function confirmDelete
   * @description Confirma y ejecuta la eliminación de la nota.
   */
  const confirmDelete = async () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter((note) => note.id !== noteToDelete);
      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
      setNoteToDelete(null);
    }
    setIsDeleteConfirmationVisible(false);
  };

  /**
   * @function cancelDelete
   * @description Cancela la eliminación de la nota.
   */
  const cancelDelete = () => {
    setNoteToDelete(null);
    setIsDeleteConfirmationVisible(false);
  };

  /**
   * @function filteredNotes
   * @description Devuelve las notas filtradas según la categoría seleccionada.
   */
  const filteredNotes = selectedCategory === 'Todas'
    ? notes
    : notes.filter((note) => note.category === selectedCategory);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[THEME_COLORS.background, '#E8EBF2']} // Ligeramente más claro para el fondo principal
        style={styles.background}
      >
        <StatusBar
          barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
          backgroundColor={THEME_COLORS.primary}
        />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>NoteApp</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingNote(null); // Asegúrate de que no estamos editando al añadir una nueva
              setIsModalVisible(true);
            }}
          >
            <LinearGradient
              colors={[THEME_COLORS.accent, '#0056b3']}
              style={styles.addButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.addButtonText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {filteredNotes.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No hay notas en esta categoría.</Text>
            <Text style={styles.emptyStateSubText}>¡Toca el '+' para añadir una nueva!</Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NoteCard
                note={item}
                onEdit={() => handleEditNote(item)}
                onDelete={() => handleDeleteNote(item.id)}
              />
            )}
            contentContainerStyle={styles.notesList}
          />
        )}

        <Modal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          title={editingNote ? 'Editar Nota' : 'Nueva Nota'}
          showCloseButton={false} // El NoteInput tiene sus propios botones de cancelar
        >
          <NoteInput
            onSave={handleSaveNote}
            onCancel={() => {
              setIsModalVisible(false);
              setEditingNote(null);
            }}
            initialTitle={editingNote?.title}
            initialContent={editingNote?.content}
            initialCategory={editingNote?.category}
          />
        </Modal>

        {/* Modal de confirmación para eliminar */}
        <Modal
          isVisible={isDeleteConfirmationVisible}
          onClose={cancelDelete}
          title="Confirmar Eliminación"
          showCloseButton={false}
        >
          <View style={styles.confirmationContent}>
            <Text style={styles.confirmationText}>
              ¿Estás seguro de que quieres eliminar esta nota?
            </Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity style={[styles.confirmationButton, styles.confirmDeleteButton]} onPress={confirmDelete}>
                <Text style={styles.confirmationButtonText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmationButton, styles.cancelDeleteButton]} onPress={cancelDelete}>
                <Text style={styles.confirmationButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: THEME_COLORS.primary, // Fondo del encabezado
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME_COLORS.lightText,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto', // Fuente más elegante
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: THEME_COLORS.lightText,
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 32, // Ajusta la altura de línea para centrar el '+'
  },
  notesList: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 20,
    color: THEME_COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  emptyStateSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  confirmationContent: {
    padding: 15,
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 18,
    color: THEME_COLORS.text,
    textAlign: 'center',
    marginBottom: 25,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmationButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  confirmDeleteButton: {
    backgroundColor: '#dc3545', // Rojo para confirmar eliminación
  },
  cancelDeleteButton: {
    backgroundColor: THEME_COLORS.secondary, // Un color secundario para cancelar
  },
  confirmationButtonText: {
    color: THEME_COLORS.lightText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotesScreen;
