import React from 'react';
import { ArrowLeft, Save, Calendar, MapPin, Clock, DollarSign, Star, Download, Share2, Cloud, Thermometer } from 'lucide-react';
import { TravelPlan, Activity } from '../types/travel';
import { pdfService } from '../services/pdfService';

interface ItineraryResultsProps {
  itinerary: TravelPlan;
  onSaveItinerary: (itinerary: TravelPlan) => void;
  onBackToPlanning: () => void;
  onBackToHome: () => void;
}

const ItineraryResults: React.FC<ItineraryResultsProps> = ({
  itinerary,
  onSaveItinerary,
  onBackToPlanning,
  onBackToHome
}) => {
  const handlePDFExport = async () => {
    try {
      await pdfService.exportItineraryToPDF(itinerary);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Travel Itinerary: ${itinerary.destination}`,
          text: `Check out my ${itinerary.duration}-day trip to ${itinerary.destination}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getCategoryColor = (category: Activity['category']) => {
    const colors = {
      culture: 'bg-purple-100 text-purple-700 border-purple-200',
      adventure: 'bg-green-100 text-green-700 border-green-200',
      dining: 'bg-orange-100 text-orange-700 border-orange-200',
      relaxation: 'bg-blue-100 text-blue-700 border-blue-200',
      sightseeing: 'bg-pink-100 text-pink-700 border-pink-200',
      shopping: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      nature: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getTimeSlotIcon = (timeSlot: Activity['timeSlot']) => {
    const timeSlots = {
      morning: '🌅',
      afternoon: '☀️',
      evening: '🌅'
    };
    return timeSlots[timeSlot] || '⏰';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" id="itinerary-content">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <button
              onClick={onBackToPlanning}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Planning</span>
            </button>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSaveItinerary(itinerary)}
                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              
              <button
                onClick={handlePDFExport}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span>PDF</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Your Perfect Trip to {itinerary.destination}
            </h1>
            <p className="text-lg text-slate-600">
              AI-generated itinerary tailored to your preferences
            </p>
          </div>
        </div>

        {/* Trip Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8" id="trip-overview">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Trip Overview</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <MapPin className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Destination</p>
                <p className="font-semibold text-slate-800">{itinerary.destination}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Duration</p>
                <p className="font-semibold text-slate-800">{itinerary.duration} days</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Estimated Budget</p>
                <p className="font-semibold text-slate-800">${itinerary.totalBudget}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Travel Style</p>
                <p className="font-semibold text-slate-800 capitalize">{itinerary.preferences.travelStyle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Summary */}
        {itinerary.weatherSummary && (
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Cloud className="h-6 w-6 text-sky-600" />
              <h2 className="text-2xl font-bold text-slate-800">Weather Overview</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">{itinerary.weatherSummary}</p>
          </div>
        )}

        {/* Travel Tips */}
        {itinerary.travelTips && itinerary.travelTips.length > 0 && (
          <div className="bg-amber-50 rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Essential Travel Tips</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {itinerary.travelTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-800 text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-slate-700 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Itinerary */}
        <div className="space-y-8">
          {itinerary.days.map((day) => (
            <div key={day.day} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">Day {day.day}</h3>
                <p className="text-sky-100">{day.date}</p>
                {day.weather && (
                  <div className="flex items-center space-x-4 mt-2 text-sky-100">
                    <div className="flex items-center space-x-1">
                      <Thermometer className="h-4 w-4" />
                      <span className="text-sm">{day.weather.temperature.min}° - {day.weather.temperature.max}°C</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Cloud className="h-4 w-4" />
                      <span className="text-sm capitalize">{day.weather.condition}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {day.weather?.recommendation && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Weather Tip:</strong> {day.weather.recommendation}
                    </p>
                  </div>
                )}
                
                {day.travelTips && day.travelTips.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Daily Tips:</h4>
                    <ul className="space-y-1">
                      {day.travelTips.map((tip, index) => (
                        <li key={index} className="text-green-700 text-sm">• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="space-y-4">
                  {day.activities.map((activity) => (
                    <div key={activity.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg">{getTimeSlotIcon(activity.timeSlot)}</span>
                            <h4 className="text-lg font-semibold text-slate-800">{activity.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(activity.category)}`}>
                              {activity.category}
                            </span>
                            {activity.weatherConsideration && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                activity.weatherConsideration === 'indoor' ? 'bg-gray-100 text-gray-700' :
                                activity.weatherConsideration === 'outdoor' ? 'bg-green-100 text-green-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {activity.weatherConsideration}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 mb-2">{activity.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{activity.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{activity.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>${activity.estimatedCost}</span>
                            </div>
                            {activity.rating && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{activity.rating}/5</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {day.notes && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800">{day.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Information */}
        {itinerary.emergencyInfo && (
          <div className="bg-red-50 rounded-2xl shadow-xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-red-800 mb-6">Emergency Information</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {itinerary.emergencyInfo.contacts && itinerary.emergencyInfo.contacts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">Emergency Contacts</h3>
                  <ul className="space-y-1">
                    {itinerary.emergencyInfo.contacts.map((contact, index) => (
                      <li key={index} className="text-red-600 text-sm">{contact}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {itinerary.emergencyInfo.hospitals && itinerary.emergencyInfo.hospitals.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">Hospitals</h3>
                  <ul className="space-y-1">
                    {itinerary.emergencyInfo.hospitals.map((hospital, index) => (
                      <li key={index} className="text-red-600 text-sm">{hospital}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {itinerary.emergencyInfo.embassies && itinerary.emergencyInfo.embassies.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">Embassies</h3>
                  <ul className="space-y-1">
                    {itinerary.emergencyInfo.embassies.map((embassy, index) => (
                      <li key={index} className="text-red-600 text-sm">{embassy}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={onBackToPlanning}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200"
          >
            Modify Trip
          </button>
          <button
            onClick={onBackToHome}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
          >
            Plan Another Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryResults;