import { BarChart, BarChartSkeleton, formatBar } from "./BarChart";
import { Matches, MatchesSkeleton } from "./Matches";
import { Player, PlayerSkeleton } from "./Player";
import { SessionSkeleton } from "./Session";
import { MATCH_LIMIT } from "@/app/consts";
import { getPlayerCharacterMatchIndex } from "@/app/api/hubris/actions";

export const MainServer = async ({
  rCode,
  characterShort,
}: {
  rCode: string;
  characterShort: string;
}) => {
  const data = await getPlayerCharacterMatchIndex(
    rCode,
    characterShort,
    MATCH_LIMIT
  );
  return (
    <main className="min-h-screen max-w-3xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme">
      <Player {...data} />
      <BarChart matches={data.matches} formatter={formatBar} />
      <SessionSkeleton />
      <Matches matches={data.matches} />
    </main>
  );
};
