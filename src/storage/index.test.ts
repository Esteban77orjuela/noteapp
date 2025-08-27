// src/storage/index.test.ts
import { Note } from '../types';
import { saveNotes, loadNotes, clearAllNotes, exportNotes, importNotes } from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('Storage functions', () => {
  const mockNotes: Note[] = [
    {
      id: '1',
      title: 'Test Note 1',
      content: 'This is the content of test note 1',
      category: 'Test',
      timestamp: Date.now(),
    },
    {
      id: '2',
      title: 'Test Note 2',
      content: 'This is the content of test note 2',
      category: 'Test',
      timestamp: Date.now() + 1000,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveNotes', () => {
    it('should save notes to AsyncStorage', async () => {
      await saveNotes(mockNotes);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@NoteApp:notes',
        JSON.stringify(mockNotes)
      );
    });

    it('should throw an error if saving fails', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Save failed'));
      
      await expect(saveNotes(mockNotes)).rejects.toThrow('Save failed');
    });
  });

  describe('loadNotes', () => {
    it('should load notes from AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNotes));
      
      const notes = await loadNotes();
      
      expect(notes).toEqual(mockNotes);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@NoteApp:notes');
    });

    it('should return an empty array if no notes are found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      
      const notes = await loadNotes();
      
      expect(notes).toEqual([]);
    });

    it('should return an empty array if loading fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Load failed'));
      
      const notes = await loadNotes();
      
      expect(notes).toEqual([]);
    });
  });

  describe('clearAllNotes', () => {
    it('should remove all notes from AsyncStorage', async () => {
      await clearAllNotes();
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@NoteApp:notes');
    });

    it('should throw an error if clearing fails', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Clear failed'));
      
      await expect(clearAllNotes()).rejects.toThrow('Clear failed');
    });
  });

  describe('exportNotes', () => {
    it('should export notes as a JSON string', () => {
      const exportedData = exportNotes(mockNotes);
      const parsedData = JSON.parse(exportedData);
      
      expect(exportedData).toBe(JSON.stringify(mockNotes, null, 2));
      expect(parsedData).toEqual(mockNotes);
    });
  });

  describe('importNotes', () => {
    it('should import notes from a JSON string', () => {
      const jsonData = JSON.stringify(mockNotes);
      const importedNotes = importNotes(jsonData);
      
      expect(importedNotes).toEqual(mockNotes);
    });

    it('should throw an error if the data is not valid JSON', () => {
      expect(() => importNotes('invalid json')).toThrow();
    });

    it('should throw an error if the data is not an array', () => {
      expect(() => importNotes(JSON.stringify({}))).toThrow('Los datos importados no son un array válido');
    });

    it('should throw an error if the data does not have the correct format', () => {
      const invalidData = JSON.stringify([{ id: '1', title: 'Test' }]); // Missing required properties
      expect(() => importNotes(invalidData)).toThrow('Los datos importados no tienen el formato correcto');
    });
  });
});