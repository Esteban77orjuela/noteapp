// App.tsx
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotesScreen from './src/screens/NotesScreen';
import { THEME_COLORS } from './src/constants';

/**
 * @function App
 * @description Componente principal de la aplicación NoteApp.
 * Configura el proveedor de área segura y renderiza la pantalla principal de notas.
 * @returns {JSX.Element} El componente App renderizado.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NotesScreen />
        {/*
          StatusBar de Expo para manejar la barra de estado del dispositivo.
          'auto' ajusta el estilo de la barra de estado automáticamente según el tema del sistema.
        */}
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background, // Usa el color de fondo de tu tema
  },
});
