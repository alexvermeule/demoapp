'use client';

import { useState } from 'react';
import Flashcard from './Flashcard';
import FlashcardForm from './FlashcardForm';

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  created: Date;
}

export default function FlashcardApp() {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardData | null>(null);

  const addFlashcard = (front: string, back: string) => {
    const newCard: FlashcardData = {
      id: crypto.randomUUID(),
      front,
      back,
      created: new Date(),
    };
    setFlashcards([...flashcards, newCard]);
    setShowForm(false);
  };

  const updateFlashcard = (front: string, back: string) => {
    if (editingCard) {
      setFlashcards(flashcards.map(card => 
        card.id === editingCard.id 
          ? { ...card, front, back }
          : card
      ));
      setEditingCard(null);
    }
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Flashcard Study App
          </h1>
          <p className="text-gray-600">
            Create and study flashcards to improve your learning
          </p>
        </div>

        {/* Add Card Button */}
        {!showForm && !editingCard && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm"
            >
              + Add New Flashcard
            </button>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Add New Flashcard
            </h2>
            <FlashcardForm
              onSubmit={addFlashcard}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Edit Form Section */}
        {editingCard && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Edit Flashcard
            </h2>
            <FlashcardForm
              onSubmit={updateFlashcard}
              onCancel={cancelEditing}
              initialFront={editingCard.front}
              initialBack={editingCard.back}
              isEditing={true}
            />
          </div>
        )}

        {/* Flashcards Grid */}
        {flashcards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcards.map((card) => (
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
              No flashcards yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first flashcard
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Create Your First Card
              </button>
            )}
          </div>
        )}

        {/* Stats */}
        {flashcards.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {flashcards.length} flashcard{flashcards.length !== 1 ? 's' : ''} created
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 