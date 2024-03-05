import {
  getCharacterSets,
  getPlayerData,
  shortToLong
} from "@/app/api/sets/lib";
import { Bar, formatBar } from "./Bar";
import { MatchRow, formatMatch } from "./MatchRow";
import "./Rating.css";
import { Match } from "./types";

const _heckCode = "2EC3DCA33129F30";
const cached = false;

export async function generateMetadata({
  params
}: {
  params: { name: string; rCode: string; characterShort: string };
}) {
  return {
    title: `${decodeURIComponent(params.name)} - ${params.rCode} - ${
      params.characterShort
    }`,
    description: `Rating history for ${params.name} in Guilty Gear Strive`
  };
}

export default async function Page({
  params
}: {
  params: { rCode: string; characterShort: string };
}) {
  const { rCode, characterShort } = params;
  const [player, sets] = await Promise.all([
    getPlayerData(rCode, characterShort),
    getCharacterSets(rCode, characterShort, cached)
  ]);
  if ("error" in player) {
    return <div>{player.error}</div>;
  }
  const name = player.name;
  const rating = Math.round(sets[0].Rating + sets[0].Change);
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
  const nameLength = name.length;
  const nameClass = nameLength > 16 ? "rt-sm" : "rt-md";

  return (
    <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme">
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
      <div className="bars border-t overflow-hidden">
        {sets.map((s: Match) => {
          const props = formatBar(s);
          return <Bar key={props.id} {...props} />;
        })}
      </div>

      <section className="">
        {sets.map((s: Match) => {
          const props = formatMatch(s);
          return <MatchRow key={props.id} {...props} />;
        })}
      </section>
    </main>
  );
}
