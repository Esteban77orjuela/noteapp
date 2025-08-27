// src/components/NoteCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NoteCard from './NoteCard';
import { Note } from '../types';

describe('NoteCard', () => {
  const mockNote: Note = {
    id: '1',
    title: 'Test Note',
    content: 'This is a test note content',
    category: 'Test',
    timestamp: Date.now(),
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the note card with correct information', () => {
    const { getByText } = render(
      <NoteCard note={mockNote} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(getByText(mockNote.category)).toBeTruthy();
    expect(getByText(mockNote.title)).toBeTruthy();
    expect(getByText(mockNote.content)).toBeTruthy();
  });

  it('should call onEdit when the edit button is pressed', () => {
    const { getByText } = render(
      <NoteCard note={mockNote} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    fireEvent.press(getByText('Editar'));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when the delete button is pressed', () => {
    const { getByText } = render(
      <NoteCard note={mockNote} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    fireEvent.press(getByText('Eliminar'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('should toggle content preview when the preview button is pressed', () => {
    const { getByText } = render(
      <NoteCard note={mockNote} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const previewButton = getByText('Ver más');
    fireEvent.press(previewButton);
    
    // After pressing "Ver más", it should change to "Ver menos"
    expect(getByText('Ver menos')).toBeTruthy();
  });
});