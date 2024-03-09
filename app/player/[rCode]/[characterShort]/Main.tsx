"use client";
import { DEFAULT_THEME, MATCH_LIMIT, POLLING_INTERVAL, SESSION_TIMEFRAME } from "@/app/consts";
import { fetchPlayerPage } from "@/app/player/lib";
import { PlayerPage } from "@/app/types";
import { useCallback, useEffect, useState } from "react";
import { BarChart, BarChartSkeleton, formatBar } from "./BarChart";
import { Matches, MatchesSkeleton } from "./Matches";
import { Player, PlayerSkeleton } from "./Player";
import { Session, SessionSkeleton } from "./Session";
import { SessionStats, getSessionStats } from "./SessionStats";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function Main({
  params,
}: {
  params: { rCode: string; characterShort: string };
}) {
  const { rCode, characterShort } = params;
  let themeLocalStorage = localStorage.getItem("theme");
  if (!themeLocalStorage) {
    localStorage.setItem("theme", DEFAULT_THEME);
    themeLocalStorage = DEFAULT_THEME;
  }
  const [theme, setTheme] = useState(themeLocalStorage);
  const [data, setData] = useState<PlayerPage | null>(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("init");
  const [active, setActive] = useState(false);
  const [nextPollMs, setNextPollMs] = useState(Date.now() + POLLING_INTERVAL);
  const [sessionStartTimestamp, setSessionStartTimestamp] = useState(0);
  const onSessionClick = useCallback(() => {
    setActive(!active);
    setNextPollMs(Date.now() + POLLING_INTERVAL);
    setSessionStartTimestamp(Date.now() - SESSION_TIMEFRAME);
  }, [active]);

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
  const stats = getSessionStats(data, sessionStartTimestamp);
  try {
    return (
      <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
        <Player {...data} />
        {active ? (
          <SessionStats
            changeFormatted={stats.changeFormatted}
            changeRGB={stats.changeRGB}
            sessionMatches={stats.matches}
          />
        ) : (
          <BarChart matches={data.matches} formatter={formatBar} />
        )}
        <Session
          active={active}
          nextPollMs={nextPollMs}
          onClick={onSessionClick}
        />
        <Matches matches={data.matches} />
      </main>
    );
  } catch (e) {
    return <div>{(e as Error).message}</div>;
  }
}
