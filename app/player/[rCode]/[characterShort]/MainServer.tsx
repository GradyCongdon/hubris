import { fetchPlayerPage } from "../../lib";
import { BarChart, BarChartSkeleton, formatBar } from "./BarChart";
import { Matches, MatchesSkeleton } from "./Matches";
import { Player, PlayerSkeleton } from "./Player";
import { SessionSkeleton } from "./Session";

export const MainServer = async ({
  rCode,
  characterShort
}: {
  rCode: string;
  characterShort: string;
}) => {
  const data = await fetchPlayerPage(rCode, characterShort, Infinity);
  return (
    <main className="min-h-screen max-w-3xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme">
      <Player {...data} />
      <BarChart matches={data.matches} formatter={formatBar} />
      <SessionSkeleton />
      <Matches matches={data.matches} />
    </main>
  );
};

export const MainSkeleton = () => {
  return (
    <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme">
      Skelet
      <PlayerSkeleton />
      <BarChartSkeleton />
      <SessionSkeleton />
      <MatchesSkeleton />
    </main>
  );
};
