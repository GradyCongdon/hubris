"use client";
import { Session } from "./Session";
import { Player } from "./Player";
import { fetchPlayerPage } from "@/app/player/lib";
import { BarChart } from "./BarChart";
import { Matches } from "./Matches";
import { useEffect, useState } from "react";
import { PlayerPage } from "@/app/types";

export default function Main({
  params,
}: {
  params: { rCode: string; characterShort: string };
}) {
  const { rCode, characterShort } = params;
  const [data, setData] = useState<PlayerPage | null>(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("init");
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(1);
  useEffect(() => {
    setStatus("loading");
    fetchPlayerPage(rCode, characterShort, count)
      .then((data) => {
        setData(data);
        setStatus("resolved");
      })
      .catch((e) => {
        setError(e);
        setStatus("error");
      });
  }, [rCode, characterShort]);
  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setCount((prev) => prev + 1);
        fetchPlayerPage(rCode, characterShort, count)
          .then((data) => {
            setData(data);
          })
          .catch((e) => {
            setError(e);
          });
      }, 1000);
      return () => clearInterval(interval);
    }
  });
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }
  try {
    return (
      <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme">
        <Player {...data} />
        <BarChart matches={data.matches} />
        <Session active={active} setActive={setActive} />
        <Matches matches={data.matches} />
      </main>
    );
  } catch (e) {
    return <div>{(e as Error).message}</div>;
  }
}
