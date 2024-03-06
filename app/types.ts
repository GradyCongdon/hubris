export type APIMatch = {
  Date: string;
  _DateString: string;
  _Date: string;
  Character: string;
  CharacterShort: string;
  Rating: number;
  Rating1500: number;
  Error: number;
  Min: number;
  Max: number;
  Wins: number;
  Losses: number;
  OpponentCharacter: string;
  OpponentCharacterShort: string;
  OpponentRating: number;
  OpponentError: number;
  OpponentName: string;
  OpponentSystem: string;
  Odds: number;
  OddsFactor: number;
  Change: number;
};

export type APIPlayer = {
  name: string;
  rCode: string;
  characterShort: string;
  character: string;
};

export type Player = {
  name: string;
  rCode: string;
  system: string;
};
export type Character = {
  name: string;
  shortCode: string;
};
export type Rating = {
  value: number;
  error: number;
};
export type MatchRating = Rating & {
  change: number;
};
export type MatchRecord = {
  total: number;
  wins: number;
  losses: number;
  winPercent: number;
};
export type MatchProbability = {
  odds: number;
  oddsFactor: number;
};
export type TimePeriod = {
  date: Date;
  dateString: string;
  _date: string; // original RI date
};

export type Match = {
  id: string;
  timePeriod: TimePeriod;
  player: Player;
  rating: MatchRating;
  record: MatchRecord;
  probability: MatchProbability;
  opponent: {
    player: Player;
    rating: Rating;
    character: Character;
  };
};

export type PlayerPage = {
  player: Player;
  character: Character;
  rating: Rating;
  matches: Match[];
};
