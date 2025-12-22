import axios from 'axios';
import { config } from '../config/dashboard.config';
import type { WeatherData, SportsData, Game } from '../types';

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

export async function fetchSportsData(): Promise<SportsData> {
  const games: Game[] = [];

  try {
    // Fetch college football scoreboard
    const footballResponse = await axios.get(
      `${ESPN_BASE}/football/college-football/scoreboard`,
      { params: { limit: 50 } }
    );

    const footballGames = parseESPNGames(footballResponse.data, 'football', 'NCAAF');
    games.push(...footballGames);
  } catch (err) {
    console.warn('Failed to fetch college football data:', err);
  }

  try {
    // Fetch college basketball scoreboard
    const basketballResponse = await axios.get(
      `${ESPN_BASE}/basketball/mens-college-basketball/scoreboard`,
      { params: { limit: 50 } }
    );

    const basketballGames = parseESPNGames(basketballResponse.data, 'basketball', 'NCAAM');
    games.push(...basketballGames);
  } catch (err) {
    console.warn('Failed to fetch college basketball data:', err);
  }

  // Sort games: in-progress first, then by start time
  games.sort((a, b) => {
    if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
    if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return {
    games: games.slice(0, 10), // Limit to 10 most relevant games
    lastUpdated: new Date(),
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
