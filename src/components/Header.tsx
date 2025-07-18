import React from 'react';
import { Plane, Home, Bookmark } from 'lucide-react';

interface HeaderProps {
  onBackToHome: () => void;
  currentView: 'home' | 'planning' | 'results';
  savedItinerariesCount: number;
}

const Header: React.FC<HeaderProps> = ({ onBackToHome, currentView, savedItinerariesCount }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer group transition-all duration-200 hover:scale-105"
            onClick={onBackToHome}
          >
            <div className="p-2 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-200">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">TravelAI</h1>
              <p className="text-xs text-slate-500">Intelligent Trip Planning</p>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            {currentView !== 'home' && (
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-1 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
              >
                <Home className="h-4 w-4" />
                <span className="text-sm font-medium">Home</span>
              </button>
            )}
            
            <div className="flex items-center space-x-1 px-3 py-2 text-slate-600 bg-slate-100 rounded-lg">
              <Bookmark className="h-4 w-4" />
              <span className="text-sm font-medium">{savedItinerariesCount} Saved</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;