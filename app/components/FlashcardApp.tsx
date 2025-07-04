'use client';

import { useState } from 'react';
import Flashcard from './Flashcard';
import FlashcardForm from './FlashcardForm';
import DeckSelector from './DeckSelector';
import Header from './Header';

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  created: Date;
  deckId: string;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  created: Date;
  cardCount: number;
}

export default function FlashcardApp() {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'decks' | 'add' | 'search'>('decks');
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardData | null>(null);

  // Get flashcards for current deck
  const currentDeckFlashcards = flashcards.filter(card => card.deckId === currentDeckId);

  // Update deck card counts
  const updateDeckCardCounts = (updatedFlashcards: FlashcardData[]) => {
    setDecks(prevDecks => 
      prevDecks.map(deck => ({
        ...deck,
        cardCount: updatedFlashcards.filter(card => card.deckId === deck.id).length
      }))
    );
  };

  // Deck management functions
  const createDeck = (name: string, description: string) => {
    const newDeck: Deck = {
      id: crypto.randomUUID(),
      name,
      description,
      created: new Date(),
      cardCount: 0,
    };
    setDecks([...decks, newDeck]);
    setCurrentDeckId(newDeck.id);
  };

  const editDeck = (deckId: string, name: string, description: string) => {
    setDecks(decks.map(deck => 
      deck.id === deckId 
        ? { ...deck, name, description }
        : deck
    ));
  };

  const deleteDeck = (deckId: string) => {
    // Remove all flashcards from this deck
    const updatedFlashcards = flashcards.filter(card => card.deckId !== deckId);
    setFlashcards(updatedFlashcards);
    
    // Remove the deck
    setDecks(decks.filter(deck => deck.id !== deckId));
    
    // If this was the current deck, clear selection
    if (currentDeckId === deckId) {
      setCurrentDeckId(null);
    }
  };

  const selectDeck = (deckId: string) => {
    setCurrentDeckId(deckId);
    setShowForm(false);
    setEditingCard(null);
  };

  // Flashcard management functions
  const addFlashcard = (front: string, back: string) => {
    if (!currentDeckId) return;
    
    const newCard: FlashcardData = {
      id: crypto.randomUUID(),
      front,
      back,
      created: new Date(),
      deckId: currentDeckId,
    };
    const updatedFlashcards = [...flashcards, newCard];
    setFlashcards(updatedFlashcards);
    updateDeckCardCounts(updatedFlashcards);
    setShowForm(false);
  };

  const updateFlashcard = (front: string, back: string) => {
    if (editingCard) {
      const updatedFlashcards = flashcards.map(card => 
        card.id === editingCard.id 
          ? { ...card, front, back }
          : card
      );
      setFlashcards(updatedFlashcards);
      setEditingCard(null);
    }
  };

  const deleteFlashcard = (id: string) => {
    const updatedFlashcards = flashcards.filter(card => card.id !== id);
    setFlashcards(updatedFlashcards);
    updateDeckCardCounts(updatedFlashcards);
  };

  const startEditing = (id: string) => {
    const card = flashcards.find(card => card.id === id);
    if (card) {
      setEditingCard(card);
      setShowForm(false);
    }
  };

  const cancelEditing = () => {
    setEditingCard(null);
  };

  const handleViewChange = (view: 'decks' | 'add' | 'search') => {
    setCurrentView(view);
    if (view === 'add') {
      setShowForm(true);
      setEditingCard(null);
    } else {
      setShowForm(false);
      setEditingCard(null);
    }
  };

  const currentDeck = decks.find(deck => deck.id === currentDeckId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentView={currentView} onViewChange={handleViewChange} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'decks' && (
          <>
            {/* Deck Selector */}
            <DeckSelector
              decks={decks}
              currentDeckId={currentDeckId}
              onDeckSelect={selectDeck}
              onDeckCreate={createDeck}
              onDeckEdit={editDeck}
              onDeckDelete={deleteDeck}
            />

            {/* Flashcards Section - Only show if a deck is selected */}
            {currentDeckId && currentDeck && (
              <div className="mt-8">
                {/* Add Card Button */}
                {!showForm && !editingCard && (
                  <div className="text-center mb-8">
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      Add Flashcard
                    </button>
                  </div>
                )}

                {/* Edit Form Section */}
                {editingCard && (
                  <div className="mb-8">
                    <div className="max-w-md mx-auto">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                        Edit Flashcard
                      </h3>
                      <FlashcardForm
                        onSubmit={updateFlashcard}
                        onCancel={cancelEditing}
                        initialFront={editingCard.front}
                        initialBack={editingCard.back}
                        isEditing={true}
                      />
                    </div>
                  </div>
                )}

                {/* Flashcards Grid */}
                {currentDeckFlashcards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentDeckFlashcards.map((card) => (
                      <Flashcard
                        key={card.id}
                        id={card.id}
                        front={card.front}
                        back={card.back}
                        onEdit={startEditing}
                        onDelete={deleteFlashcard}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No flashcards in this deck yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add your first flashcard to {currentDeck.name}
                    </p>
                    {!showForm && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Add First Flashcard
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Add View */}
        {currentView === 'add' && (
          <div className="max-w-md mx-auto">
            {currentDeckId && currentDeck ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                  Add Flashcard to {currentDeck.name}
                </h2>
                <FlashcardForm
                  onSubmit={addFlashcard}
                  onCancel={() => setCurrentView('decks')}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select a Deck First</h2>
                <p className="text-gray-600 mb-6">You need to select a deck before adding flashcards.</p>
                <button
                  onClick={() => setCurrentView('decks')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Go to Decks
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search View */}
        {currentView === 'search' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Search Flashcards</h2>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search Coming Soon</h3>
              <p className="text-gray-600">Search functionality will be available in a future update.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 