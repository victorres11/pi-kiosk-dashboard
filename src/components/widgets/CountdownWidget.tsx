import { useState, useEffect } from 'react';
import './CountdownWidget.css';

interface NextGame {
  opponent: string;
  date: Date;
  isHome: boolean;
  week: string;
}

// 49ers 2025-26 remaining schedule - update as needed
const getNextGame = (): NextGame | null => {
  const now = new Date();

  // 49ers remaining games (update these as the season progresses)
  const schedule: NextGame[] = [
    { opponent: 'Colts', date: new Date('2025-12-22T17:15:00-08:00'), isHome: false, week: 'Week 16' },
    { opponent: 'Bears', date: new Date('2025-12-28T17:20:00-08:00'), isHome: true, week: 'Week 17' },
    { opponent: 'Seahawks', date: new Date('2026-01-04T13:25:00-08:00'), isHome: true, week: 'Week 18' },
  ];

  // Find the next upcoming game
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

export function CountdownWidget() {
  const [nextGame, setNextGame] = useState<NextGame | null>(getNextGame);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    nextGame ? calculateTimeLeft(nextGame.date) : { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  useEffect(() => {
    // Update next game check every hour
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
          <span className="team-logo">🏈</span>
          <span className="team-name">49ERS</span>
        </div>
        <div className="offseason-message">
          Season Complete
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="countdown-widget">
      <div className="countdown-header">
        <span className="team-logo">🏈</span>
        <span className="team-name">49ERS</span>
      </div>

      <div className="game-info">
        <span className="game-type">{nextGame.isHome ? 'VS' : '@'}</span>
        <span className="opponent">{nextGame.opponent}</span>
        <span className="game-week">{nextGame.week}</span>
      </div>

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
