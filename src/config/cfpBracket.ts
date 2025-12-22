// College Football Playoff Bracket Configuration
// Update this when the bracket is announced or games are completed

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
  name: string; // e.g., "Fiesta Bowl", "Rose Bowl"
  date: string;
  time?: string;
  network?: string;
  venue?: string;
  team1Seed: number | null; // null if TBD
  team2Seed: number | null;
  team1Score?: number;
  team2Score?: number;
  status: 'scheduled' | 'in_progress' | 'final';
  winnerSeed?: number;
}

// 2024-25 CFP Teams (12-team format)
// Update seeds, records, etc. as needed
export const cfpTeams: CFPTeam[] = [
  { seed: 1, name: 'Oregon', abbreviation: 'ORE', record: '13-0', conference: 'Big Ten' },
  { seed: 2, name: 'Georgia', abbreviation: 'UGA', record: '11-2', conference: 'SEC' },
  { seed: 3, name: 'Boise State', abbreviation: 'BSU', record: '12-1', conference: 'MWC' },
  { seed: 4, name: 'Arizona State', abbreviation: 'ASU', record: '11-2', conference: 'Big 12' },
  { seed: 5, name: 'Texas', abbreviation: 'TEX', record: '11-2', conference: 'SEC' },
  { seed: 6, name: 'Penn State', abbreviation: 'PSU', record: '11-2', conference: 'Big Ten' },
  { seed: 7, name: 'Notre Dame', abbreviation: 'ND', record: '11-1', conference: 'Independent' },
  { seed: 8, name: 'Ohio State', abbreviation: 'OSU', record: '10-2', conference: 'Big Ten' },
  { seed: 9, name: 'Tennessee', abbreviation: 'TENN', record: '10-2', conference: 'SEC' },
  { seed: 10, name: 'Indiana', abbreviation: 'IND', record: '11-1', conference: 'Big Ten' },
  { seed: 11, name: 'SMU', abbreviation: 'SMU', record: '11-2', conference: 'ACC' },
  { seed: 12, name: 'Clemson', abbreviation: 'CLEM', record: '10-3', conference: 'ACC' },
];

// Bracket structure - update scores and status as games complete
export const cfpGames: CFPGame[] = [
  // First Round (Seeds 5-12 play, Seeds 1-4 have byes)
  {
    id: 'fr1',
    round: 'first-round',
    name: 'First Round',
    date: 'Dec 20',
    time: '8:00 PM',
    network: 'ABC',
    team1Seed: 8,
    team2Seed: 9,
    team1Score: 42,
    team2Score: 17,
    status: 'final',
    winnerSeed: 8,
  },
  {
    id: 'fr2',
    round: 'first-round',
    name: 'First Round',
    date: 'Dec 21',
    time: '12:00 PM',
    network: 'TNT',
    team1Seed: 5,
    team2Seed: 12,
    team1Score: 38,
    team2Score: 24,
    status: 'final',
    winnerSeed: 5,
  },
  {
    id: 'fr3',
    round: 'first-round',
    name: 'First Round',
    date: 'Dec 21',
    time: '4:00 PM',
    network: 'TNT',
    team1Seed: 6,
    team2Seed: 11,
    team1Score: 38,
    team2Score: 10,
    status: 'final',
    winnerSeed: 6,
  },
  {
    id: 'fr4',
    round: 'first-round',
    name: 'First Round',
    date: 'Dec 21',
    time: '8:00 PM',
    network: 'ABC',
    team1Seed: 7,
    team2Seed: 10,
    team1Score: 27,
    team2Score: 17,
    status: 'final',
    winnerSeed: 7,
  },
  // Quarterfinals (NY6 Bowls)
  {
    id: 'qf1',
    round: 'quarterfinal',
    name: 'Fiesta Bowl',
    date: 'Dec 31',
    time: '7:30 PM',
    network: 'ESPN',
    venue: 'Glendale, AZ',
    team1Seed: 3,  // Boise State (bye)
    team2Seed: 6,  // Winner of PSU/SMU
    status: 'scheduled',
  },
  {
    id: 'qf2',
    round: 'quarterfinal',
    name: 'Peach Bowl',
    date: 'Jan 1',
    time: '1:00 PM',
    network: 'ESPN',
    venue: 'Atlanta, GA',
    team1Seed: 4,  // Arizona State (bye)
    team2Seed: 5,  // Winner of Texas/Clemson
    status: 'scheduled',
  },
  {
    id: 'qf3',
    round: 'quarterfinal',
    name: 'Rose Bowl',
    date: 'Jan 1',
    time: '5:00 PM',
    network: 'ESPN',
    venue: 'Pasadena, CA',
    team1Seed: 1,  // Oregon (bye)
    team2Seed: 8,  // Winner of OSU/TENN
    status: 'scheduled',
  },
  {
    id: 'qf4',
    round: 'quarterfinal',
    name: 'Sugar Bowl',
    date: 'Jan 1',
    time: '8:45 PM',
    network: 'ESPN',
    venue: 'New Orleans, LA',
    team1Seed: 2,  // Georgia (bye)
    team2Seed: 7,  // Winner of ND/IND
    status: 'scheduled',
  },
  // Semifinals
  {
    id: 'sf1',
    round: 'semifinal',
    name: 'Orange Bowl',
    date: 'Jan 9',
    time: '7:30 PM',
    network: 'ESPN',
    venue: 'Miami, FL',
    team1Seed: null, // Winner of Fiesta
    team2Seed: null, // Winner of Peach
    status: 'scheduled',
  },
  {
    id: 'sf2',
    round: 'semifinal',
    name: 'Cotton Bowl',
    date: 'Jan 10',
    time: '7:30 PM',
    network: 'ESPN',
    venue: 'Arlington, TX',
    team1Seed: null, // Winner of Rose
    team2Seed: null, // Winner of Sugar
    status: 'scheduled',
  },
  // Championship
  {
    id: 'champ',
    round: 'championship',
    name: 'National Championship',
    date: 'Jan 20',
    time: '7:30 PM',
    network: 'ESPN',
    venue: 'Atlanta, GA',
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
