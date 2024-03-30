import { Player } from "../../types";
import { getCharacterRatings, getTopCharacter } from "./characters/lib";
import { fetchPlayerCharacterData } from "@/app/api/rating-update/sets/lib";
import { APIPlayer } from "@/app/api/rating-update/types";

export const getPlayer = async (rCode: string): Promise<Player> => {
  // FIXME
  const characterRatings = await getCharacterRatings(rCode);
  const topCharacter = getTopCharacter(characterRatings);
  const _player = await fetchPlayerCharacterData(rCode, topCharacter.shortCode);
  const player = convertPlayer(_player);
  return player;
}

const convertPlayer = (api: APIPlayer): Player => {
  return {
    name: api.name,
    rCode: api.rCode,
    system: 'XX',
  };
}
