// src/domain/entities/Note.ts

/**
 * @class Note
 * @description Representa una nota en el dominio de la aplicación.
 * Contiene la lógica de negocio relacionada con una nota.
 */
export class Note {
    constructor(
      public readonly id: string,
      public title: string,
      public content: string,
      public category: string,
      public timestamp: number
    ) {}
  
    /**
     * Valida si la nota es válida
     */
    isValid(): boolean {
      return !!this.title.trim() && !!this.content.trim();
    }
  
    /**
     * Actualiza el timestamp al momento actual
     */
    updateTimestamp(): void {
      this.timestamp = Date.now();
    }
  }