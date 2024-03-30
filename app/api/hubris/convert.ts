"use server";
import type { APIMatch, APIPlayer } from "@/app/api/rating-update/types";
import { PlayerCharacterMatchIndex } from "@/app/api/hubris/types";
import { fetchPlayerCharacterData, fetchCharacterSets } from "@/app/api/rating-update/sets/lib";
import { EXAMPLE } from "@/app/consts";
import { longKey, shortKey } from "../character";


export const fetchCharacterMatchIndex = async (
  rCode: string,
  characterShort: string,
  number: number
): Promise<PlayerCharacterMatchIndex> => {
  const [_player, _matches] = await Promise.all([
    fetchPlayerCharacterData(rCode, characterShort, EXAMPLE),
    fetchCharacterSets(rCode, characterShort, EXAMPLE),
  ]);
  const matches = _matches.slice(0, number);
  const p = convertFromRatingUpdate(_player, matches);
  return p;
};

export const convertFromRatingUpdate = (
  _player: APIPlayer,
  _matches: APIMatch[]
): PlayerCharacterMatchIndex => {
  const player = {
    name: _player.name,
    rCode: _player.rCode,
    system: "TODO",
  };
  const character = {
    name: _player.character,
    shortCode: _player.characterShort as shortKey,
  };
  // TODO
  const rating = {
    value: Math.round(_matches[0].Rating + _matches[0].Change),
    deviation: _matches[0].Error,
  };
  const matches = _matches.map((match: APIMatch) => {
    // const player = {
    //   name: _player.name,
    //   rCode: rCode,
    //   system: "TODO",
    // };
    // const character = {
    //   name: _player.character,
    //   shortCode: characterShort,
    // }
    //
    const timePeriod = {
      date: new Date(match.Date),
      dateString: match._DateString,
      _date: match._Date,
    };
    const rating = {
      value: match.Rating,
      deviation: match.Error,
      change: match.Change,
    };
    const record = {
      total: match.Wins + match.Losses,
      wins: match.Wins,
      losses: match.Losses,
      winPercent: (match.Wins / (match.Wins + match.Losses)) * 100,
    };
    const probability = {
      odds: match.Odds,
      oddsFactor: match.OddsFactor,
    };
    const opponent = {
      player: {
        name: match.OpponentName,
        rCode: "FIXME",
        system: match.OpponentSystem,
      },
      rating: {
        value: match.OpponentRating,
        deviation: match.OpponentError,
      },
      character: {
        name: match.OpponentCharacter,
        shortCode: match.OpponentCharacterShort as shortKey,
      },
    };
    return {
      id: match._DateString, // TODO
      timePeriod,
      player,
      rating,
      character,
      record,
      probability,
      opponent,
    };
  });

  return { player, character, rating, matches };
};
