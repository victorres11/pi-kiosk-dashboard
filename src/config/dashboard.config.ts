// Dashboard configuration
// These can be overridden by environment variables

export const config = {
  // API Keys
  openWeatherApiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '',

  // Location settings
  weather: {
    city: import.meta.env.VITE_WEATHER_CITY || 'Scottsdale',
    state: import.meta.env.VITE_WEATHER_STATE || 'AZ',
    country: import.meta.env.VITE_WEATHER_COUNTRY || 'US',
    units: 'imperial' as const, // 'imperial' for Fahrenheit, 'metric' for Celsius
  },

  // Refresh intervals (in milliseconds)
  refreshIntervals: {
    weather: (parseInt(import.meta.env.VITE_WEATHER_REFRESH_INTERVAL || '10') * 60 * 1000),
    sports: (parseInt(import.meta.env.VITE_SPORTS_REFRESH_INTERVAL || '5') * 60 * 1000),
    news: (parseInt(import.meta.env.VITE_NEWS_REFRESH_INTERVAL || '15') * 60 * 1000),
    crypto: (parseInt(import.meta.env.VITE_CRYPTO_REFRESH_INTERVAL || '2') * 60 * 1000),
    clock: 1000, // Update clock every second
  },

  // Crypto settings
  crypto: {
    coins: [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
      { id: 'ripple', symbol: 'XRP', name: 'XRP' },
      { id: 'fartcoin', symbol: 'FARTCOIN', name: 'Fartcoin' },
    ],
    rotationInterval: 10000, // Rotate between weather and crypto every 10 seconds
  },

  // Widget visibility
  widgets: {
    weather: import.meta.env.VITE_SHOW_WEATHER !== 'false',
    sports: import.meta.env.VITE_SHOW_SPORTS !== 'false',
    clock: import.meta.env.VITE_SHOW_CLOCK !== 'false',
    news: import.meta.env.VITE_SHOW_NEWS !== 'false',
    calendar: import.meta.env.VITE_SHOW_CALENDAR !== 'false',
  },

  // Sports teams to follow (ESPN team IDs)
  // You can customize these based on your preferences
  sportsTeams: {
    collegefootball: [
      { id: '333', name: 'Alabama' },
      { id: '52', name: 'Florida State' },
      { id: '251', name: 'Arizona State' },
      { id: '12', name: 'Arizona' },
      { id: '99', name: 'USC' },
      { id: '127', name: 'Michigan' },
      { id: '194', name: 'Ohio State' },
      { id: '61', name: 'Georgia' },
    ],
    collegebasketball: [
      { id: '12', name: 'Arizona' },
      { id: '150', name: 'Duke' },
      { id: '2305', name: 'Kentucky' },
      { id: '97', name: 'North Carolina' },
      { id: '2250', name: 'Kansas' },
      { id: '130', name: 'Michigan' },
    ],
  },
};

export type Config = typeof config;
