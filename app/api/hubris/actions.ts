"use server";
import { Player, PlayerCharacter, PlayerCharacterMatchIndex, PlayerCharactersIndex } from "@/app/api/hubris/types";
import { fetchCharacterMatchIndex } from "./convert";
import { EXAMPLE, MATCH_LIMIT } from "@/app/consts";
import { examplePlayer, examplePlayerCharacter, examplePlayerCharacterMatchIndex, examplePlayerCharactersIndex } from "./example";
import { getCharacterRatings } from "./player/[rCode]/characters/lib";
import { getPlayer as _getPlayer } from "./player/[rCode]/lib";


/*
/search/:name - PlayerSearch

/player/:rCode - PlayerCharactersIndex
/player/:rCode/characters - PlayerCharactersIndex
/player/:rCode/character/:characterShort - PlayerCharacter [redirect on charlong]
/player/:rCode/rharacter/:characterShort/matches - PlayerCharacterMatchIndex
/player/:rCode/Character/:characterShort/match/:matchId - PlayerCharacterMatch
*/

// /player/:rCode - PlayerCharactersIndex 
export const getPlayer = async (rCode: string): Promise<Player> => {
  if (EXAMPLE) return examplePlayer;
  const player = await _getPlayer(rCode);
  return player;
};

// /player/:rCode/characters - PlayerCharactersIndex
export const getPlayerCharactersIndex = async (rCode: string): Promise<PlayerCharactersIndex> => {
  if (EXAMPLE) return examplePlayerCharactersIndex;
  const characterRatings = await getCharacterRatings(rCode);
  const player = await _getPlayer(rCode);
  return {
    player,
    characterRatings
  };
};


// /player/:rCode/Character/:characterShort - PlayerCharacter
export const getPlayerCharacter = async (rCode: string, characterShort: string): Promise<PlayerCharacter> => {
  if (EXAMPLE) return examplePlayerCharacter;
  // FIXME
  const {player, character, rating} = await fetchCharacterMatchIndex(rCode, characterShort, 1);
  return {
    player,
    character,
    rating
  };
}

// /player/:rCode/Character/:characterShort/matches - PlayerCharacterMatchIndex
export const getPlayerCharacterMatchIndex = async (rCode: string, characterShort: string, matchLimit = MATCH_LIMIT): Promise<PlayerCharacterMatchIndex> => {
  if (EXAMPLE) return examplePlayerCharacterMatchIndex;
  return fetchCharacterMatchIndex(rCode, characterShort, matchLimit);
}