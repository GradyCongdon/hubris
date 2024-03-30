import { shortKey, shortToLong } from "@/app/api/character";
import { fetchPlayerRating, type Rating } from "@/app/api/rating-update/player_rating/[rCode]/lib";
import type { Character, CharacterRatings} from "@/app/api/hubris/types";
import { maxBy } from "lodash";

export const getCharacterRatings = async (rCode: string): Promise<CharacterRatings> => {
  const json = await fetchPlayerRating(rCode);
  const characterArray = Object.keys(shortToLong);
  const ratings = json.reduce((acc: any, x: Rating, i: number) => {
    const short = characterArray[i];
    acc[short] = {
      value: Math.round(x.value),
      deviation: Math.round(x.deviation),
    };
    return acc;
  }, {});
  return ratings;
};

export const getTopCharacter = (characterRatings: CharacterRatings): Character => {
  // @ts-ignore
  const topCharacter = maxBy(Object.entries(characterRatings), (k, v) => v.value + v.deviation)!;
  return {
    name: shortToLong[topCharacter[0] as shortKey],
    shortCode: topCharacter[0] as shortKey,
  };
};
