// Tipos de datos para las notas

export interface Note {
    id: number;   
    content: string;  
    createdAt: string;
    updatedAt: string;  
    category: 'Teologia' | 'Filosofia'; // New field for category
}

