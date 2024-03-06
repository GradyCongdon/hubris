import { getPlayerData } from "@/app/api/sets/lib";
import { Session } from "./Session";
import { Player } from "./Player";
import { fetchPlayerPage } from "@/app/player/lib";

import "./Rating.css";
import { BarChart } from "./BarChart";
import { Matches } from "./Matches";

const _heckCode = "2EC3DCA33129F30";
const cached = false;

export async function generateMetadata({
  params,
}: {
  params: { rCode: string; characterShort: string };
}) {
  const player = await getPlayerData(params.rCode, params.characterShort);
  if ("error" in player) {
    return {
      title: "Error",
      description: "Error",
    };
  }
  const { name } = player;
  return {
    title: `${name} - ${params.rCode} - ${params.characterShort}`,
    description: `Rating history for ${name} in Guilty Gear Strive`,
  };
}

export default async function Page({
  params,
}: {
  params: { rCode: string; characterShort: string };
}) {
  const { rCode, characterShort } = params;
  try {
    const data = await fetchPlayerPage(rCode, characterShort);
    return (
      <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme">
        <Player {...data} />
        <BarChart matches={data.matches} />
        <Session />
        <Matches matches={data.matches} />
      </main>
    );
  } catch (e) {
    return <div>{(e as Error).message}</div>;
  }
}
