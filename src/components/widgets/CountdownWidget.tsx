import { useState, useEffect } from 'react';
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
}

// NFL team logos via ESPN CDN
const teamLogos: Record<string, string> = {
  '49ers': 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
  'Colts': 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png',
  'Bears': 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
  'Seahawks': 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png',
};

// 49ers 2025-26 remaining schedule - update as needed
const getNextGame = (): GameInfo | null => {
  const now = new Date();

  const schedule: GameInfo[] = [
    {
      opponent: 'Colts',
      opponentAbbrev: 'IND',
      date: new Date('2025-12-22T17:15:00-08:00'),
      isHome: false,
      week: 'Week 16',
      ninersRecord: '10-4',
      opponentRecord: '6-8',
      spread: 'SF -5.5',
      overUnder: 'O/U 46.5',
      broadcast: 'ESPN/ABC',
      venue: 'Lucas Oil Stadium',
    },
    {
      opponent: 'Bears',
      opponentAbbrev: 'CHI',
      date: new Date('2025-12-28T17:20:00-08:00'),
      isHome: true,
      week: 'Week 17',
      ninersRecord: '10-4',
      opponentRecord: '4-10',
      spread: 'TBD',
      overUnder: 'TBD',
      broadcast: 'NBC',
      venue: "Levi's Stadium",
    },
    {
      opponent: 'Seahawks',
      opponentAbbrev: 'SEA',
      date: new Date('2026-01-04T13:25:00-08:00'),
      isHome: true,
      week: 'Week 18',
      ninersRecord: '10-4',
      opponentRecord: '8-6',
      spread: 'TBD',
      overUnder: 'TBD',
      broadcast: 'TBD',
      venue: "Levi's Stadium",
    },
  ];

  for (const game of schedule) {
    if (game.date > now) {
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
  const [nextGame, setNextGame] = useState<GameInfo | null>(getNextGame);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    nextGame ? calculateTimeLeft(nextGame.date) : { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  useEffect(() => {
    const gameCheckInterval = setInterval(() => {
      setNextGame(getNextGame());
    }, 60 * 60 * 1000);

    return () => clearInterval(gameCheckInterval);
  }, []);

  useEffect(() => {
    if (!nextGame) return;

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

  return (
    <div className="countdown-widget">
      {/* Matchup header with logos */}
      <div className="matchup-header">
        <div className="team-block niners">
          <img src={teamLogos['49ers']} alt="49ers" className="team-logo-img" />
          <span className="team-record">{nextGame.ninersRecord}</span>
        </div>

        <div className="vs-block">
          <span className="at-symbol">{nextGame.isHome ? 'VS' : '@'}</span>
          <span className="game-week-label">{nextGame.week}</span>
        </div>

        <div className="team-block opponent">
          <img src={teamLogos[nextGame.opponent]} alt={nextGame.opponent} className="team-logo-img" />
          <span className="team-record">{nextGame.opponentRecord}</span>
        </div>
      </div>

      {/* Game details */}
      <div className="game-details">
        <div className="detail-row">
          <span className="detail-item venue">{nextGame.venue}</span>
          <span className="detail-item broadcast">{nextGame.broadcast}</span>
        </div>
        <div className="detail-row">
          <span className="detail-item date-time">
            {formatGameDate(nextGame.date)} • {formatGameTime(nextGame.date)}
          </span>
        </div>
      </div>

      {/* Betting line */}
      <div className="betting-info">
        <span className="spread">{nextGame.spread}</span>
        <span className="over-under">{nextGame.overUnder}</span>
      </div>

      {/* Countdown timer */}
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
    </div>
  );
}
