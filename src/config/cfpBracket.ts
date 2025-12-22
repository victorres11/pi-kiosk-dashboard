// College Football Playoff Bracket Configuration
// 2025-26 Season - Update scores and status as games complete

export interface CFPTeam {
  seed: number;
  name: string;
  abbreviation: string;
  logo?: string;
  record: string;
  conference: string;
}

export interface CFPGame {
  id: string;
  round: 'first-round' | 'quarterfinal' | 'semifinal' | 'championship';
  name: string;
  date: string;
  time?: string;
  network?: string;
  venue?: string;
  team1Seed: number | null;
  team2Seed: number | null;
  team1Score?: number;
  team2Score?: number;
  status: 'scheduled' | 'in_progress' | 'final';
  winnerSeed?: number;
}

// 2025-26 CFP Teams (12-team format)
export const cfpTeams: CFPTeam[] = [
  { seed: 1, name: 'Indiana', abbreviation: 'IND', record: '12-0', conference: 'Big Ten' },
  { seed: 2, name: 'Ohio State', abbreviation: 'OSU', record: '11-1', conference: 'Big Ten' },
  { seed: 3, name: 'Georgia', abbreviation: 'UGA', record: '11-1', conference: 'SEC' },
  { seed: 4, name: 'Texas Tech', abbreviation: 'TTU', record: '11-1', conference: 'Big 12' },
  { seed: 5, name: 'Oregon', abbreviation: 'ORE', record: '11-1', conference: 'Big Ten' },
  { seed: 6, name: 'Ole Miss', abbreviation: 'MISS', record: '10-2', conference: 'SEC' },
  { seed: 7, name: 'Texas A&M', abbreviation: 'TAMU', record: '10-2', conference: 'SEC' },
  { seed: 8, name: 'Oklahoma', abbreviation: 'OU', record: '10-2', conference: 'SEC' },
  { seed: 9, name: 'Alabama', abbreviation: 'BAMA', record: '10-2', conference: 'SEC' },
  { seed: 10, name: 'Miami', abbreviation: 'MIA', record: '10-2', conference: 'ACC' },
  { seed: 11, name: 'Tulane', abbreviation: 'TULN', record: '11-2', conference: 'AAC' },
  { seed: 12, name: 'James Madison', abbreviation: 'JMU', record: '11-1', conference: 'Sun Belt' },
];

// Bracket structure - update scores and status as games complete
export const cfpGames: CFPGame[] = [
  // First Round (Seeds 5-12 play, Seeds 1-4 have byes)
  {
    id: 'fr1',
    round: 'first-round',
    name: 'First Round',
    date: 'Dec 19',
    time: '8:00 PM',
    network: 'ESPN',
    team1Seed: 8,
    team2Seed: 9,
    team1Score: 24,
    team2Score: 34,
    status: 'final',
    winnerSeed: 9,
  },
  {
    id: 'fr2',
    round: 'first-round',
    name: 'First Round',
    date: 'Dec 20',
    time: '12:00 PM',
    network: 'ESPN',
    team1Seed: 7,
    team2Seed: 10,
    team1Score: 3,
    team2Score: 10,
    status: 'final',
    winnerSeed: 10,
  },
  {
    id: 'fr3',
    round: 'first-round',
    name: 'First Round',
    date: 'Dec 20',
    time: '4:00 PM',
    network: 'ESPN',
    team1Seed: 6,
    team2Seed: 11,
    team1Score: 41,
    team2Score: 10,
    status: 'final',
    winnerSeed: 6,
  },
  {
    id: 'fr4',
    round: 'first-round',
    name: 'First Round',
    date: 'Dec 20',
    time: '8:00 PM',
    network: 'ESPN',
    team1Seed: 5,
    team2Seed: 12,
    team1Score: 51,
    team2Score: 34,
    status: 'final',
    winnerSeed: 5,
  },
  // Quarterfinals (NY6 Bowls)
  {
    id: 'qf1',
    round: 'quarterfinal',
    name: 'Cotton Bowl',
    date: 'Dec 31',
    time: '7:30 PM',
    network: 'ESPN',
    venue: 'Arlington, TX',
    team1Seed: 2,  // Ohio State (bye)
    team2Seed: 10, // Miami (winner of TAMU/MIA)
    status: 'scheduled',
  },
  {
    id: 'qf2',
    round: 'quarterfinal',
    name: 'Orange Bowl',
    date: 'Jan 1',
    time: '12:00 PM',
    network: 'ESPN',
    venue: 'Miami, FL',
    team1Seed: 4,  // Texas Tech (bye)
    team2Seed: 5,  // Oregon (winner of ORE/JMU)
    status: 'scheduled',
  },
  {
    id: 'qf3',
    round: 'quarterfinal',
    name: 'Rose Bowl',
    date: 'Jan 1',
    time: '4:00 PM',
    network: 'ESPN',
    venue: 'Pasadena, CA',
    team1Seed: 1,  // Indiana (bye)
    team2Seed: 9,  // Alabama (winner of OU/BAMA)
    status: 'scheduled',
  },
  {
    id: 'qf4',
    round: 'quarterfinal',
    name: 'Sugar Bowl',
    date: 'Jan 1',
    time: '8:00 PM',
    network: 'ESPN',
    venue: 'New Orleans, LA',
    team1Seed: 3,  // Georgia (bye)
    team2Seed: 6,  // Ole Miss (winner of MISS/TULN)
    status: 'scheduled',
  },
  // Semifinals
  {
    id: 'sf1',
    round: 'semifinal',
    name: 'Fiesta Bowl',
    date: 'Jan 8',
    time: '7:30 PM',
    network: 'ESPN',
    venue: 'Glendale, AZ',
    team1Seed: null, // Winner of Cotton
    team2Seed: null, // Winner of Orange
    status: 'scheduled',
  },
  {
    id: 'sf2',
    round: 'semifinal',
    name: 'Peach Bowl',
    date: 'Jan 9',
    time: '7:30 PM',
    network: 'ESPN',
    venue: 'Atlanta, GA',
    team1Seed: null, // Winner of Rose
    team2Seed: null, // Winner of Sugar
    status: 'scheduled',
  },
  // Championship
  {
    id: 'champ',
    round: 'championship',
    name: 'National Championship',
    date: 'Jan 19',
    time: '7:30 PM',
    network: 'ESPN',
    venue: 'Miami Gardens, FL',
    team1Seed: null,
    team2Seed: null,
    status: 'scheduled',
  },
];

// Helper to get team by seed
export function getTeamBySeed(seed: number): CFPTeam | undefined {
  return cfpTeams.find(t => t.seed === seed);
}

// Helper to get game by id
export function getGameById(id: string): CFPGame | undefined {
  return cfpGames.find(g => g.id === id);
}
