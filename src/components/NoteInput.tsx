// Descripcion: Esta es un componente de entrada para notas que permite agregar o editar notas con una categoría seleccionable.
import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { Note } from "../types/Note";
import CategorySelector from "./CategorySelector";

// Definición de las propiedades del componente NoteInput
interface NoteInputProps {
  onAddNote: (note: Note) => void;
  onEditNote?: (note: Note) => void;
  noteToEdit?: Note | null;
}
// Componente NoteInput que permite agregar o editar notas
const NoteInput: React.FC<NoteInputProps> = ({ onAddNote, noteToEdit, onEditNote }) => {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<'Teologia' | 'Filosofia'>('Teologia');

  // Efecto para cargar la nota a editar si existe
  useEffect(() => {
    if (noteToEdit) {
      setContent(noteToEdit.content);
      setCategory(noteToEdit.category);
    } else {
      setContent("");
      setCategory('Teologia');
    }
  }, [noteToEdit]);

  // Función para manejar el envío del formulario
  const handleSubmit = () => {
    if (!content.trim()) return;
    if (noteToEdit && onEditNote) {
      const updatedNote: Note = {
        ...noteToEdit,
        content,
        category,
        updatedAt: new Date().toISOString(),
      };
      onEditNote(updatedNote);
    } else {
      const newNote: Note = {
        id: Date.now(),
        content,
        category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddNote(newNote);
    }
    setContent("");
    setCategory('Teologia');
  };

  return (
    <View style={styles.container}>
      <CategorySelector category={category} onSelectCategory={setCategory} />
      <TextInput
        style={styles.input}
        placeholder="Escribe tu nota..."
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button
        title={noteToEdit ? "Guardar Cambios" : "Agregar Nota"}
        onPress={handleSubmit}
        disabled={!content.trim()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    fontSize: 16,
    minHeight: 40,
  },
});

export default NoteInput;