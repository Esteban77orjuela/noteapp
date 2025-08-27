// src/components/NoteCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Note } from '../types';
import { THEME_COLORS } from '../constants';

/**
 * @interface NoteCardProps
 * @description Propiedades para el componente NoteCard.
 * @property {Note} note - El objeto Note a mostrar en la tarjeta.
 * @property {() => void} onEdit - Función que se llama cuando se presiona el botón de editar.
 * @property {() => void} onDelete - Función que se llama cuando se presiona el botón de eliminar.
 */
interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * @function NoteCard
 * @description Componente de UI para mostrar una nota individual.
 * Incluye el título, contenido, categoría, fecha y botones de acción (editar/eliminar).
 * @param {NoteCardProps} props - Las propiedades del componente.
 * @returns {JSX.Element} El componente NoteCard renderizado.
 */
const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const [isPreview, setIsPreview] = useState(true); // Estado para alternar entre vista previa y vista completa
  const [animation] = useState(new Animated.Value(0)); // Valor de animación
  
  // Formatea el timestamp a una fecha legible
  const formattedDate = new Date(note.timestamp).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Efecto de entrada de la tarjeta
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  // Interpolación para la animación de entrada
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <LinearGradient
        colors={[THEME_COLORS.secondary, THEME_COLORS.tertiary]}
        style={styles.cardContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.categoryText} accessibilityLabel={`Categoría: ${note.category}`}>{note.category}</Text>
        <Text style={styles.titleText} accessibilityLabel={`Título: ${note.title}`}>{note.title}</Text>
        <Text style={styles.contentText} numberOfLines={isPreview ? 3 : undefined} accessibilityLabel={`Contenido: ${note.content}`}>
          {note.content}
        </Text>
        <Text style={styles.dateText} accessibilityLabel={`Fecha: ${formattedDate}`}>{formattedDate}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.previewButton]}
            onPress={() => setIsPreview(!isPreview)}
            accessibilityLabel={isPreview ? 'Ver más contenido' : 'Ver menos contenido'}
            accessibilityHint="Toca para expandir o contraer el contenido de la nota"
          >
            <Text style={styles.buttonText}>{isPreview ? 'Ver más' : 'Ver menos'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={onEdit}
            accessibilityLabel="Editar nota"
            accessibilityHint="Toca para editar esta nota"
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={onDelete}
            accessibilityLabel="Eliminar nota"
            accessibilityHint="Toca para eliminar esta nota"
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    width: '95%',
    alignSelf: 'center',
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  categoryText: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_COLORS.lightText,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#f0f0f0',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#cccccc',
    textAlign: 'right',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: THEME_COLORS.accent,
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Un rojo para eliminar
  },
  buttonText: {
    color: THEME_COLORS.lightText,
    fontWeight: 'bold',
    fontSize: 14,
  },
  previewButton: {
    backgroundColor: THEME_COLORS.primary,
  },
  animatedContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default NoteCard;
