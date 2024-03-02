import "./Rating.css";
// import sets from './sets.json' with {type: 'json'};
import { getCharacterSets, shortToLong } from "@/app/api/sets/lib";
import { Match } from "./types";

const example = {
  Date: "2024-03-01T04:01:00.000Z",
  _DateString: "2024-03-01T09:01:00.000Z",
  _Date: "2024-03-01T09:01:00.000Z",
  Character: "Ky",
  CharacterShort: "KY",
  Rating: 1602,
  Rating1500: 102,
  Error: 56,
  Min: 1546,
  Max: 1658,
  Wins: 2,
  Losses: 1,
  OpponentCharacter: "Chipp",
  OpponentCharacterShort: "CH",
  OpponentRating: 1296,
  OpponentError: 122,
  OpponentName: "AvocadoGallardo",
  OpponentSystem: "PC",
  Odds: 0.85,
  OddsFactor: 0,
  Change: -2.1,
  GameCount: 1,
  RCode: "2EC3DCA33129F30",
  Name: "oval",
  Outcome: 1,
};

const blocks = " ▁▂▃▄▅▆▇█".split("");
function scaleConvert(
  number: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
// // maps win percent to a block text based on the blocks array length
// const getClosestBlock = (value) => {
//   const converted = scaleConvert(value, 0, 100, 0, blocks.length - 1);
//   const index = Math.floor(converted);
//   console.log(index, converted, value, blocks[index]);
//   return blocks[index];
// };

// postive is blue and negative is red scaled from -20 to 20
const rgbScale = (value: number, min: number, max: number, opacity = 1) => {
  // if (Math.abs(value) < 1) return "rgba(255, 255, 255, 0)";
  const range = max - min;
  const scaled = (value - min) / range;
  const r = Math.floor(255 * (1 - scaled));
  const b = Math.floor(255 * scaled);
  const g = 0;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const heckCode = "2EC3DCA33129F30";

export async function generateMetadata({
  params,
}: {
  params: { name: string; rCode: string; characterShort: string };
}) {
  return {
    title: `${params.name} - ${params.rCode} - ${params.characterShort}`,
    description: `Rating history for ${params.name} in Guilty Gear Strive`,
  };
}

export default async function Page({
  params,
}: {
  params: { name: string; rCode: string; characterShort: string };
}) {
  const { name, rCode, characterShort } = params;
  const sets = await getCharacterSets(rCode, characterShort);
  const rating = sets[0].Rating;
  const error = sets[0].Error;
  const gameCount = sets.reduce(
    (acc: { wins: any; losses: any }, s: { Wins: any; Losses: any }) => {
      acc.wins += s.Wins;
      acc.losses += s.Losses;
      return acc;
    },
    { wins: 0, losses: 0 }
  );
  const ratingClass = "text-full-width-" + error.toString().length;
  const maxHeight = 38;
  const nameLength = name.length;
  const nameClass = nameLength > 16 ? "rt-sm" : "rt-md";

  return (
    <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container bw theme">
      <h1 className={`${ratingClass} mx-auto leading-none -mb-1`}>
        {rating}
        <span className="mono-100 text-full-width-sm">±{error}</span>
      </h1>
      <div className="container player-meta divide-x border-t">
        <h2 className="rt-rc text-left pl-2">{rCode}</h2>
        <div
          className="theme-invert flex align-middle justify-end"
          style={{ alignItems: "center", height: "100%" }}
        >
          <h2 className={`${nameClass} text-right align-middle pr-2`}>
            {name.slice(0, 22)}
          </h2>
        </div>
      </div>
      <div className="container player-meta divide-x border-t">
        <h2 className="rt-md pl-2 flex justify-between">
          {shortToLong[characterShort as keyof typeof shortToLong]}
        </h2>
        <h2 className="rt-md text-right pr-2">
          {gameCount.wins}W:{gameCount.losses}L
        </h2>
      </div>
      <div
        className="border-t overflow-hidden"
        style={{
          maxHeight: maxHeight + "px",
        }}
      >
        {sets.map((s: any) => {
          const wins = s.Wins;
          const losses = s.Losses;
          const total = wins + losses;
          const winPercent = (wins / total) * 100;
          const height = scaleConvert(winPercent, 0, 100, 0, maxHeight);
          const displace = 0;
          return (
            <span
              key={s.Date}
              style={{
                display: "inline-block",
                minHeight: maxHeight + "px",
                width: "8px",
                position: "relative",
              }}
              data-percent={Math.round(winPercent)}
              // onClick={() => (window.location.hash = s.Date)}
            >
              <span
                style={{
                  display: "inline-block",
                  fontSize: 0,
                  height: height - displace + "px",
                  width: "7.25px",
                  position: "absolute",
                  bottom: displace + "px",
                  backgroundColor: "var(--accent-color)",
                }}
              ></span>
            </span>
          );
        })}
      </div>

      <section className="">
        {sets.map((s: Match) => {
          // const pRating = `${g.Rating}±${g.Error}`;
          // const oRating = `${g.OpponentRating}±${g.OpponentError}`;
          const pRating = s.Rating;
          const oRating = s.OpponentRating;
          const isNegative = s.Change < 0;
          const isDecimal = s.Change.toString().match(/\./);
          const changeAbsolute = Math.abs(s.Change);
          const isLarge = changeAbsolute >= 100;
          const _change = `${isNegative ? "" : "+"}${s.Change}${
            isDecimal ? "" : ".0"
          }`;
          const change = isLarge ? _change.split(".")[0] : _change;
          const record = `${s.Wins} - ${s.Losses}`;
          const _date = new Date(s.Date).getTime();
          const date = new Date(_date - new Date().getTimezoneOffset() * 60000);
          const timestamp = date
            .toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })
            .replace(",", "");
          const isLongName =
            s.OpponentName.length + s.OpponentCharacter.length > 21;
          const opponent = isLongName
            ? `${s.OpponentName} (${s.OpponentCharacterShort})`
            : `${s.OpponentName} (${s.OpponentCharacter})`;

          return (
            <div
              key={timestamp}
              id={s.Date}
              className="set border-b divide-x mono-300"
            >
              <div className="container rating rt-md text-center">
                {pRating}
              </div>
              <div className="container change rt-sm text-center relative">
                <div
                  className="change-bg"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-1px",
                    right: "-1px",
                    bottom: 0,
                    // height: "8px",
                    zIndex: 100,
                    background: rgbScale(s.Change, s.Error / -6, s.Error / 6),
                    // color: changeAbsolute < 1 ? "currentColor" : "white"
                  }}
                ></div>
                <span
                  className="value"
                  style={{ position: "relative", zIndex: 101, left: "-2px" }}
                >
                  {change}
                </span>
              </div>
              <div className="container rating rt-md text-center">
                {oRating}
              </div>
              <div className="container set-meta">
                <div className="border-b opponent-name">
                  <div
                    className={`container pl-1 theme-invert overflow-hidden rt-${
                      isLongName ? "lg" : "lg"
                    }`}
                  >
                    {opponent}
                  </div>
                </div>
                <div className="container border-r rt-xl text-center">
                  {record}
                </div>
                <div className="">
                  <div className="container rt-md text-center">{timestamp}</div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
