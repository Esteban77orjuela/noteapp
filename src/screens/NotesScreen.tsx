// Descripcion: Pantalla principal de notas que permite agregar, editar y eliminar notas.
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar, Button } from 'react-native';
import { Note } from '../types/Note';
import NoteInput from '../components/NoteInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave para almacenar las notas en AsyncStorage
const NOTES_KEY = 'notes';

// Componente principal de la pantalla de notas
const NotesScreen = () => {
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
      <Text style={styles.noteCategory}>{item.category}</Text>
      <View style={styles.buttonRow}>
        <Button title="Editar" onPress={() => setEditingNote(item)} />
        <Button title="Eliminar" color="red" onPress={() => handleDeleteNote(item.id)} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <NoteInput
        onAddNote={handleAddNote}
        noteToEdit={editingNote}
        onEditNote={handleEditNote}
      />
      {notes.length === 0 ? (
        <Text style={styles.emptyText}>No hay notas aún.</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNoteItem}
        />
      )}
    </SafeAreaView>
  );
};

// Estilos para la pantalla de notas
const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
});

export default NotesScreen;