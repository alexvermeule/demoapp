'use client';

import { useState } from 'react';

interface FlashcardFormProps {
  onSubmit: (front: string, back: string) => void;
  onCancel?: () => void;
  initialFront?: string;
  initialBack?: string;
  isEditing?: boolean;
}

export default function FlashcardForm({ 
  onSubmit, 
  onCancel, 
  initialFront = '', 
  initialBack = '', 
  isEditing = false 
}: FlashcardFormProps) {
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      onSubmit(front.trim(), back.trim());
      if (!isEditing) {
        setFront('');
        setBack('');
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-2">
            Question (Front)
          </label>
          <textarea
            id="front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Enter the question or prompt..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-2">
            Answer (Back)
          </label>
          <textarea
            id="back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Enter the answer..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {isEditing ? 'Update Card' : 'Add Card'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 