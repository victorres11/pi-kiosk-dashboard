import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './CountdownWidget.css';

interface GameInfo {
  opponent: string;
  opponentAbbrev: string;
  date: Date;
  isHome: boolean;
  week: string;
  ninersRecord: string;
  opponentRecord: string;
  spread: string;
  overUnder: string;
  broadcast: string;
  venue: string;
  // Live game data
  isLive: boolean;
  isFinal: boolean;
  ninersScore?: number;
  opponentScore?: number;
  gameStatus?: string;
  possession?: 'niners' | 'opponent' | null;
}

// NFL team logos via ESPN CDN
const teamLogos: Record<string, string> = {
  '49ers': 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
  SF: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
  Colts: 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
  IND: 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
  Bears: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
  CHI: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
  Seahawks: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
  SEA: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
};

// Fallback schedule for when API fails
const fallbackSchedule: GameInfo[] = [
  {
    opponent: 'Colts',
    opponentAbbrev: 'IND',
    date: new Date('2025-12-22T17:15:00-08:00'),
    isHome: false,
    week: 'Week 16',
    ninersRecord: '6-9',
    opponentRecord: '7-8',
    spread: 'SF -3',
    overUnder: 'O/U 43.5',
    broadcast: 'ESPN/ABC',
    venue: 'Lucas Oil Stadium',
    isLive: false,
    isFinal: false,
  },
  {
    opponent: 'Bears',
    opponentAbbrev: 'CHI',
    date: new Date('2025-12-29T17:20:00-08:00'),
    isHome: true,
    week: 'Week 17',
    ninersRecord: '6-9',
    opponentRecord: '4-11',
    spread: 'TBD',
    overUnder: 'TBD',
    broadcast: 'NBC',
    venue: "Levi's Stadium",
    isLive: false,
    isFinal: false,
  },
];

const getNextGameFromSchedule = (): GameInfo | null => {
  const now = new Date();
  for (const game of fallbackSchedule) {
    // Include games that are in progress (started within last 4 hours)
    const gameEndEstimate = new Date(game.date.getTime() + 4 * 60 * 60 * 1000);
    if (gameEndEstimate > now) {
      return game;
    }
  }
  return null;
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const formatGameTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
};

const formatGameDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export function CountdownWidget() {
  const [nextGame, setNextGame] = useState<GameInfo | null>(getNextGameFromSchedule);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    nextGame ? calculateTimeLeft(nextGame.date) : { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  // Fetch live game data from ESPN Scoreboard API
  const fetchLiveGameData = useCallback(async () => {
    try {
      // Use scoreboard API for live game data
      const response = await axios.get(
        'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'
      );

      const events = response.data?.events || [];

      // Find the 49ers game
      const ninersGame = events.find((event: any) => {
        const competitors = event.competitions?.[0]?.competitors || [];
        return competitors.some((c: any) => c.team?.abbreviation === 'SF');
      });

      if (ninersGame) {
        const competition = ninersGame.competitions?.[0];
        if (!competition) {
          setNextGame(getNextGameFromSchedule());
          return;
        }

        const statusState = competition.status?.type?.state;
        const isLive = statusState === 'in';
        const isFinal = statusState === 'post';

        const ninersCompetitor = competition.competitors?.find(
          (c: any) => c.team?.abbreviation === 'SF'
        );
        const opponentCompetitor = competition.competitors?.find(
          (c: any) => c.team?.abbreviation !== 'SF'
        );

        if (!ninersCompetitor || !opponentCompetitor) {
          setNextGame(getNextGameFromSchedule());
          return;
        }

        // Get possession from situation object
        const possessionTeamId = competition.situation?.possession;
        const hasPossession = possessionTeamId === '25' ? 'niners' :
                             possessionTeamId ? 'opponent' : null;

        const gameInfo: GameInfo = {
          opponent: opponentCompetitor.team?.displayName || opponentCompetitor.team?.name || 'TBD',
          opponentAbbrev: opponentCompetitor.team?.abbreviation || 'TBD',
          date: new Date(ninersGame.date),
          isHome: ninersCompetitor.homeAway === 'home',
          week: ninersGame.week?.number ? `Week ${ninersGame.week.number}` : '',
          ninersRecord: ninersCompetitor.records?.[0]?.summary || '',
          opponentRecord: opponentCompetitor.records?.[0]?.summary || '',
          spread: 'TBD',
          overUnder: 'TBD',
          broadcast: competition.broadcast || competition.broadcasts?.[0]?.names?.join('/') || 'TBD',
          venue: competition.venue?.fullName || '',
          isLive,
          isFinal,
          ninersScore: isLive || isFinal ? parseInt(ninersCompetitor.score) || 0 : undefined,
          opponentScore: isLive || isFinal ? parseInt(opponentCompetitor.score) || 0 : undefined,
          gameStatus: competition.status?.type?.shortDetail || '',
          possession: hasPossession,
        };

        setNextGame(gameInfo);
        return;
      }

      // No 49ers game today, use fallback schedule
      setNextGame(getNextGameFromSchedule());
    } catch (err) {
      console.warn('Failed to fetch live game data, using fallback:', err);
      // Use fallback schedule on error
      setNextGame(getNextGameFromSchedule());
    }
  }, []);

  // Initial fetch and polling for live updates
  useEffect(() => {
    fetchLiveGameData();

    // Poll more frequently during game time (every 30 seconds), otherwise every 5 minutes
    const pollInterval = setInterval(() => {
      fetchLiveGameData();
    }, nextGame?.isLive ? 30000 : 300000);

    return () => clearInterval(pollInterval);
  }, [fetchLiveGameData, nextGame?.isLive]);

  useEffect(() => {
    if (!nextGame || nextGame.isLive || nextGame.isFinal) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(nextGame.date));
    }, 1000);

    return () => clearInterval(timer);
  }, [nextGame]);

  if (!nextGame) {
    return (
      <div className="countdown-widget">
        <div className="countdown-header">
          <img src={teamLogos['49ers']} alt="49ers" className="team-logo-img" />
          <span className="team-name">49ERS</span>
        </div>
        <div className="offseason-message">Season Complete</div>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const isGameActive = nextGame.isLive || nextGame.isFinal;

  return (
    <div className={`countdown-widget ${nextGame.isLive ? 'live' : ''} ${nextGame.isFinal ? 'final' : ''}`}>
      {/* Live indicator */}
      {nextGame.isLive && (
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">LIVE</span>
        </div>
      )}
      {nextGame.isFinal && (
        <div className="final-indicator">
          <span className="final-text">FINAL</span>
        </div>
      )}

      {/* Matchup header with logos and scores */}
      <div className="matchup-header">
        <div className={`team-block niners ${nextGame.possession === 'niners' ? 'has-possession' : ''}`}>
          <img src={teamLogos['49ers']} alt="49ers" className="team-logo-img" />
          {isGameActive ? (
            <span className={`team-score ${(nextGame.ninersScore || 0) > (nextGame.opponentScore || 0) ? 'winning' : ''}`}>
              {nextGame.ninersScore}
            </span>
          ) : (
            <span className="team-record">{nextGame.ninersRecord}</span>
          )}
        </div>

        <div className="vs-block">
          {isGameActive ? (
            <span className="game-status">{nextGame.gameStatus}</span>
          ) : (
            <>
              <span className="at-symbol">{nextGame.isHome ? 'VS' : '@'}</span>
              <span className="game-week-label">{nextGame.week}</span>
            </>
          )}
        </div>

        <div className={`team-block opponent ${nextGame.possession === 'opponent' ? 'has-possession' : ''}`}>
          <img src={teamLogos[nextGame.opponentAbbrev] || teamLogos[nextGame.opponent]} alt={nextGame.opponent} className="team-logo-img" />
          {isGameActive ? (
            <span className={`team-score ${(nextGame.opponentScore || 0) > (nextGame.ninersScore || 0) ? 'winning' : ''}`}>
              {nextGame.opponentScore}
            </span>
          ) : (
            <span className="team-record">{nextGame.opponentRecord}</span>
          )}
        </div>
      </div>

      {/* Game details */}
      <div className="game-details">
        <div className="detail-row">
          <span className="detail-item venue">{nextGame.venue}</span>
          <span className="detail-item broadcast">{nextGame.broadcast}</span>
        </div>
        {!isGameActive && (
          <div className="detail-row">
            <span className="detail-item date-time">
              {formatGameDate(nextGame.date)} • {formatGameTime(nextGame.date)}
            </span>
          </div>
        )}
      </div>

      {/* Betting line - only show before game */}
      {!isGameActive && (
        <div className="betting-info">
          <span className="spread">{nextGame.spread}</span>
          <span className="over-under">{nextGame.overUnder}</span>
        </div>
      )}

      {/* Countdown timer - only show before game */}
      {!isGameActive && (
        <div className="countdown-timer">
          <div className="time-unit">
            <span className="time-value">{formatNumber(timeLeft.days)}</span>
            <span className="time-label">DAYS</span>
          </div>
          <span className="time-separator">:</span>
          <div className="time-unit">
            <span className="time-value">{formatNumber(timeLeft.hours)}</span>
            <span className="time-label">HRS</span>
          </div>
          <span className="time-separator">:</span>
          <div className="time-unit">
            <span className="time-value">{formatNumber(timeLeft.minutes)}</span>
            <span className="time-label">MIN</span>
          </div>
          <span className="time-separator">:</span>
          <div className="time-unit">
            <span className="time-value">{formatNumber(timeLeft.seconds)}</span>
            <span className="time-label">SEC</span>
          </div>
        </div>
      )}
    </div>
  );
}
