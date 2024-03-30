import { Character, CharacterRatings, Player, PlayerCharacter, PlayerCharactersIndex, Rating } from "./types";
import { matches }  from "./example-matches.js";
import { characterShorts, shortKey } from "../character";

const KY = "KY" as shortKey;
const AX = "AX" as shortKey;

const examplePlayerHeckscape = {
  name: "heckscape",
  rCode: "2EC3DCA33129F30",
  system: "PC",
};

export const examplePlayer : Player = examplePlayerHeckscape;

const exampleCharacterKY = {
  name: "Ky",
  shortCode: KY,
};

const exampleCharacterAX = {
  name: "Axl",
  shortCode: AX,
};

export const exampleCharacter : Character = exampleCharacterKY;

const exampleRating1 = {
  value: 1169,
  deviation: 69,
};
const exampleRating2 = {
  value: 1322,
  deviation: 123,
};

export const exampleRating : Rating = exampleRating1;

export const examplePlayerCharacter: PlayerCharacter = {
  player: examplePlayerHeckscape,
  character: exampleCharacterKY,
  rating: exampleRating1,
};

const genRating = () => ({
  value: Math.floor(Math.random() * 2200),
  deviation: Math.floor(Math.random() * 100),
});

export const examplePlayerCharactersIndex: PlayerCharactersIndex = {
  player: examplePlayerHeckscape,
  characterRatings: characterShorts.reduce((acc, short) => {
  // @ts-ignore
    acc[short] = genRating();
    return acc;
  }, {} as CharacterRatings),
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
    deviation: 69,
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
