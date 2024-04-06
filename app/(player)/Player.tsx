import type { PlayerCharacterMatchIndex } from "@/app/api/hubris/types";
import { shortKey, shortToLong } from "@/app/api/character";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCharacterRatings } from "@/app/api/hubris/player/[rCode]/characters/lib";

export const Player = (props: PlayerCharacterMatchIndex) => {
  const { player, character, rating, matches } = props;
  const { name, rCode } = player;
  const ratingClass = "text-full-width-" + rating.deviation.toString().length;
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
        <span className="mono-100 text-full-width-sm">±{rating.deviation}</span>
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
        <div className="rt-md pl-2 md:pl-2 flex justify-between">
          <CharacterSelect rCode={rCode} characterShort={character.shortCode} />
        </div>
        <h2 className="rt-md text-right pr-2 md:pr-2">
          {gameCount.wins}W:{gameCount.losses}L
        </h2>
      </div>
    </>
  );
};

type CharacterRating = {
  value: number;
  deviation: number;
  name: string;
  characterShort: string;
};
const usePlayedCharacters = (rCode: string) => {
  const [characters, setCharacters] = useState<CharacterRating[]>([]);
  useEffect(() => {
    const fetchCharacters = async () => {
      const ratings = await getCharacterRatings(rCode);
      const usedCharacters: CharacterRating[] = [];
      Object.entries(ratings).forEach(([k, v]) => {
        if (v.value !== 1500 && v.deviation !== 350)
          usedCharacters.push({
            value: v.value,
            deviation: v.deviation,
            name: shortToLong[k as shortKey],
            characterShort: k,
          });
      });
      setCharacters(usedCharacters);
    };
    fetchCharacters();
  }, [rCode]);
  return characters;
};

const CharacterSelect = ({
  rCode,
  characterShort,
}: {
  rCode: string;
  characterShort: string;
}) => {
  const router = useRouter();
  const usedCharacters = usePlayedCharacters(rCode);
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/player/${rCode}/${e.target.value}`);
  };

  return (
    <select
      className="rt-md pl-2 md:pl-2  flex justify-between character-select"
      onChange={onChange}
      value={characterShort}
    >
      {usedCharacters.map(
        ({ characterShort: short, name, value, deviation }) => {
          return (
            <option
              key={short}
              value={short}
              selected={short === characterShort}
            >
              {name} {short === characterShort ? "" : `(${value}±${deviation})`}
            </option>
          );
        }
      )}
    </select>
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
        <select className="rt-md pl-2 md:pl-2  flex justify-between character-select">
          {Object.entries(shortToLong).map(([short, long]) => {
            return (
              <option key={short} selected={characterShort === short}>
                {long}
              </option>
            );
          })}
        </select>
        <h2 className="rt-md text-right pr-2 md:pr-2"></h2>
      </div>
    </>
  );
};
