// src/components/CategorySelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CATEGORIES, THEME_COLORS } from '../constants';
import { Category } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * @interface CategorySelectorProps
 * @description Propiedades para el componente CategorySelector.
 * @property {string} selectedCategory - La categoría actualmente seleccionada.
 * @property {(category: string) => void} onSelectCategory - Función que se llama cuando se selecciona una categoría.
 */
interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

/**
 * @function CategorySelector
 * @description Componente de UI para seleccionar una categoría de notas.
 * Muestra una lista desplazable de botones de categoría, incluyendo una opción "Todas".
 * @param {CategorySelectorProps} props - Las propiedades del componente.
 * @returns {JSX.Element} El componente CategorySelector renderizado.
 */
const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  // Añade una opción para ver "Todas" las notas
  const allCategories = [{ name: 'Todas', icon: 'list' }, ...CATEGORIES];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {allCategories.map((category: Category) => (
          <TouchableOpacity
            key={category.name}
            onPress={() => onSelectCategory(category.name)}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={
                selectedCategory === category.name
                  ? [THEME_COLORS.accent, THEME_COLORS.primary]
                  : ['#5a718c', '#4c669f'] // Colores para botones no seleccionados
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.selectedCategoryButton,
              ]}
            >
              {/* Aquí podrías añadir un ícono si tuvieras una librería de íconos */}
              <Text style={styles.categoryButtonText}>{category.icon && `(${category.icon})`} {category.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: THEME_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  buttonWrapper: {
    marginHorizontal: 5,
    borderRadius: 25,
    overflow: 'hidden', // Asegura que el gradiente respete el borde
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryButton: {
    // Estilos adicionales para el botón seleccionado si los hubiera
    // El gradiente ya maneja la distinción visual
  },
  categoryButtonText: {
    color: THEME_COLORS.lightText,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default CategorySelector;
