import { 
  DataService, 
  Deck, 
  FlashcardData, 
  StudySession,
  SerializedDeck,
  SerializedFlashcard,
  serializeDate,
  deserializeDate,
  isValidSerializedDeck,
  isValidSerializedFlashcard
} from './DataService';

export class LocalStorageService implements DataService {
  private readonly STORAGE_KEYS = {
    DECKS: 'flashcard-app-decks',
    FLASHCARDS: 'flashcard-app-flashcards',
    STUDY_SESSIONS: 'flashcard-app-study-sessions',
    VERSION: 'flashcard-app-version'
  };

  private readonly CURRENT_VERSION = '1.0.0';

  constructor() {
    // Only initialize if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.initializeStorage();
    }
  }

  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private initializeStorage(): void {
    if (!this.isClient()) return;
    
    // Check if this is the first time or if we need to migrate data
    const version = localStorage.getItem(this.STORAGE_KEYS.VERSION);
    if (!version) {
      // First time setup
      localStorage.setItem(this.STORAGE_KEYS.VERSION, this.CURRENT_VERSION);
      this.ensureStorageKeys();
    }
    // Future: Add migration logic here when we update data formats
  }

  private ensureStorageKeys(): void {
    if (!this.isClient()) return;
    
    if (!localStorage.getItem(this.STORAGE_KEYS.DECKS)) {
      localStorage.setItem(this.STORAGE_KEYS.DECKS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.FLASHCARDS)) {
      localStorage.setItem(this.STORAGE_KEYS.FLASHCARDS, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.STUDY_SESSIONS)) {
      localStorage.setItem(this.STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify([]));
    }
  }

  private serializeDecks(decks: Deck[]): string {
    return JSON.stringify(decks.map(deck => ({
      ...deck,
      created: serializeDate(deck.created),
      lastStudied: deck.lastStudied ? serializeDate(deck.lastStudied) : undefined
    })));
  }

  private deserializeDecks(data: string): Deck[] {
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      
      return parsed
        .filter(isValidSerializedDeck)
        .map((deck: SerializedDeck) => ({
          ...deck,
          created: deserializeDate(deck.created),
          lastStudied: deck.lastStudied ? deserializeDate(deck.lastStudied) : undefined
        }));
    } catch (error) {
      console.error('Error deserializing decks:', error);
      return [];
    }
  }

  private serializeFlashcards(flashcards: FlashcardData[]): string {
    return JSON.stringify(flashcards.map(card => ({
      ...card,
      created: serializeDate(card.created),
      lastReviewed: card.lastReviewed ? serializeDate(card.lastReviewed) : undefined
    })));
  }

  private deserializeFlashcards(data: string): FlashcardData[] {
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      
      return parsed
        .filter(isValidSerializedFlashcard)
        .map((card: SerializedFlashcard) => ({
          ...card,
          created: deserializeDate(card.created),
          lastReviewed: card.lastReviewed ? deserializeDate(card.lastReviewed) : undefined
        }));
    } catch (error) {
      console.error('Error deserializing flashcards:', error);
      return [];
    }
  }

  // Deck operations
  async saveDecks(decks: Deck[]): Promise<void> {
    if (!this.isClient()) return;
    
    try {
      const serialized = this.serializeDecks(decks);
      localStorage.setItem(this.STORAGE_KEYS.DECKS, serialized);
    } catch (error) {
      console.error('Error saving decks to localStorage:', error);
      throw new Error('Failed to save decks');
    }
  }

  async loadDecks(): Promise<Deck[]> {
    if (!this.isClient()) return [];
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.DECKS);
      if (!data) return [];
      return this.deserializeDecks(data);
    } catch (error) {
      console.error('Error loading decks from localStorage:', error);
      return [];
    }
  }

  // Flashcard operations
  async saveFlashcards(flashcards: FlashcardData[]): Promise<void> {
    if (!this.isClient()) return;
    
    try {
      const serialized = this.serializeFlashcards(flashcards);
      localStorage.setItem(this.STORAGE_KEYS.FLASHCARDS, serialized);
    } catch (error) {
      console.error('Error saving flashcards to localStorage:', error);
      throw new Error('Failed to save flashcards');
    }
  }

  async loadFlashcards(): Promise<FlashcardData[]> {
    if (!this.isClient()) return [];
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.FLASHCARDS);
      if (!data) return [];
      return this.deserializeFlashcards(data);
    } catch (error) {
      console.error('Error loading flashcards from localStorage:', error);
      return [];
    }
  }

  // Study session operations
  async saveStudySession(session: StudySession): Promise<void> {
    if (!this.isClient()) return;
    
    try {
      const sessions = await this.loadStudySessions();
      sessions.push(session);
      const serialized = JSON.stringify(sessions.map(s => ({
        ...s,
        started: serializeDate(s.started),
        ended: s.ended ? serializeDate(s.ended) : undefined
      })));
      localStorage.setItem(this.STORAGE_KEYS.STUDY_SESSIONS, serialized);
    } catch (error) {
      console.error('Error saving study session to localStorage:', error);
      throw new Error('Failed to save study session');
    }
  }

  async loadStudySessions(): Promise<StudySession[]> {
    if (!this.isClient()) return [];
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.STUDY_SESSIONS);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      
      return parsed.map(session => ({
        ...session,
        started: deserializeDate(session.started),
        ended: session.ended ? deserializeDate(session.ended) : undefined
      }));
    } catch (error) {
      console.error('Error loading study sessions from localStorage:', error);
      return [];
    }
  }

  // Bulk operations
  async exportAllData(): Promise<{
    decks: Deck[];
    flashcards: FlashcardData[];
    sessions: StudySession[];
  }> {
    const [decks, flashcards, sessions] = await Promise.all([
      this.loadDecks(),
      this.loadFlashcards(),
      this.loadStudySessions()
    ]);

    return { decks, flashcards, sessions };
  }

  async importAllData(data: {
    decks: Deck[];
    flashcards: FlashcardData[];
    sessions: StudySession[];
  }): Promise<void> {
    await Promise.all([
      this.saveDecks(data.decks),
      this.saveFlashcards(data.flashcards),
      // Note: We're not importing sessions to avoid duplicates
      // In the future, we might want to merge or handle conflicts
    ]);
  }

  async clearAllData(): Promise<void> {
    if (!this.isClient()) return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEYS.DECKS);
      localStorage.removeItem(this.STORAGE_KEYS.FLASHCARDS);
      localStorage.removeItem(this.STORAGE_KEYS.STUDY_SESSIONS);
      localStorage.removeItem(this.STORAGE_KEYS.VERSION);
      this.initializeStorage();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      throw new Error('Failed to clear data');
    }
  }

  // Utility methods for storage management
  getStorageInfo(): {
    version: string;
    deckCount: number;
    flashcardCount: number;
    sessionCount: number;
    storageUsed: number; // in bytes (approximate)
  } {
    if (!this.isClient()) {
      return {
        version: 'unknown',
        deckCount: 0,
        flashcardCount: 0,
        sessionCount: 0,
        storageUsed: 0
      };
    }
    
    const version = localStorage.getItem(this.STORAGE_KEYS.VERSION) || 'unknown';
    const decksData = localStorage.getItem(this.STORAGE_KEYS.DECKS) || '[]';
    const flashcardsData = localStorage.getItem(this.STORAGE_KEYS.FLASHCARDS) || '[]';
    const sessionsData = localStorage.getItem(this.STORAGE_KEYS.STUDY_SESSIONS) || '[]';

    const deckCount = JSON.parse(decksData).length;
    const flashcardCount = JSON.parse(flashcardsData).length;
    const sessionCount = JSON.parse(sessionsData).length;

    // Approximate storage usage in bytes
    const storageUsed = decksData.length + flashcardsData.length + sessionsData.length;

    return {
      version,
      deckCount,
      flashcardCount,
      sessionCount,
      storageUsed
    };
  }
} 