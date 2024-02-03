import { uniq } from "lodash";
import { tabletojson } from "tabletojson";

const shortToLong = {
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
  JC: "Jack-O",
  HA: "Happy Chaos",
  BA: "Baiken",
  TE: "Testament",
  BI: "Bridget",
  SI: "Sin",
  BE: "Bedman",
  AS: "Asuka",
  JN: "Johnny",
  EL: "Elphelt",
};

const longToShort = Object.entries(shortToLong).reduce((acc, [k, v]) => {
  acc[v] = k;
  return acc;
}, {});

const player = async (rCode, characterShort) => {
  const urlTemplate = `http://ratingupdate.info/player/${rCode}/${characterShort}/history`;
  const urls = [0, 100, 200, 300, 400, 500].map(
    (o) => `${urlTemplate}?offset=${o}`
  );
  const texts = await Promise.all(
    urls.map(async (url) => {
      console.log("fetching", url);
      const resp = await fetch(url);
      const text = resp.text();
      return text;
    })
  );
  const allSets = texts.map((text) => tabletojson.convert(text)).flat(Infinity);
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
    const Change = parseFloat(set["Rating change"], 10);
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
    const sets = await player(rCode, short);
    const clean = fixSheet(sets);
    all.push(clean);
  });
  await Promise.all(chars);
  const allChars = all.flat(Infinity);
  return allChars;
};

export const getCharacterSets = async (
  rCode,
  characterShort
) => {
  const sets = await player(rCode, characterShort);
  const clean = fixSheet(sets);
  return clean;
};
