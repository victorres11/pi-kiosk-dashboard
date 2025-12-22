import { Trophy } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { useDataFetcher } from '../../hooks/useDataFetcher';
import { fetchSportsData } from '../../utils/api';
import type { SportsDataWithGolf, GolfTournament } from '../../utils/api';
import { config } from '../../config/dashboard.config';
import type { Game } from '../../types';
import './SportsWidget.css';

export function SportsWidget() {
  const { data, loading, error } = useDataFetcher<SportsDataWithGolf>({
    fetchFn: fetchSportsData,
    refreshInterval: config.refreshIntervals.sports,
    enabled: config.widgets.sports,
  });

  if (!config.widgets.sports) return null;

  const allGames = data?.games || [];
  const golf = data?.golf;

  return (
    <div className="sports-ticker-wrapper">
      <div className="ticker-label">
        <Trophy size={16} />
        <span>SPORTS</span>
      </div>

      {loading && allGames.length === 0 && (
        <div className="ticker-loading">Loading scores...</div>
      )}

      {error && allGames.length === 0 && (
        <div className="ticker-error">Unable to load scores</div>
      )}

      {(allGames.length > 0 || golf) && (
        <div className="ticker-track">
          <div className="ticker-content">
            {/* Duplicate content for seamless loop */}
            {[1, 2].map((loop) => (
              <div key={loop} className="ticker-loop">
                {/* Golf tournament first if available */}
                {golf && <GolfTicker golf={golf} />}

                {/* Game scores */}
                {allGames.map((game, idx) => (
                  <GameTicker key={`${game.id}-${loop}-${idx}`} game={game} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && allGames.length === 0 && !golf && (
        <div className="ticker-empty">No games scheduled</div>
      )}
    </div>
  );
}

function GolfTicker({ golf }: { golf: GolfTournament }) {
  const isLive = golf.status === 'in_progress';
  const isFinal = golf.status === 'final';

  return (
    <div className={`ticker-game ticker-golf ${isLive ? 'live' : ''}`}>
      <span className="ticker-league">PGA</span>

      <div className="ticker-golf-content">
        <span className="ticker-tournament">{golf.name}</span>

        {golf.leaders.length > 0 && (
          <div className="ticker-leaders">
            {golf.leaders.slice(0, 3).map((leader, idx) => (
              <span key={leader.id} className="ticker-leader">
                <span className="leader-pos">{leader.position}</span>
                <span className="leader-name">{leader.name.split(' ').pop()}</span>
                <span className="leader-score">{leader.score}</span>
                {idx < 2 && <span className="leader-sep">•</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      <span className="ticker-status">
        {isLive && <span className="live-dot" />}
        {isFinal ? 'Final' : isLive ? 'Live' : 'Upcoming'}
      </span>

      <span className="ticker-divider">|</span>
    </div>
  );
}

function GameTicker({ game }: { game: Game }) {
  const formatGameTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    if (isTomorrow(date)) {
      return `Tom ${format(date, 'h:mm a')}`;
    }
    return format(date, 'M/d h:mm a');
  };

  const isLive = game.status === 'in_progress';
  const isFinal = game.status === 'final';

  return (
    <div className={`ticker-game ${isLive ? 'live' : ''}`}>
      <span className="ticker-league">{game.league}</span>

      <div className="ticker-matchup">
        <span className="ticker-team">
          {game.awayTeam.rank && game.awayTeam.rank <= 25 && (
            <span className="ticker-rank">#{game.awayTeam.rank}</span>
          )}
          {game.awayTeam.abbreviation}
          {(isLive || isFinal) && (
            <span className="ticker-score">{game.awayTeam.score}</span>
          )}
        </span>

        <span className="ticker-vs">@</span>

        <span className="ticker-team">
          {game.homeTeam.rank && game.homeTeam.rank <= 25 && (
            <span className="ticker-rank">#{game.homeTeam.rank}</span>
          )}
          {game.homeTeam.abbreviation}
          {(isLive || isFinal) && (
            <span className="ticker-score">{game.homeTeam.score}</span>
          )}
        </span>
      </div>

      <span className="ticker-status">
        {isLive && <span className="live-dot" />}
        {isLive ? game.statusDetail : isFinal ? 'Final' : formatGameTime(game.startTime)}
      </span>

      <span className="ticker-divider">|</span>
    </div>
  );
}
