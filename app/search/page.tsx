"use client";
import { useState } from "react";
import { search } from "../api/hubris/search/lib";
import { PlayerCharactersIndex, Rating } from "../api/hubris/types";
import { shortKey, shortToLong } from "../api/character";
import { formatRating } from "../(player)/utils";
import Link from "next/link";
import { EXAMPLE } from "../consts";
import { exampleSearch } from "../api/hubris/example";
import { set } from "lodash";

const byRating = ([, a]: [string, Rating], [, b]: [string, Rating]) =>
  b.value - b.deviation - (a.value - a.deviation);

const defaultSearch = EXAMPLE ? exampleSearch : {};

const FullMessage = ({ children }: { children: React.ReactNode }) => (
  <h2 className="min-h-screen justify-center flex items-center">{children}</h2>
);

export default function Page() {
  const [results, setResults] =
    useState<Record<string, PlayerCharactersIndex>>(defaultSearch);
  const [name, setName] = useState<string>("");
  const [state, setState] = useState<string>("init");
  const onSubmit = async (e: React.FormEvent) => {
    setState("loading");
    e.preventDefault();
    try {
      const results = await search(name);
      setResults(results);
      setState("resolved");
      console.log(results);
    } catch (e) {
      console.error(e);
      setState("error");
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const submit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit(e as any);
    }
  };
  const entries = Object.entries(results);
  return (
    <div className="max-w-3xl m-auto p-8">
      <form
        onSubmit={onSubmit}
        onKeyDown={submit}
        className="flex justify-center"
      >
        <input
          type="text"
          placeholder="player name"
          onChange={onChange}
          className="p-2 rounded border input"
        />
        <button type="submit" className="ml-2 p-2 rounded-full button">
          Search
        </button>
      </form>
      <div>
        {state === "loading" && <FullMessage>Loading...</FullMessage>}
        {state === "error" && <FullMessage>Error</FullMessage>}
        {state === "resolved" && !entries.length && (
          <FullMessage>No results</FullMessage>
        )}
        {state === "resolved" && entries.length && (
          <h2>Matches: {entries.length}</h2>
        )}
      </div>
      <div>
        {results &&
          entries.map(([rCode, playerCharacterIndex]) => (
            <div key={rCode}>
              <div className="mb-6 flex items-baseline justify-between mt-8">
                <h2 className="text-4xl">{playerCharacterIndex.player.name}</h2>
                <h3 className="text-lg">{rCode}</h3>
              </div>
              <div className="ml-4 gap-4 flex flex-col">
                {Object.entries(playerCharacterIndex.characterRatings)
                  .sort(byRating)
                  .map(([shortCode, rating]) => (
                    <Link
                      key={shortCode}
                      className="flex p-4 shadow-md justify-between border"
                      style={{ borderRadius: "4px" }}
                      href={`/player/${rCode}/${shortCode}`}
                    >
                      <h4>{shortToLong[shortCode as shortKey]}</h4>
                      <p className="justify-end">
                        {formatRating(rating as Rating)}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
