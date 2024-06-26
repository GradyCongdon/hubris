import { longKey, shortKey } from "../character";

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
  characterShort: shortKey;
  character: string;
};

