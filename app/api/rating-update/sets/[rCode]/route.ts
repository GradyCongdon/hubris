import { fetchAllSets } from "@/app/api/rating-update/sets/lib";

export async function GET(
  request: Request,
  { params }: { params: { rCode: string } }
) {
  const rcode = params.rCode;
  const sets = await fetchAllSets(rcode);
  return Response.json(sets);
}
