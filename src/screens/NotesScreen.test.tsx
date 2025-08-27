// src/screens/NotesScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NotesScreen from './NotesScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

// Mock Toast
jest.mock('react-native-toast-message', () => ({
  default: {
    show: jest.fn(),
  },
}));

describe('NotesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the notes screen', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    
    const { getByText } = render(<NotesScreen />);
    
    await waitFor(() => {
      expect(getByText('NoteApp')).toBeTruthy();
    });
  });

  it('should display a message when there are no notes', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    
    const { getByText } = render(<NotesScreen />);
    
    await waitFor(() => {
      expect(getByText('No se encontraron notas.')).toBeTruthy();
    });
  });

  it('should display notes when they are loaded', async () => {
    const mockNotes = [
      {
        id: '1',
        title: 'Test Note',
        content: 'This is a test note',
        category: 'Test',
        timestamp: Date.now(),
      },
    ];
    
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNotes));
    
    const { getByText } = render(<NotesScreen />);
    
    await waitFor(() => {
      expect(getByText('Test Note')).toBeTruthy();
    });
  });

  it('should show loading indicator while fetching notes', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => resolve(null), 100));
    });
    
    const { getByText } = render(<NotesScreen />);
    
    expect(getByText('Cargando notas...')).toBeTruthy();
    
    await waitFor(() => {
      expect(getByText('No se encontraron notas.')).toBeTruthy();
    });
  });
});