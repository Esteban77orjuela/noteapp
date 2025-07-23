// Descripcion: Pantalla principal de notas que permite agregar, editar y eliminar notas.
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, Button, TouchableOpacity } from 'react-native';
import { Note } from '../types/Note';
import NoteInput from '../components/NoteInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from '../components/Modal';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

// Clave para almacenar las notas en AsyncStorage
const NOTES_KEY = 'notes';

// Componente principal de la pantalla de notas
const NotesScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Función para eliminar una nota por su ID
  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Función para agregar una nueva nota
  const handleAddNote = (note: Note) => {
    setNotes([note, ...notes]);
  };

  // Función para editar una nota existente
  const handleEditNote = (note: Note) => {
    setNotes(notes.map(n => (n.id === note.id ? note : n)));
    setEditingNote(null);
  };

  // Cargar notas desde AsyncStorage al iniciar la pantalla
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem(NOTES_KEY);
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.error('Error loading notes from AsyncStorage:', error);
      } finally {
        setIsReady(true);
      }
    };
    loadNotes();
  }, []);

  // Guardar notas en AsyncStorage cada vez que cambian
  useEffect(() => {
    if (!isReady) return;
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes to AsyncStorage:', error);
      }
    };
    saveNotes();
  }, [notes, isReady]);

  // Renderizar cada elemento de la lista de notas
  const renderNoteItem = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteContent}>{item.content}</Text>
      <View style={styles.categoryTagContainer}>
        <Text style={styles.noteCategory}>{item.category}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.circleButton, styles.editButton]} onPress={() => setEditingNote(item)}>
          <Feather name="edit-2" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.circleButton, styles.deleteButton]} onPress={() => handleDeleteNote(item.id)}>
          <Feather name="trash-2" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient 
    colors={['#8A2BE2', '#9370DB']}
    start={{x: 0, y: 0}}
    end={{x: 0, y: 1}}
    style={styles.container}>

      <View style={styles.card}>
        {/* Titulo de la pantalla */}
        <Text style={styles.title}>Mis Notas</Text>

      {/* ID de Usuario */}
      <View style={styles.userIdContainer}>
        <Text style={styles.userId}>ID de Usuario: 00479621697753312706</Text>
      </View>

      {/* Boton Añadir Nueva Nota */}
      <View style={styles.addButtonContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <View style={styles.addButtonContent}>
          <AntDesign name="pluscircleo" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Añadir Nueva Nota</Text>
        </View>
      </TouchableOpacity>
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
       <NoteInput
         onAddNote={(note) => {
           handleAddNote(note);
           setModalVisible(false); // Cierra el modal al guardar
         }}
         noteToEdit={editingNote}
         onEditNote={handleEditNote}
       />
     </Modal>
      </View>
      
      {/* Lista de Notas */}
      {notes.length === 0 ? (
        <Text style={styles.emptyText}>No hay notas aún.</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNoteItem}
        />
      )}
      
      {/* Componente de entrada de notas */}
      
      </View>
    </LinearGradient>
  );
};

// Estilos para la pantalla de notas
const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    padding: 16,
  },
  addButton: {
    backgroundColor: '#6366f1', // Morado/azul
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#8A2BE2',
    marginBottom: 10,
  },
  userIdContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  userId: {
    textAlign: 'center',
    color: '#666',
  },
  addButtonContainer: {
    marginBottom: 20,
    backgroundColor: '#4169E1',
    borderRadius: 10,
    overflow: 'hidden',
  },
  noteItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noteContent: {
    fontSize: 16,
  },
  noteCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFEE58',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  categoryTagContainer: {
    marginVertical: 5,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default NotesScreen;