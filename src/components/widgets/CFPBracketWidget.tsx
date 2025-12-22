import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { WidgetContainer } from './WidgetContainer';
import { cfpGames, getTeamBySeed } from '../../config/cfpBracket';
import type { CFPGame, CFPTeam } from '../../config/cfpBracket';
import './CFPBracketWidget.css';

const ROTATION_INTERVAL = 6000; // 6 seconds per view

type BracketView = 'first-round' | 'quarterfinals' | 'final-four';

export function CFPBracketWidget() {
  const [currentView, setCurrentView] = useState<BracketView>('quarterfinals');

  // Auto-rotate through views
  useEffect(() => {
    const views: BracketView[] = ['first-round', 'quarterfinals', 'final-four'];
    let currentIdx = views.indexOf(currentView);

    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % views.length;
      setCurrentView(views[currentIdx]);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const firstRoundGames = cfpGames.filter(g => g.round === 'first-round');
  const quarterfinalGames = cfpGames.filter(g => g.round === 'quarterfinal');
  const semifinalGames = cfpGames.filter(g => g.round === 'semifinal');
  const championship = cfpGames.find(g => g.round === 'championship');

  return (
    <WidgetContainer
      title="CFP Bracket"
      icon={<Trophy size={18} />}
      className="cfp-widget"
    >
      <div className="cfp-bracket">
        <div className="view-tabs">
          <button
            className={`view-tab ${currentView === 'first-round' ? 'active' : ''}`}
            onClick={() => setCurrentView('first-round')}
          >
            Round 1
          </button>
          <button
            className={`view-tab ${currentView === 'quarterfinals' ? 'active' : ''}`}
            onClick={() => setCurrentView('quarterfinals')}
          >
            Quarters
          </button>
          <button
            className={`view-tab ${currentView === 'final-four' ? 'active' : ''}`}
            onClick={() => setCurrentView('final-four')}
          >
            Final 4
          </button>
        </div>

        <div className="bracket-content">
          {currentView === 'first-round' && (
            <div className="round-view first-round-view">
              <div className="round-header">
                <span>First Round</span>
                <span className="round-note">Seeds 1-4 have byes</span>
              </div>
              <div className="games-grid">
                {firstRoundGames.map(game => (
                  <GameCard key={game.id} game={game} compact />
                ))}
              </div>
            </div>
          )}

          {currentView === 'quarterfinals' && (
            <div className="round-view quarterfinals-view">
              <div className="round-header">
                <span>Quarterfinals</span>
                <span className="round-note">NY6 Bowls</span>
              </div>
              <div className="games-grid">
                {quarterfinalGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          )}

          {currentView === 'final-four' && (
            <div className="round-view final-four-view">
              <div className="semis-row">
                {semifinalGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
              {championship && (
                <div className="championship-row">
                  <GameCard game={championship} isChampionship />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </WidgetContainer>
  );
}

function GameCard({
  game,
  compact = false,
  isChampionship = false
}: {
  game: CFPGame;
  compact?: boolean;
  isChampionship?: boolean;
}) {
  const team1 = game.team1Seed ? getTeamBySeed(game.team1Seed) : null;
  const team2 = game.team2Seed ? getTeamBySeed(game.team2Seed) : null;

  const isLive = game.status === 'in_progress';
  const isFinal = game.status === 'final';

  return (
    <div className={`game-card ${isLive ? 'live' : ''} ${isChampionship ? 'championship' : ''} ${compact ? 'compact' : ''}`}>
      <div className="game-info">
        <span className="game-name">{game.name}</span>
        {!compact && game.venue && <span className="game-venue">{game.venue}</span>}
        <span className="game-date">
          {game.date} {game.time && `• ${game.time}`}
        </span>
      </div>

      <div className="matchup">
        <TeamSlot
          team={team1}
          seed={game.team1Seed}
          score={game.team1Score}
          isWinner={isFinal && game.winnerSeed === game.team1Seed}
          showScore={isLive || isFinal}
        />
        <span className="vs-divider">vs</span>
        <TeamSlot
          team={team2}
          seed={game.team2Seed}
          score={game.team2Score}
          isWinner={isFinal && game.winnerSeed === game.team2Seed}
          showScore={isLive || isFinal}
        />
      </div>

      {isLive && <span className="live-badge">LIVE</span>}
      {isFinal && <span className="final-badge">FINAL</span>}
    </div>
  );
}

function TeamSlot({
  team,
  seed,
  score,
  isWinner,
  showScore
}: {
  team: CFPTeam | null | undefined;
  seed: number | null;
  score?: number;
  isWinner?: boolean;
  showScore?: boolean;
}) {
  if (!team) {
    return (
      <div className="team-slot tbd">
        <span className="team-seed">-</span>
        <span className="team-name">TBD</span>
      </div>
    );
  }

  return (
    <div className={`team-slot ${isWinner ? 'winner' : ''}`}>
      <span className="team-seed">#{seed}</span>
      <span className="team-abbrev">{team.abbreviation}</span>
      {showScore && score !== undefined && (
        <span className="team-score">{score}</span>
      )}
    </div>
  );
}
