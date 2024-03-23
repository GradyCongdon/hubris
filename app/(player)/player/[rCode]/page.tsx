import { getPlayerCharacterData } from "@/app/api/rating-update/sets/lib";
import Main from "@/app/(player)/Main";

export async function generateMetadata({
  params,
}: {
  params: { rCode: string; characterShort: string };
}) {
  const player = await getPlayerCharacterData(
    params.rCode,
    params.characterShort
  );
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
