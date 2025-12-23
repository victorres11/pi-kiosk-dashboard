import axios from 'axios';
import { config } from '../config/dashboard.config';
import type { WeatherData, SportsData, Game, CryptoData, CryptoPrice, NetworkBandwidthData } from '../types';

// OpenWeatherMap API
const OPENWEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

export async function fetchWeatherData(): Promise<WeatherData> {
  const { city, state, country, units } = config.weather;
  const apiKey = config.openWeatherApiKey;

  if (!apiKey) {
    throw new Error('OpenWeatherMap API key not configured');
  }

  const location = `${city},${state},${country}`;

  // Fetch current weather
  const currentResponse = await axios.get(`${OPENWEATHER_BASE}/weather`, {
    params: {
      q: location,
      appid: apiKey,
      units,
    },
  });

  const { lat, lon } = currentResponse.data.coord;

  // Fetch forecast data (includes hourly and daily)
  const forecastResponse = await axios.get(`${OPENWEATHER_BASE}/forecast`, {
    params: {
      lat,
      lon,
      appid: apiKey,
      units,
    },
  });

  const current = currentResponse.data;
  const forecast = forecastResponse.data;

  // Process hourly data (next 24 hours, every 3 hours from API)
  const hourly = forecast.list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
  }));

  // Process daily data (group by day)
  const dailyMap = new Map<string, any>();
  forecast.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        temps: [],
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      });
    }
    dailyMap.get(date).temps.push(item.main.temp);
  });

  const daily = Array.from(dailyMap.entries())
    .slice(0, 5)
    .map(([dateStr, data]) => ({
      date: new Date(dateStr),
      high: Math.round(Math.max(...data.temps)),
      low: Math.round(Math.min(...data.temps)),
      description: data.description,
      icon: data.icon,
    }));

  return {
    current: {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      windSpeed: Math.round(current.wind.speed),
    },
    hourly,
    daily,
    location: `${city}, ${state}`,
    lastUpdated: new Date(),
  };
}

// ESPN API (unofficial, public endpoints)
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

export interface GolfLeader {
  id: string;
  name: string;
  position: string;
  score: string;
  thru: string;
  isAmateur: boolean;
}

export interface GolfTournament {
  id: string;
  name: string;
  status: 'scheduled' | 'in_progress' | 'final';
  leaders: GolfLeader[];
}

export interface SportsDataWithGolf extends SportsData {
  golf?: GolfTournament;
}

