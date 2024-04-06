'use server';
import {SearchResult, search as _search } from '@/app/api/rating-update/search/lib';
import { CharacterRatings, PlayerCharactersIndex } from '../types';
import { shortKey } from '../../character';
import { groupBy } from 'lodash';

export const search = async (name: string): Promise<Record<string,PlayerCharactersIndex>> => {
  const results = await _search(name.trim());
  const rCodeGroups = groupBy(results, 'id');
  const playerCharacterIndices: Record<string, PlayerCharactersIndex> = {};
  Object.entries(rCodeGroups).forEach(([rCode, results]) => {
        
  const characters = results.reduce((characterRatings: CharacterRatings, result: SearchResult) => {
    characterRatings[result.character_short as shortKey] = {
      value: result.rating_value,
      deviation: result.rating_deviation,
    };
    return characterRatings
  }, {});

  playerCharacterIndices[rCode] = {
    player: {
      name: results[0].name,
      rCode: rCode,
      system: results[0].platform, // FIXME would need to group by system
    },
    characterRatings: characters,
  }
    return;
});
  return playerCharacterIndices;
}
