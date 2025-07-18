import React from 'react';
import { MapPin, Clock, Users, Sparkles, MessageSquare, Settings } from 'lucide-react';

interface HeroProps {
  onStartPlanning: () => void;
  onStartNaturalLanguagePlanning: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartPlanning, onStartNaturalLanguagePlanning }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-800/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-white text-sm font-medium">AI-Powered Travel Planning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Plan Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                Adventure
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed max-w-3xl mx-auto">
              Experience the power of Gemini AI to create personalized travel itineraries. Choose your preferred planning method below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartNaturalLanguagePlanning}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-lg">Chat with AI Planner</span>
              <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
            </button>
            
            <button
              onClick={onStartPlanning}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <Settings className="h-5 w-5" />
              <span className="text-lg">Detailed Form Planning</span>
              <MapPin className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Natural Language</h3>
              <p className="text-slate-300 text-sm">Simply describe your trip in plain English and let AI do the rest</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Weather-Smart</h3>
              <p className="text-slate-300 text-sm">AI considers weather patterns to suggest perfect activities</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Export & Share</h3>
              <p className="text-slate-300 text-sm">Download PDF itineraries and share your plans easily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;