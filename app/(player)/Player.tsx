import type { PlayerCharacterMatchIndex } from "@/app/api/hubris/types";
import { shortKey, shortToLong } from "../api/character";

export const Player = (props: PlayerCharacterMatchIndex) => {
  const { player, character, rating, matches } = props;
  const { name, rCode } = player;
  const ratingClass = "text-full-width-" + rating.error.toString().length;
  const nameLength = name.length;
  const nameClass = nameLength > 16 ? "rt-sm" : "rt-md";
  const nameLimited = name.slice(0, 22);
  const gameCount = matches.reduce(
    (acc, match) => {
      acc.wins += match.record.wins;
      acc.losses += match.record.losses;
      return acc;
    },
    { wins: 0, losses: 0 }
  );
  return (
    <>
      <h1 className={`${ratingClass} mx-auto leading-none -mb-1`}>
        {rating.value}
        <span className="mono-100 text-full-width-sm">±{rating.error}</span>
      </h1>
      <div className="container player-meta divide-x border-t">
        <h2 className="rt-rc text-left pl-2 md:pl-2">{rCode}</h2>
        <div
          className="theme-invert flex align-middle justify-end pr-2 md:pr-2"
          style={{ alignItems: "center", height: "100%" }}
        >
          <h2 className={`${nameClass} text-right align-middle `}>
            {nameLimited}
          </h2>
        </div>
      </div>
      <div className="container player-meta divide-x border-t ">
        <h1 className="rt-md pl-2 md:pl-2  flex justify-between">
          {character.name}
        </h1>
        <h2 className="rt-md text-right pr-2 md:pr-2">
          {gameCount.wins}W:{gameCount.losses}L
        </h2>
      </div>
    </>
  );
};

type SkeletonProps = {
  rCode: string;
  characterShort: string;
};
export const PlayerSkeleton = ({ rCode, characterShort }: SkeletonProps) => {
  return (
    <>
      <h1 className={`text-full-width-2 mx-auto leading-none -mb-1`}>
        <span style={{ opacity: 0 }}>2000</span>
      </h1>
      <div className="container player-meta divide-x border-t">
        <h2 className="rt-rc text-left pl-2 md:pl-2">{rCode}</h2>
        <div
          className="theme-invert flex align-middle justify-end pr-2 md:pr-2"
          style={{ alignItems: "center", height: "100%" }}
        >
          <h2 className={`text-right align-middle `}></h2>
        </div>
      </div>
      <div className="container player-meta divide-x border-t ">
        <h1 className="rt-md pl-2 md:pl-2  flex justify-between">
          {shortToLong[characterShort as shortKey]}
        </h1>
        <h2 className="rt-md text-right pr-2 md:pr-2"></h2>
      </div>
    </>
  );
};
