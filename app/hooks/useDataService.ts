'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataService, Deck, FlashcardData } from '../services/DataService';
import { LocalStorageService } from '../services/LocalStorageService';

// Create a singleton instance of the data service
const dataService: DataService = new LocalStorageService();

export function useDataService() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [loadedDecks, loadedFlashcards] = await Promise.all([
          dataService.loadDecks(),
          dataService.loadFlashcards()
        ]);

        // Update deck card counts based on loaded flashcards
        const updatedDecks = loadedDecks.map(deck => ({
          ...deck,
          cardCount: loadedFlashcards.filter(card => card.deckId === deck.id).length
        }));

        // Create a default deck if none exist
        if (updatedDecks.length === 0) {
          const defaultDeck: Deck = {
            id: crypto.randomUUID(),
            name: 'My First Deck',
            description: 'Your first flashcard deck. You can rename or delete this deck anytime.',
            created: new Date(),
            cardCount: 0,
          };
          
          await dataService.saveDecks([defaultDeck]);
          setDecks([defaultDeck]);
        } else {
          setDecks(updatedDecks);
        }
        
        setFlashcards(loadedFlashcards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to update deck card counts
  const updateDeckCardCounts = useCallback((updatedFlashcards: FlashcardData[]) => {
    setDecks(prevDecks => 
      prevDecks.map(deck => ({
        ...deck,
        cardCount: updatedFlashcards.filter(card => card.deckId === deck.id).length
      }))
    );
  }, []);

  // Deck operations
  const saveDecks = useCallback(async (newDecks: Deck[]) => {
    try {
      await dataService.saveDecks(newDecks);
      setDecks(newDecks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save decks');
      throw err;
    }
  }, []);

  const createDeck = useCallback(async (name: string, description: string) => {
    try {
      const newDeck: Deck = {
        id: crypto.randomUUID(),
        name,
        description,
        created: new Date(),
        cardCount: 0,
      };
      
      const updatedDecks = [...decks, newDeck];
      await saveDecks(updatedDecks);
      return newDeck;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deck');
      throw err;
    }
  }, [decks, saveDecks]);

  const updateDeck = useCallback(async (deckId: string, name: string, description: string) => {
    try {
      const updatedDecks = decks.map(deck => 
        deck.id === deckId 
          ? { ...deck, name, description }
          : deck
      );
      await saveDecks(updatedDecks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deck');
      throw err;
    }
  }, [decks, saveDecks]);

  const deleteDeck = useCallback(async (deckId: string) => {
    try {
      // Remove all flashcards from this deck
      const updatedFlashcards = flashcards.filter(card => card.deckId !== deckId);
      
      // Remove the deck
      const updatedDecks = decks.filter(deck => deck.id !== deckId);
      
      // Save both updates
      await Promise.all([
        dataService.saveFlashcards(updatedFlashcards),
        dataService.saveDecks(updatedDecks)
      ]);
      
      setFlashcards(updatedFlashcards);
      setDecks(updatedDecks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete deck');
      throw err;
    }
  }, [decks, flashcards]);

  // Flashcard operations
  const saveFlashcards = useCallback(async (newFlashcards: FlashcardData[]) => {
    try {
      await dataService.saveFlashcards(newFlashcards);
      setFlashcards(newFlashcards);
      updateDeckCardCounts(newFlashcards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save flashcards');
      throw err;
    }
  }, [updateDeckCardCounts]);

  const createFlashcard = useCallback(async (deckId: string, front: string, back: string) => {
    try {
      const newCard: FlashcardData = {
        id: crypto.randomUUID(),
        front,
        back,
        created: new Date(),
        deckId,
      };
      
      const updatedFlashcards = [...flashcards, newCard];
      await saveFlashcards(updatedFlashcards);
      return newCard;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create flashcard');
      throw err;
    }
  }, [flashcards, saveFlashcards]);

  const updateFlashcard = useCallback(async (cardId: string, front: string, back: string) => {
    try {
      const updatedFlashcards = flashcards.map(card => 
        card.id === cardId 
          ? { ...card, front, back }
          : card
      );
      await saveFlashcards(updatedFlashcards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update flashcard');
      throw err;
    }
  }, [flashcards, saveFlashcards]);

  const deleteFlashcard = useCallback(async (cardId: string) => {
    try {
      const updatedFlashcards = flashcards.filter(card => card.id !== cardId);
      await saveFlashcards(updatedFlashcards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete flashcard');
      throw err;
    }
  }, [flashcards, saveFlashcards]);

  // Utility functions
  const getFlashcardsForDeck = useCallback((deckId: string) => {
    return flashcards.filter(card => card.deckId === deckId);
  }, [flashcards]);

  const exportData = useCallback(async () => {
    try {
      return await dataService.exportAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      throw err;
    }
  }, []);

  const importData = useCallback(async (data: { decks: Deck[]; flashcards: FlashcardData[] }) => {
    try {
      await dataService.importAllData({ ...data, sessions: [] });
      
      // Reload data after import
      const [loadedDecks, loadedFlashcards] = await Promise.all([
        dataService.loadDecks(),
        dataService.loadFlashcards()
      ]);

      const updatedDecks = loadedDecks.map(deck => ({
        ...deck,
        cardCount: loadedFlashcards.filter(card => card.deckId === deck.id).length
      }));

      setDecks(updatedDecks);
      setFlashcards(loadedFlashcards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
      throw err;
    }
  }, []);

  const clearAllData = useCallback(async () => {
    try {
      await dataService.clearAllData();
      setDecks([]);
      setFlashcards([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data');
      throw err;
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    decks,
    flashcards,
    isLoading,
    error,

    // Deck operations
    createDeck,
    updateDeck,
    deleteDeck,

    // Flashcard operations
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardsForDeck,

    // Utility operations
    exportData,
    importData,
    clearAllData,
    clearError,
  };
} 