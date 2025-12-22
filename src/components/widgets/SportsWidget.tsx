import { Trophy, Clock, Radio } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { useDataFetcher } from '../../hooks/useDataFetcher';
import { fetchSportsData } from '../../utils/api';
import { config } from '../../config/dashboard.config';
import { WidgetContainer } from './WidgetContainer';
import type { SportsData, Game } from '../../types';
import './SportsWidget.css';

export function SportsWidget() {
  const { data, loading, error, lastUpdated } = useDataFetcher<SportsData>({
    fetchFn: fetchSportsData,
    refreshInterval: config.refreshIntervals.sports,
    enabled: config.widgets.sports,
  });

  if (!config.widgets.sports) return null;

  const liveGames = data?.games.filter((g) => g.status === 'in_progress') || [];
  const upcomingGames = data?.games.filter((g) => g.status === 'scheduled') || [];
  const recentGames = data?.games.filter((g) => g.status === 'final') || [];

  return (
    <WidgetContainer
      title="College Sports"
      icon={<Trophy size={24} />}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      className="sports-widget"
    >
      {data && (
        <div className="sports-content">
          {liveGames.length > 0 && (
            <div className="games-section">
              <h4 className="section-title live">
                <Radio size={16} className="pulse" /> Live Now
              </h4>
              {liveGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          {upcomingGames.length > 0 && (
            <div className="games-section">
              <h4 className="section-title">
                <Clock size={16} /> Upcoming
              </h4>
              {upcomingGames.slice(0, 4).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          {recentGames.length > 0 && liveGames.length === 0 && upcomingGames.length < 3 && (
            <div className="games-section">
              <h4 className="section-title">Recent Results</h4>
              {recentGames.slice(0, 3).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}

          {data.games.length === 0 && (
            <div className="no-games">
              <p>No games scheduled right now.</p>
              <p className="no-games-sub">Check back during football or basketball season!</p>
            </div>
          )}
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
