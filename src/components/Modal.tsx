// src/components/Modal.tsx
import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { THEME_COLORS } from '../constants';

/**
 * @interface ModalProps
 * @description Propiedades para el componente Modal.
 * @property {boolean} isVisible - Controla la visibilidad del modal.
 * @property {() => void} onClose - Función que se llama cuando se solicita cerrar el modal (e.g., al tocar fuera).
 * @property {string} [title] - Título opcional para el encabezado del modal.
 * @property {boolean} [showCloseButton=true] - Booleano para mostrar u ocultar el botón de cerrar.
 */
interface ModalProps extends PropsWithChildren {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
}

/**
 * @function Modal
 * @description Componente de UI para mostrar contenido en una superposición modal.
 * Proporciona un fondo oscurecido y un contenedor central para el contenido.
 * @param {ModalProps} props - Las propiedades del componente.
 * @returns {JSX.Element | null} El componente Modal renderizado o `null` si no es visible.
 */
const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  title,
  showCloseButton = true,
  children,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.modalContent}>
        {title && <Text style={styles.modalTitle}>{title}</Text>}
        {children}
        {showCloseButton && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Cubre toda la pantalla
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscurecido
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Asegura que el modal esté por encima de otros elementos
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject, // Ayuda a capturar toques fuera del modal
  },
  modalContent: {
    backgroundColor: THEME_COLORS.background,
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%', // Limita la altura del modal
    elevation: 15, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: THEME_COLORS.secondary,
    borderRadius: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: THEME_COLORS.lightText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Modal;
