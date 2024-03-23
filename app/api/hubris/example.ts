import { Character, Player, PlayerCharacter, PlayerCharactersIndex, Rating } from "./types";
import { matches }  from "./example-matches.js";

const examplePlayerHeckscape = {
  name: "heckscape",
  rCode: "2EC3DCA33129F30",
  system: "PC",
};

export const examplePlayer : Player = examplePlayerHeckscape;

const exampleCharacterKY = {
  name: "Ky",
  shortCode: "KY",
};

const exampleCharacterAX = {
  name: "Axl",
  shortCode: "AX",
};

export const exampleCharacter : Character = exampleCharacterKY;

const exampleRating1 = {
  value: 1169,
  error: 69,
};
const exampleRating2 = {
  value: 1322,
  error: 123,
};

export const exampleRating : Rating = exampleRating1;

export const examplePlayerCharacter: PlayerCharacter = {
  player: examplePlayerHeckscape,
  character: exampleCharacterKY,
  rating: exampleRating1,
};

export const examplePlayerCharactersIndex: PlayerCharactersIndex = {
  player: examplePlayerHeckscape,
  characters: {
    KY: exampleCharacterKY,
    AX: exampleCharacterAX
  },
  ratings: {
    KY: exampleRating1,
    AX: exampleRating2,
  },
};

const exampleMatch1 = {
  id: "1",
  timePeriod: {
    date: new Date("2021-01-01"),
    dateString: "2021-01-01",
    _date: "2021-01-01",
  },
  player: examplePlayerHeckscape,
  rating: {
    value: 1652,
    error: 69,
    change: 2.4,
  },
  record: {
    total: 1,
    wins: 1,
    losses: 0,
    winPercent: 100,
  },
  probability: {
    odds: 1,
    oddsFactor: 1,
  },
  opponent: {
    player: examplePlayerHeckscape,
    rating: exampleRating2,
    character: exampleCharacterAX,
  },
};

export const exampleMatch = exampleMatch1;

export const examplePlayerCharacterMatchIndex = {
  player: examplePlayerHeckscape,
  character: exampleCharacterKY,
  rating: exampleRating1,
  matches: JSON.parse(matches, (key, value) => {
    if (key === "date") {
      return new Date(value);
    }
    return value;
  })
};
