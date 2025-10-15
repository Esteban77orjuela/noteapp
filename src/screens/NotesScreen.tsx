// src/screens/NotesScreen.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Importar componentes y utilidades
import NoteCard from '../components/NoteCard';
import NoteInput from '../components/NoteInput';
import Modal from '../components/Modal';
import CategorySelector from '../components/CategorySelector';
import { Note } from '../types';
import { saveNotes, loadNotes, exportNotes } from '../storage';
import { generateUniqueId } from '../helpers';
import { THEME_COLORS } from '../constants';
import StatisticsScreen from './StatisticsScreen';

const NotesScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Teologia');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isCategoryManagementVisible, setIsCategoryManagementVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'notes' | 'statistics'>('notes');
  const [isLoading, setIsLoading] = useState(true);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedNotes = await loadNotes();
      setNotes(storedNotes.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar las notas. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleSaveNote = async (title: string, content: string, category: string) => {
    let updatedNotes: Note[];
    if (editingNote) {
      updatedNotes = notes.map((note) =>
        note.id === editingNote.id
          ? { ...note, title, content, category, timestamp: Date.now() }
          : note
      );
      setEditingNote(null);
    } else {
      const newNote: Note = {
        id: generateUniqueId(),
        title,
        content,
        category,
        timestamp: Date.now(),
      };
      updatedNotes = [newNote, ...notes];
    }
    setNotes(updatedNotes.sort((a, b) => b.timestamp - a.timestamp));
    try {
      await saveNotes(updatedNotes);
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: editingNote ? 'Nota actualizada correctamente.' : 'Nota creada correctamente.',
      });
    } catch (error) {
      console.error('Failed to save notes:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo guardar la nota. Por favor, inténtalo de nuevo.',
      });
      return;
    }
    setIsModalVisible(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalVisible(true);
  };

  const handleDeleteNote = (id: string) => {
    setNoteToDelete(id);
    setIsDeleteConfirmationVisible(true);
  };

  const confirmDelete = async () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter((note) => note.id !== noteToDelete);
      setNotes(updatedNotes);
      try {
        await saveNotes(updatedNotes);
        Toast.show({
          type: 'success',
          text1: 'Éxito',
          text2: 'Nota eliminada correctamente.',
        });
      } catch (error) {
        console.error('Failed to delete note:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo eliminar la nota. Por favor, inténtalo de nuevo.',
        });
        return;
      }
      setNoteToDelete(null);
    }
    setIsDeleteConfirmationVisible(false);
  };

  const cancelDelete = () => {
    setNoteToDelete(null);
    setIsDeleteConfirmationVisible(false);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => note.category === selectedCategory);
  }, [notes, selectedCategory]);

  const filteredNotesBySearch = useMemo(() => {
    return debouncedSearchQuery
      ? filteredNotes.filter((note: Note) =>
          note.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
      : filteredNotes;
  }, [debouncedSearchQuery, filteredNotes]);

  const sortedNotes = useMemo(() => {
    return [...filteredNotesBySearch].sort((a, b) => {
      if (sortBy === 'date') {
        return b.timestamp - a.timestamp;
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, [filteredNotesBySearch, sortBy]);

  const backgroundColor = isDarkMode ? '#121212' : THEME_COLORS.background;
  const textColor = isDarkMode ? '#ffffff' : THEME_COLORS.text;
  const headerBackgroundColor = isDarkMode ? '#1e1e1e' : THEME_COLORS.primary;
  const searchInputBackgroundColor = isDarkMode ? '#333333' : '#ffffff';
  const searchInputTextColor = isDarkMode ? '#ffffff' : THEME_COLORS.text;
  const searchInputPlaceholderColor = isDarkMode ? '#aaaaaa' : '#999999';
  const emptyStateTextColor = isDarkMode ? '#cccccc' : THEME_COLORS.text;
  const emptyStateSubTextColor = isDarkMode ? '#999999' : '#666666';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      {currentScreen === 'notes' ? (
        <LinearGradient
          colors={[backgroundColor, isDarkMode ? '#1e1e1e' : '#E8EBF2']}
          style={styles.background}
        >
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
            backgroundColor={isDarkMode ? '#333333' : THEME_COLORS.primary}
          />

          <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
            <Text style={[styles.headerTitle, { color: textColor }]}>NoteApp</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.themeButton}
                onPress={() => setIsDarkMode(!isDarkMode)}
              >
                <Text style={styles.themeButtonText}>{isDarkMode ? '☀️' : '🌙'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statsButton}
                onPress={() => setCurrentScreen('statistics')}
              >
                <Text style={styles.statsButtonText}>📊</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setEditingNote(null);
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
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, { backgroundColor: searchInputBackgroundColor, color: searchInputTextColor }]}
              placeholder="Buscar notas..."
              placeholderTextColor={searchInputPlaceholderColor}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>

          <View style={styles.manageCategoriesContainer}>
            <TouchableOpacity
              style={styles.manageCategoriesButton}
              onPress={() => setIsCategoryManagementVisible(true)}
            >
              <Text style={[styles.manageCategoriesButtonText, { color: textColor }]}>Gestionar Categorías</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Ordenar por:</Text>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'date' && styles.selectedSortButton]}
              onPress={() => setSortBy('date')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'date' && styles.selectedSortButtonText]}>
                Fecha
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'title' && styles.selectedSortButton]}
              onPress={() => setSortBy('title')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'title' && styles.selectedSortButtonText]}>
                Título
              </Text>
            </TouchableOpacity>
          </View>

          <CategorySelector
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={THEME_COLORS.accent} />
              <Text style={[styles.loadingText, { color: textColor }]}>Cargando notas...</Text>
            </View>
          ) : sortedNotes.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={[styles.emptyStateText, { color: emptyStateTextColor }]}>No se encontraron notas.</Text>
              <Text style={[styles.emptyStateSubText, { color: emptyStateSubTextColor }]}>¡Toca el '+' para añadir una nueva!</Text>
            </View>
          ) : (
            <FlatList
              data={sortedNotes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <NoteCard
                  note={item}
                  onEdit={() => handleEditNote(item)}
                  onDelete={() => handleDeleteNote(item.id)}
                />
              )}
              contentContainerStyle={styles.notesList}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
            />
          )}

          <Modal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            title={editingNote ? 'Editar Nota' : 'Nueva Nota'}
            showCloseButton={false}
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
              isEditing={!!editingNote}
            />
          </Modal>

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

          <Modal
            isVisible={isCategoryManagementVisible}
            onClose={() => setIsCategoryManagementVisible(false)}
            title="Gestionar Categorías"
            showCloseButton={false}
          >
            <View style={styles.categoryManagementContent}>
              <Text style={[styles.categoryManagementText, { color: textColor }]}>
                Funcionalidad de gestión de categorías próximamente...
              </Text>
              
              <View style={styles.exportImportContainer}>
                <TouchableOpacity
                  style={[styles.exportImportButton, { backgroundColor: THEME_COLORS.accent }]}
                  onPress={async () => {
                    try {
                      const exportedData = exportNotes(notes);
                      console.log('Datos exportados:', exportedData);
                      Toast.show({
                        type: 'success',
                        text1: 'Éxito',
                        text2: 'Notas exportadas correctamente.',
                      });
                    } catch (error) {
                      console.error('Error al exportar notas:', error);
                      Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'No se pudieron exportar las notas.',
                      });
                    }
                  }}
                >
                  <Text style={[styles.exportImportButtonText, { color: textColor }]}>Exportar Notas</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.exportImportButton, { backgroundColor: THEME_COLORS.primary }]}
                  onPress={async () => {
                    console.log('Importar notas');
                    Toast.show({
                      type: 'info',
                      text1: 'Información',
                      text2: 'Funcionalidad de importación próximamente.',
                    });
                  }}
                >
                  <Text style={[styles.exportImportButtonText, { color: textColor }]}>Importar Notas</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[styles.categoryManagementButton, { backgroundColor: headerBackgroundColor }]}
                onPress={() => setIsCategoryManagementVisible(false)}
              >
                <Text style={[styles.categoryManagementButtonText, { color: textColor }]}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Modal>

        </LinearGradient>
      ) : (
        <StatisticsScreen onBack={() => setCurrentScreen('notes')} />
      )}
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
    backgroundColor: THEME_COLORS.primary,
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
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto',
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
    lineHeight: 32,
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
    backgroundColor: '#dc3545',
  },
  cancelDeleteButton: {
    backgroundColor: THEME_COLORS.secondary,
  },
  confirmationButtonText: {
    color: THEME_COLORS.lightText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  themeButtonText: {
    fontSize: 20,
  },
  manageCategoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  manageCategoriesButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  manageCategoriesButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryManagementContent: {
    padding: 15,
    alignItems: 'center',
  },
  categoryManagementText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
  },
  categoryManagementButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryManagementButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statsButtonText: {
    fontSize: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  sortButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 5,
  },
  selectedSortButton: {
    backgroundColor: THEME_COLORS.accent,
  },
  sortButtonText: {
    fontSize: 16,
    color: THEME_COLORS.text,
  },
  selectedSortButtonText: {
    color: THEME_COLORS.lightText,
  },
  exportImportContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  exportImportButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  exportImportButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default NotesScreen;
