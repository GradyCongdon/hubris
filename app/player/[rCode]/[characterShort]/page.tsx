import { getPlayerData } from "@/app/api/sets/lib";

// import "./Rating.css";
import Main from "./Main";
import { Suspense } from "react";
import { MainServer, MainSkeleton } from "./MainServer";

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
  return <Main params={params} />;
}
