import { uniq } from "lodash";
import { tabletojson } from "tabletojson";
import heckSets from './heckSets.json' with { type: 'json' };

export const shortToLong = {
  SO: "Sol",
  KY: "Ky",
  MA: "May",
  AX: "Axl",
  CH: "Chipp",
  PO: "Potemkin",
  FA: "Faust",
  MI: "Millia",
  ZA: "Zato-1",
  RA: "Ramlethal",
  LE: "Leo",
  NA: "Nagoriyuki",
  GI: "Giovanna",
  AN: "Anji",
  IN: "I-No",
  GO: "Goldlewis",
  JC: "Jack-O'",
  JC: "Jack-O",
  HA: "Happy Chaos",
  BA: "Baiken",
  TE: "Testament",
  BI: "Bridget",
  SI: "Sin",
  BE: "Bedman",
  BE: "Bedman?",
  AS: "Asuka",
  JN: "Johnny",
  EL: "Elphelt",
};

export const longToShort = Object.entries(shortToLong).reduce((acc, [k, v]) => {
  acc[v] = k;
  return acc;
}, {});

const fetchHistory = async (rCode, characterShort) => {
  const urlTemplate = `http://ratingupdate.info/player/${rCode}/${characterShort}/history`;
  const urls = [0, 100, 200, 300, 400, 500].map(
    (o) => `${urlTemplate}?offset=${o}`
  );
  const allSetsOffsets = await Promise.all(
    urls.map(async (url) => {
      console.log("fetching", url);
      const offset = parseInt(url.split("offset=")[1], 10);
      const revalidate = offset == 0 ? 0 : 60 * 60 * 24 * (offset / 100);
      const resp = await fetch(url, { next: { revalidate } });

      const text = await resp.text();
      const slug = url.replace('http://ratingupdate.info/player/', '').replace('/history?offset=', '-').padEnd(22, ' ');
      const tables = tabletojson.convert(text);
      if (tables.length == 0) {
        console.log(slug, " sets:  0");
        return [];
      }
      const sets = tables[0];
      const newest = sets[0];
      const oldest = sets[sets.length - 1];
      const firstLastDateRangeString = `${newest["Date"]} - ${oldest["Date"]}`;
      console.log(`${slug}  sets: ${sets.length} [${firstLastDateRangeString}]`);
      return sets;
    })
  );
  const allSets = allSetsOffsets.flat(Infinity);
  const unique = uniq(allSets, (x) => x["Date"]);
  const sets = unique.map((set) => {
    const opponentCharacter = set["Character"];
    set["OpponentCharacter"] = opponentCharacter;
    set["Character"] = shortToLong[characterShort];
    return set;
  });
  const fileName = `${rCode}-${characterShort}.ru.json`;
  // fs.writeFileSync(fileName, JSON.stringify(sets));
  return sets;
};

const fixDate = (str) => {
  const [day, time] = str.split(" ");
  const [_hour, min, sec] = time.split(":");
  const hour = _hour.length == 1 ? "0" + _hour : _hour;
  return `${day} ${[hour, min, "00"].join(":")}`;
};

const getRating = (str) => {
  try {
    const [rating, error] = str.split(" ±");
    return [rating, error].map((x) => parseInt(x, 10));
  } catch (e) {
    console.error("Cannot parse Rating", str);
    throw new Error(e);
  }
};

const fixSet = (set) => {
  try {
    const _Date = set["Date"];
    const _DateString = fixDate(set["Date"]);
    const date = new Date(_DateString);
    const Character = set["Character"];
    const CharacterShort = longToShort[Character];
    const [Rating, Error] = getRating(set["Rating"]);
    const Min = Rating - Error;
    const Max = Rating + Error;
    const Rating1500 = Rating - 1500;
    const [Wins, Losses] = set["Result"]
      .split(" - ")
      .map((x) => parseInt(x, 10));
    const _opponentRating = set["Rating_2"];
    const [OpponentRating, OpponentError] = getRating(_opponentRating);
    const opponent = set["Opponent"];
    const OpponentCharacter = set["OpponentCharacter"];
    const OpponentCharacterShort = longToShort[OpponentCharacter];
    const OpponentName = opponent.slice(0, -2).trim();
    const OpponentSystem = opponent.slice(-2);
    const [_odds, _oddsFactor] = set["Odds"].split("%");
    const Odds = parseInt(_odds, 10) / 100;
    const OddsFactor = _oddsFactor.length;
    const Change = parseFloat(set["Rating change"], 10) || 0;
    return {
      Date: date,
      _DateString,
      _Date,
      Character,
      CharacterShort,
      Rating,
      Rating1500,
      Error,
      Min,
      Max,
      Wins,
      Losses,
      OpponentCharacter,
      OpponentCharacterShort,
      OpponentRating,
      OpponentError,
      OpponentName,
      OpponentSystem,
      Odds,
      OddsFactor,
      Change,
    };
  } catch (e) {
    if (set.Opponent == "(Hidden)") return null;
    console.error(e, set);
    return null;
  }
};

const fixSheet = (data) => {
  const gameCount = data.reduce((acc, v) => {
    const char = v["Character"];
    const date = v["Date"];
    if (!acc[char]) {
      acc[char] = {
        count: 0,
      };
    }
    acc[char].count += 1;
    acc[char][date] = acc[char].count;
    return acc;
  }, {});
  const getGameCount = (row) => {
    try {
      const char = row["Character"];
      const date = row["_Date"];
      return gameCount[char][date];
    } catch (e) {
      console.error("Cannot lookup game", e);
      return -1;
    }
  };
  const cleaned = data
    .map((x) => {
      const clean = fixSet(x);
      if (!clean) return;
      clean["GameCount"] = getGameCount(clean);
      return clean;
    })
    .filter((x) => x);
  return cleaned;
};

export const getAllSets = async (rCode) => {
  const all = [];
  const chars = Object.keys(shortToLong).map(async (short) => {
    console.log(`downloading ${rCode}...`);
    const sets = await fetchHistory(rCode, short);
    const clean = fixSheet(sets);
    all.push(clean);
  });
  await Promise.all(chars);
  const allChars = all.flat(Infinity);
  return allChars;
};

export const getCharacterSets = async (
  rCode,
  characterShort,
  cached = false
) => {
  if (cached) {
    return heckSets
  }
  const sets = await fetchHistory(rCode, characterShort);
  const clean = fixSheet(sets);
  return clean;
};

// search
// http://ratingupdate.info/api/player_lookup?name=glue%20eater

export const getPlayerData = async (rCode, characterShort) => {
  const url = `http://ratingupdate.info/player/${rCode}/${characterShort}`;
  const resp = await fetch(url);
  const text = await resp.text();
  // const regex = /<p class="title">\s+(?<vip><span class="tag is-warning is-medium">VIP<\/span>)?\s+(?<name>.*?)\s+<span class="tag is-medium"><\/span>/;
  const regex = /<title>(?<title>.*?)<\/title>/;
  try {
    const match = text.match(regex);
    const title = match.groups.title;
    const [name, other] = title.split(" (");
    const character = other.split(")")[0];
    const data = {
      name,
      characterShort,
      character,
      rCode,
    };
    return data;
  } catch (e) {
    console.log(e);
    return {
      text: text,
      error: e.message,
    };
  }
};