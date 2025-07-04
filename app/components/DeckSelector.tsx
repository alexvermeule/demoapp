'use client';

import { useState } from 'react';

interface Deck {
  id: string;
  name: string;
  description: string;
  created: Date;
  cardCount: number;
}

interface DeckSelectorProps {
  decks: Deck[];
  currentDeckId: string | null;
  onDeckSelect: (deckId: string) => void;
  onDeckCreate: (name: string, description: string) => void;
  onDeckEdit: (deckId: string, name: string, description: string) => void;
  onDeckDelete: (deckId: string) => void;
}

export default function DeckSelector({
  decks,
  currentDeckId,
  onDeckSelect,
  onDeckCreate,
  onDeckEdit,
  onDeckDelete,
}: DeckSelectorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');
  const [showActions, setShowActions] = useState(false);

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeckName.trim()) {
      onDeckCreate(newDeckName.trim(), newDeckDescription.trim());
      setNewDeckName('');
      setNewDeckDescription('');
      setShowCreateForm(false);
    }
  };

  const handleEditDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeck && newDeckName.trim()) {
      onDeckEdit(editingDeck.id, newDeckName.trim(), newDeckDescription.trim());
      setEditingDeck(null);
      setNewDeckName('');
      setNewDeckDescription('');
    }
  };

  const startEditing = (deck: Deck) => {
    setEditingDeck(deck);
    setNewDeckName(deck.name);
    setNewDeckDescription(deck.description);
    setShowCreateForm(false);
    setShowActions(false);
  };

  const cancelEditing = () => {
    setEditingDeck(null);
    setNewDeckName('');
    setNewDeckDescription('');
  };

  const currentDeck = decks.find(deck => deck.id === currentDeckId);
  const totalCards = decks.reduce((sum, deck) => sum + deck.cardCount, 0);

  return (
    <div className="bg-white">
      {/* Current Deck Bar - Similar to AnkiWeb */}
      {currentDeck && (
        <div className="bg-blue-50 border-l-4 border-blue-400 px-6 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-blue-900">{currentDeck.name}</h2>
              {currentDeck.description && (
                <p className="text-sm text-blue-700 mt-1">{currentDeck.description}</p>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 rounded border border-blue-300 hover:border-blue-400 transition-colors duration-200"
              >
                Actions ▼
              </button>
              {showActions && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={() => startEditing(currentDeck)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDeckDelete(currentDeck.id);
                      setShowActions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Collection Stats */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          Collection: <span className="text-blue-600 font-medium">{totalCards} cards</span> • 
          <span className="text-blue-600 font-medium"> {decks.length} deck{decks.length !== 1 ? 's' : ''}</span>
        </p>
      </div>

      {/* Action Buttons - AnkiWeb Style */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Create Deck
        </button>
        <button className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
          Import Deck
        </button>
        <button className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
          Browse Decks
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="max-w-md mx-auto mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Deck</h3>
          <form onSubmit={handleCreateDeck} className="space-y-4">
            <div>
              <label htmlFor="deck-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="deck-name"
                type="text"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                placeholder="e.g., Spanish Vocabulary"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="deck-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <input
                id="deck-description"
                type="text"
                value={newDeckDescription}
                onChange={(e) => setNewDeckDescription(e.target.value)}
                placeholder="Brief description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingDeck && (
        <div className="max-w-md mx-auto mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Deck</h3>
          <form onSubmit={handleEditDeck} className="space-y-4">
            <div>
              <label htmlFor="edit-deck-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="edit-deck-name"
                type="text"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="edit-deck-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <input
                id="edit-deck-description"
                type="text"
                value={newDeckDescription}
                onChange={(e) => setNewDeckDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Update
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deck List - Clean Table Style */}
      {decks.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deck
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cards
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {decks.map((deck) => (
                  <tr
                    key={deck.id}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                      deck.id === currentDeckId ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => onDeckSelect(deck.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{deck.name}</div>
                        {deck.description && (
                          <div className="text-sm text-gray-500">{deck.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deck.cardCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deck.created.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {decks.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No decks yet</h3>
          <p className="text-gray-600 mb-4">Create your first deck to get started</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Create Your First Deck
          </button>
        </div>
      )}
    </div>
  );
} 