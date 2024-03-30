import type { shortKey } from "../character";

export type Player = {
  name: string;
  rCode: string;
  system: string;
};
export type Character = {
  name: string;
  shortCode: shortKey;
};
export type Rating = {
  value: number;
  deviation: number;
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

export type PlayerIndex = {
  player: Player;
}

export type PlayerCharacter = {
  player: Player;
  character: Character;
  rating: Rating;
};

export type CharacterRatings = Record<shortKey, Rating>;

export type PlayerCharactersIndex = {
  player: Player;
  characterRatings: CharacterRatings;
};

export type PlayerCharacterMatchIndex = PlayerCharacter & {
  matches: Match[];
};
