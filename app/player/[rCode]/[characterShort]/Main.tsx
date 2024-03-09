"use client";
import { Session, SessionSkeleton } from "./Session";
import { Player, PlayerSkeleton } from "./Player";
import { fetchPlayerPage } from "@/app/player/lib";
import { BarChart, BarChartSkeleton } from "./BarChart";
import { Matches, MatchesSkeleton } from "./Matches";
import { useEffect, useState } from "react";
import { PlayerPage } from "@/app/types";
import { POLLING_INTERVAL, MATCH_LIMIT } from "./consts";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function Main({
  params,
}: {
  params: { rCode: string; characterShort: string };
}) {
  const { rCode, characterShort } = params;
  let themeLocalStorage = localStorage.getItem("theme");
  if (!themeLocalStorage) {
    localStorage.setItem("theme", "light");
    themeLocalStorage = "light";
  }
  const [theme, setTheme] = useState(themeLocalStorage);
  const [data, setData] = useState<PlayerPage | null>(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("init");
  const [active, setActive] = useState(false);
  const [nextPollMs, setNextPollMs] = useState(Date.now() + POLLING_INTERVAL);

  useEffect(() => {
    document.documentElement.classList.remove("theme-dark", "theme-light");
    document.documentElement.classList.add("theme-" + theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    setStatus("loading");
    fetchPlayerPage(rCode, characterShort, MATCH_LIMIT)
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
        fetchPlayerPage(rCode, characterShort, MATCH_LIMIT)
          .then((data) => {
            setData(data);
            setStatus("resolved");
          })
          .catch((e) => {
            // skip showing error and keep polling
            console.error(e);
          })
          .finally(() => {
            setNextPollMs(Date.now() + POLLING_INTERVAL);
          });
      }, POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [active, characterShort, rCode]);
  if (error) {
    return (
      <div>
        <h1>error</h1>
        <pre>{JSON.stringify(error, null, " ")}</pre>
      </div>
    );
  }
  if (status === "init" || status === "loading") {
    return (
      <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
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
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
        <Player {...data} />
        <BarChart matches={data.matches} />
        <Session
          active={active}
          setActive={setActive}
          nextPollMs={nextPollMs}
          setNextPollMs={setNextPollMs}
        />
        <Matches matches={data.matches} />
      </main>
    );
  } catch (e) {
    return <div>{(e as Error).message}</div>;
  }
}

