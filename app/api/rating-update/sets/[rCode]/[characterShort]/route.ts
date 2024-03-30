import { fetchCharacterSets } from "@/app/api/rating-update/sets/lib";

export async function GET(
  request: Request,
  { params }: { params: { rCode: string; characterShort: string } }
) {
  const sets = await fetchCharacterSets(
    params.rCode,
    params.characterShort.toUpperCase()
  );
  return Response.json(sets);
}
