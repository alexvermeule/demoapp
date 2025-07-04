'use client';

interface HeaderProps {
  currentView: 'decks' | 'add' | 'search';
  onViewChange: (view: 'decks' | 'add' | 'search') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="text-2xl font-bold text-blue-600 mr-2">📚</div>
              <h1 className="text-xl font-semibold text-gray-900">FlashCards</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <button
              onClick={() => onViewChange('decks')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                currentView === 'decks'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Decks
            </button>
            <button
              onClick={() => onViewChange('add')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                currentView === 'add'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Add
            </button>
            <button
              onClick={() => onViewChange('search')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                currentView === 'search'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Search
            </button>
          </nav>

          {/* Account Section */}
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Account
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
              Settings
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 