import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Users, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import { TravelPreferences, TravelPlan } from '../types/travel';
import { geminiAgent } from '../services/geminiService';

interface PlanningFormProps {
  onItineraryGenerated: (itinerary: TravelPlan) => void;
  onBackToHome: () => void;
  onSwitchToNaturalLanguage: () => void;
}

const PlanningForm: React.FC<PlanningFormProps> = ({ 
  onItineraryGenerated, 
  onBackToHome, 
  onSwitchToNaturalLanguage 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState<TravelPreferences>({
    destination: '',
    duration: 3,
    budget: 'mid-range',
    interests: [],
    travelStyle: 'moderate',
    groupSize: 2,
    accommodation: 'hotel'
  });

  const interestOptions = [
    'Culture & History', 'Adventure & Sports', 'Food & Dining', 'Nature & Wildlife',
    'Art & Museums', 'Nightlife', 'Shopping', 'Photography', 'Beach & Water Sports',
    'Local Experiences', 'Wellness & Spa', 'Architecture', 'Religious Sites', 'Markets & Bazaars'
  ];

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences.destination.trim()) return;

    setIsGenerating(true);
    try {
      const itinerary = await geminiAgent.generateItinerary(preferences);
      onItineraryGenerated(itinerary);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert('Failed to generate itinerary. Please check your internet connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Plan Your Perfect Trip</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Fill out your travel preferences or try our natural language planner for a more conversational experience.
            </p>
            
            <button
              onClick={onSwitchToNaturalLanguage}
              className="mt-4 inline-flex items-center space-x-2 text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Try Natural Language Planning Instead</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Destination */}
          <div>
            <label className="flex items-center space-x-2 text-lg font-semibold text-slate-800 mb-4">
              <MapPin className="h-5 w-5 text-sky-500" />
              <span>Where would you like to go?</span>
            </label>
            <input
              type="text"
              value={preferences.destination}
              onChange={(e) => setPreferences(prev => ({ ...prev, destination: e.target.value }))}
              placeholder="e.g., Tokyo, Japan or Paris, France"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Duration and Group Size */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-slate-800 mb-4">
                <Calendar className="h-5 w-5 text-emerald-500" />
                <span>Start Date (Optional)</span>
              </label>
              <input
                type="date"
                value={preferences.startDate || ''}
                onChange={(e) => setPreferences(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-slate-800 mb-4">
                <Calendar className="h-5 w-5 text-emerald-500" />
                <span>Trip Duration</span>
              </label>
              <select
                value={preferences.duration}
                onChange={(e) => setPreferences(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              >
                {[...Array(14)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i + 1 === 1 ? 'day' : 'days'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Group Size */}
          <div>
            <label className="flex items-center space-x-2 text-lg font-semibold text-slate-800 mb-4">
              <Users className="h-5 w-5 text-purple-500" />
              <span>Group Size</span>
            </label>
            <select
              value={preferences.groupSize}
              onChange={(e) => setPreferences(prev => ({ ...prev, groupSize: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
          </div>
          {/* Special Requests */}
          <div>
            <label className="text-lg font-semibold text-slate-800 mb-4 block">
              Special Requests or Preferences (Optional)
            </label>
            <textarea
              value={preferences.specificRequests || ''}
              onChange={(e) => setPreferences(prev => ({ ...prev, specificRequests: e.target.value }))}
              placeholder="e.g., vegetarian food options, accessible venues, romantic spots, family-friendly activities..."
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center space-x-2 text-lg font-semibold text-slate-800 mb-4">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span>Budget Range</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'budget', label: 'Budget', desc: 'Economical options' },
                { value: 'mid-range', label: 'Mid-Range', desc: 'Balanced comfort & cost' },
                { value: 'luxury', label: 'Luxury', desc: 'Premium experiences' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, budget: option.value as any }))}
                  className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                    preferences.budget === option.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm opacity-75">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="text-lg font-semibold text-slate-800 mb-4 block">Travel Style</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'relaxed', label: 'Relaxed', desc: 'Slow pace, plenty of rest' },
                { value: 'moderate', label: 'Moderate', desc: 'Balanced activities & downtime' },
                { value: 'packed', label: 'Packed', desc: 'Action-packed, see everything' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, travelStyle: option.value as any }))}
                  className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                    preferences.travelStyle === option.value
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm opacity-75">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-lg font-semibold text-slate-800 mb-4 block">
              What interests you? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    preferences.interests.includes(interest)
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Accommodation */}
          <div>
            <label className="text-lg font-semibold text-slate-800 mb-4 block">Preferred Accommodation</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'hostel', label: 'Hostel' },
                { value: 'hotel', label: 'Hotel' },
                { value: 'resort', label: 'Resort' },
                { value: 'airbnb', label: 'Airbnb' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, accommodation: option.value as any }))}
                  className={`p-3 border-2 rounded-lg text-center font-medium transition-all duration-200 ${
                    preferences.accommodation === option.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isGenerating || !preferences.destination.trim()}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Generating Your Perfect Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate My Itinerary</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanningForm;