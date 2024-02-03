import { getCharacterSets } from "@/app/api/sets/lib";

export async function GET(
  request: Request,
  { params }: { params: { rCode: string; characterShort: string } }
) {
  const sets = await getCharacterSets(
    params.rCode,
    params.characterShort.toUpperCase()
  );
  return Response.json(sets);
}
