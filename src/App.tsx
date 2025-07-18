import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PlanningForm from './components/PlanningForm';
import NaturalLanguageInput from './components/NaturalLanguageInput';
import ItineraryResults from './components/ItineraryResults';
import { TravelPlan } from './types/travel';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'planning' | 'natural-language' | 'results'>('home');
  const [currentItinerary, setCurrentItinerary] = useState<TravelPlan | null>(null);
  const [savedItineraries, setSavedItineraries] = useState<TravelPlan[]>([]);

  const handleStartPlanning = () => {
    setCurrentView('planning');
  };

  const handleStartNaturalLanguagePlanning = () => {
    setCurrentView('natural-language');
  };

  const handleItineraryGenerated = (itinerary: TravelPlan) => {
    setCurrentItinerary(itinerary);
    setCurrentView('results');
  };

  const handleSaveItinerary = (itinerary: TravelPlan) => {
    setSavedItineraries(prev => [...prev, { ...itinerary, id: Date.now().toString() }]);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentItinerary(null);
  };

  const handleBackToPlanning = () => {
    setCurrentView('planning');
  };

  const handleSwitchToNaturalLanguage = () => {
    setCurrentView('natural-language');
  };

  const handleSwitchToForm = () => {
    setCurrentView('planning');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        onBackToHome={handleBackToHome}
        currentView={currentView}
        savedItinerariesCount={savedItineraries.length}
      />
      
      {currentView === 'home' && (
        <Hero 
          onStartPlanning={handleStartPlanning}
          onStartNaturalLanguagePlanning={handleStartNaturalLanguagePlanning}
        />
      )}
      
      {currentView === 'planning' && (
        <PlanningForm 
          onItineraryGenerated={handleItineraryGenerated}
          onBackToHome={handleBackToHome}
          onSwitchToNaturalLanguage={handleSwitchToNaturalLanguage}
        />
      )}
      
      {currentView === 'natural-language' && (
        <NaturalLanguageInput 
          onItineraryGenerated={handleItineraryGenerated}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentView === 'results' && currentItinerary && (
        <ItineraryResults 
          itinerary={currentItinerary}
          onSaveItinerary={handleSaveItinerary}
          onBackToPlanning={handleBackToPlanning}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;