import { getPlayerCharacterData } from "@/app/api/rating-update/sets/lib";

export async function GET(
  request: Request,
  { params }: { params: { rCode: string, characterShort: string } }
) {
  const data = await getPlayerCharacterData(params.rCode, params.characterShort);
  return Response.json(data);
}
