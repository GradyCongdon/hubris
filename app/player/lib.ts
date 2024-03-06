import type { APIMatch as APIMatch, APIPlayer, PlayerPage } from "@/app/types";
import { getPlayerData, getCharacterSets } from "@/app/api/sets/lib";
const cached = false;

export const fetchPlayerPage = async (
  rCode: string,
  characterShort: string
): Promise<PlayerPage> => {
  const [_player, _matches] = await Promise.all([
    getPlayerData(rCode, characterShort),
    getCharacterSets(rCode, characterShort, cached),
  ]);
  if ("error" in _player) {
    throw new Error(_player.error);
  }
  return convertFromAPI(_player, _matches);
};

export const convertFromAPI = (
  _player: APIPlayer,
  _matches: APIMatch[]
): PlayerPage => {
  const player = {
    name: _player.name,
    rCode: _player.rCode,
    system: "TODO",
  };
  const character = {
    name: _player.character,
    shortCode: _player.characterShort,
  };
  // TODO
  const rating = {
    value: _matches[0].Rating + _matches[0].Change,
    error: _matches[0].Error,
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
      error: match.Error,
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
        rCode: match.OpponentName,
        system: match.OpponentSystem,
      },
      rating: {
        value: match.OpponentRating,
        error: match.OpponentError,
      },
      character: {
        name: match.OpponentCharacter,
        shortCode: match.OpponentCharacterShort,
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
