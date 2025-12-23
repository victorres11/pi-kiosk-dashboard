// Weather Types
export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    description: string;
    icon: string;
    windSpeed: number;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: string;
  lastUpdated: Date;
}

export interface HourlyForecast {
  time: Date;
  temp: number;
  icon: string;
}

export interface DailyForecast {
  date: Date;
  high: number;
  low: number;
  description: string;
  icon: string;
}

// Sports Types
export interface SportsData {
  games: Game[];
  lastUpdated: Date;
}

export interface Game {
  id: string;
  sport: 'football' | 'basketball';
  league: string;
  status: 'scheduled' | 'in_progress' | 'final';
  statusDetail: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: Date;
  venue?: string;
  broadcast?: string;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  logo?: string;
  score?: number;
  rank?: number;
}

// Widget Common Types
export interface WidgetProps {
  className?: string;
}

export interface WidgetState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// News Types (placeholder)
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: Date;
}

// Calendar Types (placeholder)
export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  allDay: boolean;
}

// Crypto Types
export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
}

export interface CryptoData {
  prices: CryptoPrice[];
  lastUpdated: Date;
}
