'use client';

import { useState } from 'react';
import Flashcard from './Flashcard';
import FlashcardForm from './FlashcardForm';
import DeckSelector from './DeckSelector';
import Header from './Header';
import { useDataService } from '../hooks/useDataService';
import { FlashcardData } from '../services/DataService';

export default function FlashcardApp() {
  const {
    decks,
    flashcards,
    isLoading,
    error,
    createDeck,
    updateDeck,
    deleteDeck,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardsForDeck,
    clearError,
  } = useDataService();

  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'decks' | 'add' | 'search'>('decks');
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardData | null>(null);

  // Get flashcards for current deck
  const currentDeckFlashcards = getFlashcardsForDeck(currentDeckId || '');

  // Deck management functions
  const handleCreateDeck = async (name: string, description: string) => {
    try {
      const newDeck = await createDeck(name, description);
      setCurrentDeckId(newDeck.id);
    } catch (error) {
      console.error('Error creating deck:', error);
    }
  };

  const handleEditDeck = async (deckId: string, name: string, description: string) => {
    try {
      await updateDeck(deckId, name, description);
    } catch (error) {
      console.error('Error updating deck:', error);
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    try {
      await deleteDeck(deckId);
      // If this was the current deck, clear selection
      if (currentDeckId === deckId) {
        setCurrentDeckId(null);
      }
    } catch (error) {
      console.error('Error deleting deck:', error);
    }
  };

  const selectDeck = (deckId: string) => {
    setCurrentDeckId(deckId);
    setShowForm(false);
    setEditingCard(null);
  };

  // Flashcard management functions
  const handleAddFlashcard = async (front: string, back: string) => {
    if (!currentDeckId) return;
    
    try {
      await createFlashcard(currentDeckId, front, back);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  };

  const handleUpdateFlashcard = async (front: string, back: string) => {
    if (editingCard) {
      try {
        await updateFlashcard(editingCard.id, front, back);
        setEditingCard(null);
      } catch (error) {
        console.error('Error updating flashcard:', error);
      }
    }
  };

  const handleDeleteFlashcard = async (id: string) => {
    try {
      await deleteFlashcard(id);
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={clearError}
                  className="bg-red-100 px-2 py-1 text-xs font-medium text-red-800 rounded hover:bg-red-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              onDeckCreate={handleCreateDeck}
              onDeckEdit={handleEditDeck}
              onDeckDelete={handleDeleteDeck}
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
                        onSubmit={handleUpdateFlashcard}
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
                        onDelete={handleDeleteFlashcard}
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
                  onSubmit={handleAddFlashcard}
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