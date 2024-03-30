"use server";
export type Rating = {
  value: number;
  deviation: number;
}
export const fetchPlayerRating = async (rCode: string) => {
  const data = await fetch(`http://ratingupdate.info/api/player_rating/${rCode}`, {
    next: {
      revalidate: 60,
    },
  });
  const json = await data.json() as Rating[];
  console.log('fetchPlayerRating', rCode);
  return json;
}