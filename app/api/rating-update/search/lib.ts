export type SearchResult = {
  name: string;
  platform: string;
  vip_status: string;
  cheater_status: null | string;
  hidden_status: null | string;
  id: string;
  character: string;
  character_short: string;
  rating_value: number;
  rating_deviation: number;
  game_count: number;
}
export const search = async (name: string): Promise<SearchResult[]>=> {
  const params = new URLSearchParams();
  params.append('name', name);

  const url = `http://ratingupdate.info/api/search?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 180 } });
  const data = await res.json();
  console.log(url, name);
  return data;
}
