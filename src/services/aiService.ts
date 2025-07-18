import { TravelPreferences, TravelPlan, DayPlan, Activity } from '../types/travel';

// Simulated AI service - in a real app, this would call an actual AI API
export const generateItinerary = async (preferences: TravelPreferences): Promise<TravelPlan> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Sample activities based on destination and interests
  const activityPool: Partial<Record<string, Activity[]>> = {
    'tokyo': [
      {
        id: '1',
        name: 'Visit Senso-ji Temple',
        description: 'Explore Tokyo\'s oldest temple in the historic Asakusa district',
        duration: '2 hours',
        category: 'culture',
        estimatedCost: 0,
        location: 'Asakusa',
        timeSlot: 'morning'
      },
      {
        id: '2',
        name: 'Tsukiji Outer Market Food Tour',
        description: 'Experience the world\'s largest fish market and enjoy fresh sushi',
        duration: '3 hours',
        category: 'dining',
        estimatedCost: 45,
        location: 'Tsukiji',
        timeSlot: 'morning'
      },
      {
        id: '3',
        name: 'Tokyo Skytree Observatory',
        description: 'Panoramic views of Tokyo from 634 meters high',
        duration: '2 hours',
        category: 'sightseeing',
        estimatedCost: 25,
        location: 'Sumida',
        timeSlot: 'afternoon'
      },
      {
        id: '4',
        name: 'Shibuya Crossing Experience',
        description: 'Experience the world\'s busiest pedestrian crossing',
        duration: '1 hour',
        category: 'sightseeing',
        estimatedCost: 0,
        location: 'Shibuya',
        timeSlot: 'evening'
      },
      {
        id: '5',
        name: 'Traditional Onsen Visit',
        description: 'Relax in natural hot springs for authentic Japanese wellness',
        duration: '3 hours',
        category: 'relaxation',
        estimatedCost: 35,
        location: 'Hakone',
        timeSlot: 'afternoon'
      },
      {
        id: '6',
        name: 'Meiji Shrine Visit',
        description: 'Peaceful shrine dedicated to Emperor Meiji and Empress Shoken',
        duration: '1.5 hours',
        category: 'culture',
        estimatedCost: 0,
        location: 'Harajuku',
        timeSlot: 'morning'
      }
    ],
    'paris': [
      {
        id: '7',
        name: 'Eiffel Tower Ascent',
        description: 'Iconic tower visit with breathtaking views of Paris',
        duration: '2 hours',
        category: 'sightseeing',
        estimatedCost: 35,
        location: 'Champ de Mars',
        timeSlot: 'afternoon'
      },
      {
        id: '8',
        name: 'Louvre Museum Tour',
        description: 'World\'s largest art museum featuring the Mona Lisa',
        duration: '4 hours',
        category: 'culture',
        estimatedCost: 20,
        location: 'Louvre',
        timeSlot: 'morning'
      },
      {
        id: '9',
        name: 'Seine River Cruise',
        description: 'Romantic boat cruise along the Seine with city views',
        duration: '1.5 hours',
        category: 'relaxation',
        estimatedCost: 25,
        location: 'Seine River',
        timeSlot: 'evening'
      },
      {
        id: '10',
        name: 'French Cooking Class',
        description: 'Learn to cook classic French dishes with a local chef',
        duration: '3 hours',
        category: 'dining',
        estimatedCost: 85,
        location: 'Le Marais',
        timeSlot: 'afternoon'
      },
      {
        id: '11',
        name: 'Montmartre Walking Tour',
        description: 'Explore the artistic bohemian quarter and Sacré-Cœur',
        duration: '3 hours',
        category: 'culture',
        estimatedCost: 15,
        location: 'Montmartre',
        timeSlot: 'morning'
      },
      {
        id: '12',
        name: 'Versailles Palace Day Trip',
        description: 'Visit the opulent palace and gardens of French royalty',
        duration: '6 hours',
        category: 'culture',
        estimatedCost: 45,
        location: 'Versailles',
        timeSlot: 'morning'
      }
    ]
  };

  // Get activities for destination (fallback to generic activities)
  const destinationKey = preferences.destination.toLowerCase().split(',')[0].trim();
  const availableActivities = activityPool[destinationKey] || [
    {
      id: 'generic1',
      name: 'City Walking Tour',
      description: 'Explore the main attractions and historical sites',
      duration: '3 hours',
      category: 'culture',
      estimatedCost: 25,
      location: 'City Center',
      timeSlot: 'morning'
    },
    {
      id: 'generic2',
      name: 'Local Food Experience',
      description: 'Taste authentic local cuisine and specialties',
      duration: '2 hours',
      category: 'dining',
      estimatedCost: 40,
      location: 'Food District',
      timeSlot: 'afternoon'
    },
    {
      id: 'generic3',
      name: 'Sunset Viewpoint',
      description: 'Watch the sunset from the best viewpoint in the city',
      duration: '1.5 hours',
      category: 'sightseeing',
      estimatedCost: 0,
      location: 'Viewpoint',
      timeSlot: 'evening'
    },
    {
      id: 'generic4',
      name: 'Museum Visit',
      description: 'Discover local art, history, and culture',
      duration: '2.5 hours',
      category: 'culture',
      estimatedCost: 15,
      location: 'Museum District',
      timeSlot: 'afternoon'
    }
  ];

  // Generate days
  const days: DayPlan[] = [];
  const today = new Date();
  
  for (let i = 0; i < preferences.duration; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Select activities based on travel style
    const activitiesPerDay = preferences.travelStyle === 'relaxed' ? 2 : 
                           preferences.travelStyle === 'moderate' ? 3 : 4;
    
    const dayActivities = availableActivities
      .slice(0, Math.min(activitiesPerDay, availableActivities.length))
      .map((activity, index) => ({
        ...activity,
        id: `${activity.id}-day${i}-${index}`
      }));

    days.push({
      day: i + 1,
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      activities: dayActivities,
      notes: i === 0 ? 'Welcome to your adventure! Take time to settle in and explore your accommodation area.' : undefined
    });
  }

  // Calculate total budget
  const totalBudget = days.reduce((total, day) => 
    total + day.activities.reduce((dayTotal, activity) => 
      dayTotal + activity.estimatedCost, 0
    ), 0
  ) * preferences.groupSize;

  return {
    destination: preferences.destination,
    duration: preferences.duration,
    totalBudget,
    days,
    preferences,
    createdAt: new Date().toISOString()
  };
};