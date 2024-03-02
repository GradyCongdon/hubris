import { getPlayerData } from "@/app/api/sets/lib";

export async function GET(
  request: Request,
  { params }: { params: { rCode: string, characterShort: string } }
) {
  const data = await getPlayerData(params.rCode, params.characterShort);
  return Response.json(data);
}