export async function fetchSportsData(): Promise<SportsDataWithGolf> {
  const games: Game[] = [];
  let golf: GolfTournament | undefined;

  try {
    // Fetch NFL scoreboard
    const nflResponse = await axios.get(
      `${ESPN_BASE}/football/nfl/scoreboard`,
      { params: { limit: 50 } }
    );

    const nflGames = parseESPNGames(nflResponse.data, 'football', 'NFL');
    games.push(...nflGames);
  } catch (err) {
    console.warn('Failed to fetch NFL data:', err);
  }

  try {
    // Fetch college football scoreboard
    const cfbResponse = await axios.get(
      `${ESPN_BASE}/football/college-football/scoreboard`,
      { params: { limit: 50 } }
    );

    const cfbGames = parseESPNGames(cfbResponse.data, 'football', 'CFB');
    games.push(...cfbGames);
  } catch (err) {
    console.warn('Failed to fetch college football data:', err);
  }

  try {
    // Fetch PGA golf leaderboard
    const golfResponse = await axios.get(
      'https://site.api.espn.com/apis/site/v2/sports/golf/leaderboard'
    );

    golf = parseESPNGolf(golfResponse.data);
  } catch (err) {
    console.warn('Failed to fetch golf data:', err);
  }

  // Sort games: in-progress first, then by start time
  games.sort((a, b) => {
    if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
    if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return {
    games: games.slice(0, 15), // Limit to 15 most relevant games
    golf,
    lastUpdated: new Date(),
  };
}

function parseESPNGolf(data: any): GolfTournament | undefined {
  if (!data.events || data.events.length === 0) return undefined;

  // Get the most recent/current event
  const event = data.events[0];
  const competition = event.competitions?.[0];

  if (!competition) return undefined;

  const statusState = event.status?.type?.state || 'pre';
  let status: GolfTournament['status'] = 'scheduled';
  if (statusState === 'in') status = 'in_progress';
  else if (statusState === 'post') status = 'final';

  // Get top 5 leaders
  const competitors = competition.competitors || [];
  const leaders: GolfLeader[] = competitors
    .slice(0, 5)
    .map((c: any) => ({
      id: c.athlete?.id || c.id,
      name: c.athlete?.displayName || 'Unknown',
      position: c.status?.position?.displayName || '-',
      score: c.score?.displayValue || 'E',
      thru: c.status?.thru === 18 ? 'F' : c.status?.displayThru || '-',
      isAmateur: c.amateur || false,
    }));

  return {
    id: event.id,
    name: event.shortName || event.name,
    status,
    leaders,
  };
}

function parseESPNGames(data: any, sport: 'football' | 'basketball', league: string): Game[] {
  if (!data.events) return [];

  return data.events.map((event: any) => {
    const competition = event.competitions[0];
    const homeCompetitor = competition.competitors.find((c: any) => c.homeAway === 'home');
    const awayCompetitor = competition.competitors.find((c: any) => c.homeAway === 'away');

    const status = competition.status.type.state;
    let gameStatus: Game['status'] = 'scheduled';
    if (status === 'in') gameStatus = 'in_progress';
    else if (status === 'post') gameStatus = 'final';

    return {
      id: event.id,
      sport,
      league,
      status: gameStatus,
      statusDetail: competition.status.type.shortDetail,
      homeTeam: {
        id: homeCompetitor.team.id,
        name: homeCompetitor.team.displayName || homeCompetitor.team.name,
        abbreviation: homeCompetitor.team.abbreviation,
        logo: homeCompetitor.team.logo,
        score: parseInt(homeCompetitor.score) || undefined,
        rank: homeCompetitor.curatedRank?.current,
      },
      awayTeam: {
        id: awayCompetitor.team.id,
        name: awayCompetitor.team.displayName || awayCompetitor.team.name,
        abbreviation: awayCompetitor.team.abbreviation,
        logo: awayCompetitor.team.logo,
        score: parseInt(awayCompetitor.score) || undefined,
        rank: awayCompetitor.curatedRank?.current,
      },
      startTime: new Date(event.date),
      venue: competition.venue?.fullName,
      broadcast: competition.broadcasts?.[0]?.names?.[0],
    };
  });
}

// Weather icon mapping to weather condition
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// CoinGecko API for crypto prices (free, no API key required)
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export async function fetchCryptoData(): Promise<CryptoData> {
  const cryptoIds = config.crypto.coins.map(c => c.id).join(',');

  const response = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
    params: {
      vs_currency: 'usd',
      ids: cryptoIds,
      order: 'market_cap_desc',
      sparkline: false,
      price_change_percentage: '24h',
    },
  });

  const prices: CryptoPrice[] = response.data.map((coin: any) => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    price: coin.current_price,
    change24h: coin.price_change_24h,
    changePercent24h: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    volume24h: coin.total_volume,
  }));

  // Sort to match the order in config
  const orderedPrices = config.crypto.coins
    .map(c => prices.find(p => p.id === c.id))
    .filter((p): p is CryptoPrice => p !== undefined);

  return {
    prices: orderedPrices,
    lastUpdated: new Date(),
  };
}

// Network Bandwidth API (local backend server)
export async function fetchNetworkBandwidth(): Promise<NetworkBandwidthData> {
  const response = await axios.get(`${config.network.apiUrl}/api/network/bandwidth`);
  return response.data;
}
