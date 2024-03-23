"use server";
import { PlayerCharacter, PlayerCharacterMatchIndex, PlayerCharactersIndex } from "@/app/api/hubris/types";
import { fetchCharacterMatchIndex } from "./convert";
import { EXAMPLE, MATCH_LIMIT } from "@/app/consts";
import { examplePlayerCharacter, examplePlayerCharacterMatchIndex, examplePlayerCharactersIndex } from "./example";

/*
/search/:name - PlayerSearch

/player/:rCode - PlayerCharactersIndex 
/player/:rCode/characters - PlayerCharactersIndex
/player/:rCode/Character/:characterShort - PlayerCharacter [redirect on charlong]
/player/:rCode/Character/:characterShort/matches - PlayerCharacterMatchIndex
/player/:rCode/Character/:characterShort/match/:matchId - PlayerCharacterMatch
*/

// /player/:rCode - PlayerCharactersIndex 
// /player/:rCode/characters - PlayerCharactersIndex
export const TODO_getPlayerCharactersIndex = async (rCode: string): Promise<PlayerCharactersIndex> => {
  if (EXAMPLE) return examplePlayerCharactersIndex;
  return examplePlayerCharactersIndex;
}

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