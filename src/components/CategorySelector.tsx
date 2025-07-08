// Componente que permite seleccionar la categoría de una nota

import React from "react";
import { View, Button, StyleSheet } from "react-native";

// Definición de las propiedades del componente CategorySelector
interface CategorySelectorProps {
  category: 'Teologia' | 'Filosofia';
  onSelectCategory: (category: 'Teologia' | 'Filosofia') => void;
}   

// Componente CategorySelector que permite seleccionar entre Teología y Filosofía
const CategorySelector: React.FC<CategorySelectorProps> = ({ category, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Teologia"
        onPress={() => onSelectCategory('Teologia')}
        color={category === 'Teologia' ? 'blue' : 'gray'}
      />
      <Button
        title="Filosofia"
        onPress={() => onSelectCategory('Filosofia')}
        color={category === 'Filosofia' ? 'blue' : 'gray'}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
});
export default CategorySelector;