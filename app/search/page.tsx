"use client";
import { useState } from "react";
import { search } from "../api/hubris/search/lib";
import { Rating } from "../api/hubris/types";

export default function Page() {
  const [results, setResults] =
    useState<Record<string, PlayerCharactersIndex>>();
  const [name, setName] = useState<string>("");
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await search(name);
    console.log(results);
    setResults(results);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  return (
    <div>
      <h1>Search</h1>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="player name" onChange={onChange} />
        <button type="submit">Search</button>
      </form>
      <div>
        {results &&
          Object.entries(results).map(([rCode, playerCharacterIndex]) => (
            <div key={rCode}>
              <h2>{playerCharacterIndex.player.name}</h2>
              <h3>{rCode}</h3>
              <div>
                {Object.entries(playerCharacterIndex.characterRatings).map(
                  ([shortCode, rating]) => (
                    <div key={shortCode}>
                      <h4>{shortCode}</h4>
                      <p>Value: {(rating as Rating).value}</p>
                      <p>Deviation: {(rating as Rating).deviation}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
