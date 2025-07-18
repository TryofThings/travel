import React, { useState } from 'react';
import { MessageCircle, Send, Sparkles, Loader } from 'lucide-react';
import { geminiAgent } from '../services/geminiService';
import { NaturalLanguageQuery, TravelPlan } from '../types/travel';

interface NaturalLanguageInputProps {
  onItineraryGenerated: (itinerary: TravelPlan) => void;
  onBackToHome: () => void;
}

const NaturalLanguageInput: React.FC<NaturalLanguageInputProps> = ({
  onItineraryGenerated,
  onBackToHome
}) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'ai';
    message: string;
    timestamp: Date;
  }>>([]);

  const exampleQueries = [
    "Plan a 5-day romantic trip to Paris in December for 2 people with a mid-range budget",
    "I want to explore Tokyo for 7 days, love food and culture, budget-friendly options",
    "Plan a 3-day adventure trip to Manali in March, interested in trekking and local cuisine",
    "Family trip to Goa for 4 days, 2 adults and 2 kids, beach activities and relaxation"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);
    
    // Add user message to chat
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: query,
      timestamp: new Date()
    }]);

    try {
      // Parse natural language query
      const parsedQuery: NaturalLanguageQuery = await geminiAgent.parseNaturalLanguageQuery(query);
      
      // Add AI processing message
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: 'I understand you want to plan a trip. Let me create a personalized itinerary for you...',
        timestamp: new Date()
      }]);

      // Convert parsed query to preferences
      const preferences = {
        destination: parsedQuery.extractedInfo?.destination || '',
        duration: parsedQuery.extractedInfo?.duration || 3,
        budget: (parsedQuery.extractedInfo?.budget as any) || 'mid-range',
        interests: parsedQuery.extractedInfo?.interests || [],
        travelStyle: 'moderate' as const,
        groupSize: parsedQuery.extractedInfo?.groupSize || 2,
        accommodation: 'hotel' as const,
        startDate: parsedQuery.extractedInfo?.startDate,
        specificRequests: parsedQuery.extractedInfo?.specificRequests?.join(', ')
      };

      // Generate itinerary
      const itinerary = await geminiAgent.generateItinerary(preferences);
      
      // Add success message
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: `Perfect! I've created a ${itinerary.duration}-day itinerary for ${itinerary.destination}. Your personalized travel plan is ready!`,
        timestamp: new Date()
      }]);

      // Pass itinerary to parent component
      onItineraryGenerated(itinerary);
      
    } catch (error) {
      console.error('Error processing query:', error);
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: 'I apologize, but I encountered an error while creating your itinerary. Please try again with a different query.',
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
      setQuery('');
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span className="text-sky-800 text-sm font-medium">AI-Powered Natural Language Planning</span>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Tell Me About Your Dream Trip
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Just describe your travel plans in natural language, and I'll create a personalized itinerary for you.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">AI Travel Assistant</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-sky-600" />
                </div>
                <p className="text-slate-600">Start a conversation by describing your travel plans!</p>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-sky-100' : 'text-slate-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing your request...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Plan a 5-day trip to Tokyo in December for 2 people..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={!query.trim() || isProcessing}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-1"
              >
                {isProcessing ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Example Queries */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Try these examples:</h3>
          <div className="grid gap-3">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left p-3 border border-slate-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-all duration-200 text-sm text-slate-700"
                disabled={isProcessing}
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={onBackToHome}
            className="text-slate-600 hover:text-slate-800 transition-colors duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageInput;