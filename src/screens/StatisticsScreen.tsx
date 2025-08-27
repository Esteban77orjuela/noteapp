// src/screens/StatisticsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Note } from '../types';
import { loadNotes } from '../storage';
import { THEME_COLORS } from '../constants';

/**
 * @interface StatisticsScreenProps
 * @description Propiedades para el componente StatisticsScreen.
 */
interface StatisticsScreenProps {
  onBack: () => void;
}

/**
 * @function StatisticsScreen
 * @description Pantalla para mostrar estadísticas sobre las notas.
 * @param {StatisticsScreenProps} props - Las propiedades del componente.
 * @returns {JSX.Element} El componente StatisticsScreen renderizado.
 */
const StatisticsScreen: React.FC<StatisticsScreenProps> = ({ onBack }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [notesByCategory, setNotesByCategory] = useState<Record<string, number>>({});
  const [longestNote, setLongestNote] = useState<Note | null>(null);
  const [shortestNote, setShortestNote] = useState<Note | null>(null);

  /**
   * @function fetchNotes
   * @description Carga las notas desde AsyncStorage.
   */
  const fetchNotes = async () => {
    try {
      const storedNotes = await loadNotes();
      setNotes(storedNotes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  /**
   * @function calculateStatistics
   * @description Calcula las estadísticas basadas en las notas cargadas.
   */
  const calculateStatistics = () => {
    // Total de notas
    setTotalNotes(notes.length);

    // Notas por categoría
    const categoryCount: Record<string, number> = {};
    notes.forEach(note => {
      categoryCount[note.category] = (categoryCount[note.category] || 0) + 1;
    });
    setNotesByCategory(categoryCount);

    // Nota más larga y más corta
    if (notes.length > 0) {
      let longest = notes[0];
      let shortest = notes[0];
      
      notes.forEach(note => {
        if (note.content.length > longest.content.length) {
          longest = note;
        }
        if (note.content.length < shortest.content.length) {
          shortest = note;
        }
      });
      
      setLongestNote(longest);
      setShortestNote(shortest);
    } else {
      setLongestNote(null);
      setShortestNote(null);
    }
  };

  // Cargar notas cuando el componente se monta
  useEffect(() => {
    fetchNotes();
  }, []);

  // Calcular estadísticas cuando las notas cambian
  useEffect(() => {
    calculateStatistics();
  }, [notes]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[THEME_COLORS.background, '#E8EBF2']}
        style={styles.background}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Estadísticas</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total de Notas</Text>
            <Text style={styles.statValue}>{totalNotes}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Notas por Categoría</Text>
            {Object.entries(notesByCategory).map(([category, count]) => (
              <View key={category} style={styles.categoryRow}>
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryCount}>{count}</Text>
              </View>
            ))}
          </View>

          {longestNote && (
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Nota más Larga</Text>
              <Text style={styles.noteTitle}>{longestNote.title}</Text>
              <Text style={styles.noteCategory}>{longestNote.category}</Text>
              <Text style={styles.noteLength}>{longestNote.content.length} caracteres</Text>
            </View>
          )}

          {shortestNote && (
            <View style={styles.statCard}>
              <Text style={styles.statTitle}>Nota más Corta</Text>
              <Text style={styles.noteTitle}>{shortestNote.title}</Text>
              <Text style={styles.noteCategory}>{shortestNote.category}</Text>
              <Text style={styles.noteLength}>{shortestNote.content.length} caracteres</Text>
            </View>
          )}
        </ScrollView>
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
    backgroundColor: THEME_COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: THEME_COLORS.lightText,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME_COLORS.lightText,
    fontFamily: 'Roboto',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: THEME_COLORS.accent,
    textAlign: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryName: {
    fontSize: 18,
    color: THEME_COLORS.text,
  },
  categoryCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLORS.accent,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_COLORS.text,
    marginBottom: 5,
  },
  noteCategory: {
    fontSize: 16,
    color: THEME_COLORS.secondary,
    marginBottom: 5,
  },
  noteLength: {
    fontSize: 16,
    color: '#666',
  },
});

export default StatisticsScreen;