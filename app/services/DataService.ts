// Data types
export interface FlashcardData {
  id: string;
  front: string;
  back: string;
  created: Date;
  deckId: string;
  lastReviewed?: Date;
  difficulty?: number; // For future spaced repetition
  interval?: number;   // For future spaced repetition
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  created: Date;
  cardCount: number;
  lastStudied?: Date;
}

export interface StudySession {
  id: string;
  deckId: string;
  started: Date;
  ended?: Date;
  cardsStudied: number;
  correctAnswers: number;
}

// Abstract interface for data operations
// This allows us to easily switch between LocalStorage and Cloud storage
export interface DataService {
  // Deck operations
  saveDecks(decks: Deck[]): Promise<void>;
  loadDecks(): Promise<Deck[]>;
  
  // Flashcard operations
  saveFlashcards(flashcards: FlashcardData[]): Promise<void>;
  loadFlashcards(): Promise<FlashcardData[]>;
  
  // Study session operations (for future analytics)
  saveStudySession(session: StudySession): Promise<void>;
  loadStudySessions(): Promise<StudySession[]>;
  
  // Bulk operations for sync
  exportAllData(): Promise<{
    decks: Deck[];
    flashcards: FlashcardData[];
    sessions: StudySession[];
  }>;
  
  importAllData(data: {
    decks: Deck[];
    flashcards: FlashcardData[];
    sessions: StudySession[];
  }): Promise<void>;
  
  // Clear all data (for testing/reset)
  clearAllData(): Promise<void>;
}

// Utility functions for data serialization
export const serializeDate = (date: Date): string => date.toISOString();
export const deserializeDate = (dateString: string): Date => new Date(dateString);

// Serialized types for storage
export interface SerializedDeck {
  id: string;
  name: string;
  description: string;
  created: string;
  cardCount: number;
  lastStudied?: string;
}

export interface SerializedFlashcard {
  id: string;
  front: string;
  back: string;
  created: string;
  deckId: string;
  lastReviewed?: string;
  difficulty?: number;
  interval?: number;
}

// Data validation helpers
export const isValidSerializedDeck = (deck: unknown): deck is SerializedDeck => {
  return (
    typeof deck === 'object' &&
    deck !== null &&
    typeof (deck as Record<string, unknown>).id === 'string' &&
    typeof (deck as Record<string, unknown>).name === 'string' &&
    typeof (deck as Record<string, unknown>).description === 'string' &&
    typeof (deck as Record<string, unknown>).created === 'string' &&
    typeof (deck as Record<string, unknown>).cardCount === 'number'
  );
};

export const isValidSerializedFlashcard = (card: unknown): card is SerializedFlashcard => {
  return (
    typeof card === 'object' &&
    card !== null &&
    typeof (card as Record<string, unknown>).id === 'string' &&
    typeof (card as Record<string, unknown>).front === 'string' &&
    typeof (card as Record<string, unknown>).back === 'string' &&
    typeof (card as Record<string, unknown>).created === 'string' &&
    typeof (card as Record<string, unknown>).deckId === 'string'
  );
}; 