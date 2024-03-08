"use client";
import { Session, SessionSkeleton } from "./Session";
import { Player, PlayerSkeleton } from "./Player";
import { fetchPlayerPage } from "@/app/player/lib";
import { BarChart, BarChartSkeleton } from "./BarChart";
import { Matches, MatchesSkeleton } from "./Matches";
import { useEffect, useState } from "react";
import { PlayerPage } from "@/app/types";

const TIME = 600;
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
  const [count, setCount] = useState(Infinity);
  const [timer, setTimer] = useState(TIME);
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
  }, [rCode, characterShort, count]);
  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setCount((prev) => prev + 1);
        fetchPlayerPage(rCode, characterShort, count)
          .then((data) => {
            setData(data);
            setTimer(TIME);
          })
          .catch((e) => {
            setError(e);
            setTimer(TIME);
          });
      }, 1000 * 60);
      return () => clearInterval(interval);
    }
  }, [active, characterShort, count, rCode]);
  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [active]);
  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (status === "init" || status === "loading") {
    return (
      <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme">
        <PlayerSkeleton />
        <BarChartSkeleton />
        <SessionSkeleton />
        <MatchesSkeleton />
      </main>
    );
  }
  if (!data) {
    return <div>No data</div>;
  }
  try {
    return (
      <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme">
        <Player {...data} />
        <BarChart matches={data.matches} />
        <Session active={active} setActive={setActive} timer={timer} />
        <Matches matches={data.matches} />
      </main>
    );
  } catch (e) {
    return <div>{(e as Error).message}</div>;
  }
}
