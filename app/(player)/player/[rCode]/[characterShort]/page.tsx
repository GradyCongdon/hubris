import { fetchPlayerCharacterData } from "@/app/api/rating-update/sets/lib";
import Main from "@/app/(player)/Main";
import { cookies } from "next/headers";
import { DEFAULT_THEME } from "@/app/consts";

export async function generateMetadata({
  params,
}: {
  params: { rCode: string; characterShort: string };
}) {
  const player = await fetchPlayerCharacterData(
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
    title: `${params.characterShort} - ${name} - ${params.rCode}`,
    description: `Rating history for ${name} in Guilty Gear Strive`,
  };
}

export default async function Page({
  params,
}: {
  params: { rCode: string; characterShort: string };
}) {
  const { rCode, characterShort } = params;
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("theme")?.value ?? DEFAULT_THEME;

  return (
    <Main
      rCode={rCode}
      characterShort={characterShort}
      themeCookie={themeCookie}
    />
  );
}
