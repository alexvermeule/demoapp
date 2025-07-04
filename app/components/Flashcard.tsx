'use client';

import { useState } from 'react';

interface FlashcardProps {
  id: string;
  front: string;
  back: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function Flashcard({ id, front, back, onEdit, onDelete }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Card Container */}
      <div 
        className="relative h-64 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div 
          className={`absolute inset-0 w-full h-full transition-transform duration-700 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="w-full h-full bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="flex-1 flex items-center justify-center p-6">
                <p className="text-lg text-gray-800 text-center leading-relaxed">
                  {front}
                </p>
              </div>
              <div className="border-t border-gray-100 px-4 py-2">
                <p className="text-xs text-gray-500 text-center">
                  Click to reveal answer
                </p>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-blue-50 border-2 border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="flex-1 flex items-center justify-center p-6">
                <p className="text-lg text-gray-800 text-center leading-relaxed">
                  {back}
                </p>
              </div>
              <div className="border-t border-blue-100 px-4 py-2">
                <p className="text-xs text-blue-600 text-center">
                  Click to show question
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2 mt-4">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors duration-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
} 