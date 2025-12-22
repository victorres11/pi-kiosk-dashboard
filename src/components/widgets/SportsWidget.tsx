import { useState, useEffect } from 'react';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { useDataFetcher } from '../../hooks/useDataFetcher';
import { fetchSportsData } from '../../utils/api';
import { config } from '../../config/dashboard.config';
import { WidgetContainer } from './WidgetContainer';
import type { SportsData, Game } from '../../types';
import './SportsWidget.css';

const TICKER_INTERVAL = 5000; // 5 seconds per game

export function SportsWidget() {
  const { data, loading, error, lastUpdated } = useDataFetcher<SportsData>({
    fetchFn: fetchSportsData,
    refreshInterval: config.refreshIntervals.sports,
    enabled: config.widgets.sports,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const allGames = data?.games || [];

  // Auto-rotate through games
  useEffect(() => {
    if (allGames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allGames.length);
    }, TICKER_INTERVAL);

    return () => clearInterval(interval);
  }, [allGames.length]);

  // Reset index when data changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [data]);

  if (!config.widgets.sports) return null;

  const currentGame = allGames[currentIndex];

  return (
    <WidgetContainer
      title="College Sports"
      icon={<Trophy size={20} />}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      className="sports-widget"
    >
      {data && allGames.length > 0 && currentGame && (
        <div className="sports-ticker">
          <div className="ticker-nav">
            <button
              className="ticker-btn"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + allGames.length) % allGames.length)}
              aria-label="Previous game"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="ticker-counter">
              {currentIndex + 1} / {allGames.length}
            </span>
            <button
              className="ticker-btn"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % allGames.length)}
              aria-label="Next game"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <GameCard key={currentGame.id} game={currentGame} />

          <div className="ticker-dots">
            {allGames.map((_, idx) => (
              <button
                key={idx}
                className={`ticker-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to game ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {data && allGames.length === 0 && (
        <div className="no-games">
          <p>No games scheduled</p>
        </div>
      )}
    </WidgetContainer>
  );
}

function GameCard({ game }: { game: Game }) {
  const formatGameTime = (date: Date) => {
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    }
    if (isTomorrow(date)) {
      return `Tomorrow, ${format(date, 'h:mm a')}`;
    }
    return format(date, 'EEE M/d, h:mm a');
  };

  const isLive = game.status === 'in_progress';
  const isFinal = game.status === 'final';

  return (
    <div className={`game-card ${isLive ? 'live' : ''} ${isFinal ? 'final' : ''}`}>
      <div className="game-header">
        <span className="league-badge">{game.league}</span>
        {isLive && <span className="status-badge live">{game.statusDetail}</span>}
        {isFinal && <span className="status-badge final">Final</span>}
        {!isLive && !isFinal && (
          <span className="game-time">{formatGameTime(game.startTime)}</span>
        )}
      </div>

      <div className="game-matchup">
        <TeamRow team={game.awayTeam} isWinner={isFinal && (game.awayTeam.score ?? 0) > (game.homeTeam.score ?? 0)} />
        <TeamRow team={game.homeTeam} isWinner={isFinal && (game.homeTeam.score ?? 0) > (game.awayTeam.score ?? 0)} isHome />
      </div>

      {game.broadcast && !isFinal && (
        <div className="game-broadcast">
          <span>{game.broadcast}</span>
        </div>
      )}
    </div>
  );
}

function TeamRow({
  team,
  isHome,
  isWinner,
}: {
  team: Game['homeTeam'];
  isHome?: boolean;
  isWinner?: boolean;
}) {
  return (
    <div className={`team-row ${isWinner ? 'winner' : ''}`}>
      <div className="team-info">
        {team.logo && (
          <img src={team.logo} alt={team.name} className="team-logo" />
        )}
        <div className="team-name-container">
          {team.rank && team.rank <= 25 && (
            <span className="team-rank">#{team.rank}</span>
          )}
          <span className="team-name">{team.name}</span>
          {isHome && <span className="home-indicator">(H)</span>}
        </div>
      </div>
      {team.score !== undefined && (
        <span className={`team-score ${isWinner ? 'winner' : ''}`}>
          {team.score}
        </span>
      )}
    </div>
  );
}
