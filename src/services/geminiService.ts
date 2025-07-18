import { GoogleGenerativeAI } from '@google/generative-ai';
import { TravelPreferences, TravelPlan, NaturalLanguageQuery, GeminiResponse } from '../types/travel';

// Initialize Gemini AI (you'll need to add your API key to environment variables)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');

export class GeminiTravelAgent {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

  async parseNaturalLanguageQuery(query: string): Promise<NaturalLanguageQuery> {
    const prompt = `
    Parse this travel query and extract structured information:
    Query: "${query}"
    
    Extract and return JSON with:
    {
      "destination": "city/country",
      "duration": number_of_days,
      "startDate": "YYYY-MM-DD or null",
      "budget": "budget/mid-range/luxury or null",
      "interests": ["interest1", "interest2"],
      "groupSize": number_or_null,
      "specificRequests": ["request1", "request2"]
    }
    
    Only return valid JSON, no additional text.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const extractedInfo = JSON.parse(text);
      
      return {
        query,
        extractedInfo
      };
    } catch (error) {
      console.error('Error parsing natural language query:', error);
      return { query };
    }
  }

  async generateItinerary(preferences: TravelPreferences): Promise<TravelPlan> {
    const prompt = this.buildItineraryPrompt(preferences);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response from Gemini
      const geminiResponse = JSON.parse(text);
      
      return this.processGeminiResponse(geminiResponse, preferences);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw new Error('Failed to generate itinerary. Please try again.');
    }
  }

  private buildItineraryPrompt(preferences: TravelPreferences): string {
    return `
    Create a detailed travel itinerary for the following requirements:
    
    Destination: ${preferences.destination}
    Duration: ${preferences.duration} days
    Budget: ${preferences.budget}
    Group Size: ${preferences.groupSize} people
    Travel Style: ${preferences.travelStyle}
    Interests: ${preferences.interests.join(', ')}
    Accommodation: ${preferences.accommodation}
    ${preferences.startDate ? `Start Date: ${preferences.startDate}` : ''}
    ${preferences.specificRequests ? `Special Requests: ${preferences.specificRequests}` : ''}
    
    Please provide a comprehensive itinerary including:
    1. Day-by-day activities with specific timings
    2. Weather considerations and indoor/outdoor activity recommendations
    3. Local food recommendations and dining experiences
    4. Cultural attractions and sightseeing spots
    5. Cost estimates for each activity
    6. Travel tips and local insights
    7. Emergency information (hospitals, embassies, emergency contacts)
    8. Weather-appropriate activity suggestions
    
    For each location mentioned, try to include:
    - Exact location names and addresses
    - Estimated costs
    - Duration of visit
    - Best time to visit
    - Weather considerations (indoor/outdoor)
    
    Return the response in this exact JSON format:
    {
      "destination": "${preferences.destination}",
      "duration": ${preferences.duration},
      "totalBudget": estimated_total_cost,
      "weatherSummary": "general weather overview for the period",
      "travelTips": ["tip1", "tip2", "tip3"],
      "emergencyInfo": {
        "contacts": ["emergency_number1", "emergency_number2"],
        "hospitals": ["hospital1", "hospital2"],
        "embassies": ["embassy1", "embassy2"]
      },
      "days": [
        {
          "day": 1,
          "date": "formatted_date",
          "weather": {
            "temperature": {"min": temp_min, "max": temp_max},
            "condition": "weather_condition",
            "description": "weather_description",
            "humidity": humidity_percentage,
            "precipitation": precipitation_percentage,
            "recommendation": "weather_based_recommendation"
          },
          "activities": [
            {
              "id": "unique_id",
              "name": "activity_name",
              "description": "detailed_description",
              "duration": "time_duration",
              "category": "culture|adventure|dining|relaxation|sightseeing|shopping|nature",
              "estimatedCost": cost_per_person,
              "location": "specific_location",
              "timeSlot": "morning|afternoon|evening",
              "weatherConsideration": "indoor|outdoor|flexible",
              "rating": estimated_rating_out_of_5,
              "photos": ["photo_description1", "photo_description2"]
            }
          ],
          "totalCost": daily_total_cost,
          "notes": "daily_notes",
          "travelTips": ["daily_tip1", "daily_tip2"]
        }
      ]
    }
    
    Ensure all costs are realistic and in USD. Make sure activities are diverse and match the user's interests and travel style.
    `;
  }

  private processGeminiResponse(geminiResponse: any, preferences: TravelPreferences): TravelPlan {
    // Process and validate the Gemini response
    const processedPlan: TravelPlan = {
      id: Date.now().toString(),
      destination: geminiResponse.destination || preferences.destination,
      duration: geminiResponse.duration || preferences.duration,
      totalBudget: geminiResponse.totalBudget || 0,
      days: geminiResponse.days || [],
      preferences,
      createdAt: new Date().toISOString(),
      weatherSummary: geminiResponse.weatherSummary,
      travelTips: geminiResponse.travelTips || [],
      emergencyInfo: geminiResponse.emergencyInfo
    };

    // Ensure each day has proper structure
    processedPlan.days = processedPlan.days.map((day: any, index: number) => ({
      day: day.day || index + 1,
      date: day.date || this.formatDate(new Date(Date.now() + index * 24 * 60 * 60 * 1000)),
      weather: day.weather,
      activities: day.activities || [],
      notes: day.notes,
      totalCost: day.totalCost || 0,
      travelTips: day.travelTips || []
    }));

    return processedPlan;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async getWeatherForecast(destination: string, startDate: string, duration: number): Promise<any> {
    const prompt = `
    Provide a ${duration}-day weather forecast for ${destination} starting from ${startDate}.
    
    Return JSON format:
    {
      "location": "${destination}",
      "forecast": [
        {
          "date": "YYYY-MM-DD",
          "temperature": {"min": temp_min, "max": temp_max},
          "condition": "sunny|cloudy|rainy|snowy",
          "description": "detailed_description",
          "humidity": humidity_percentage,
          "precipitation": precipitation_percentage,
          "recommendation": "activity_recommendation_based_on_weather"
        }
      ]
    }
    
    Base the forecast on typical weather patterns for the location and season.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Error getting weather forecast:', error);
      return null;
    }
  }

  async getPlaceDetails(placeName: string, destination: string): Promise<any> {
    const prompt = `
    Provide detailed information about "${placeName}" in ${destination}.
    
    Return JSON format:
    {
      "name": "${placeName}",
      "description": "detailed_description",
      "location": "specific_address",
      "coordinates": {"lat": latitude, "lng": longitude},
      "rating": rating_out_of_5,
      "photos": ["photo_description1", "photo_description2"],
      "openingHours": "opening_hours",
      "entryFee": cost_in_usd,
      "bestTimeToVisit": "time_recommendation",
      "tips": ["tip1", "tip2"],
      "nearbyAttractions": ["attraction1", "attraction2"]
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }
}

export const geminiAgent = new GeminiTravelAgent();