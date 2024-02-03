import { getAllSets } from "@/app/api/sets/lib";

export async function GET(
  request: Request,
  { params }: { params: { rCode: string } }
) {
  const rcode = params.rCode;
  const sets = await getAllSets(rcode);
  return Response.json(sets);
}
