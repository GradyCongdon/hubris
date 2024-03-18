"use client";
import {
  DEFAULT_THEME,
  MATCH_LIMIT,
  POLLING_INTERVAL,
  SESSION_TIMEFRAME
} from "@/app/consts";
import { fetchPlayerPage } from "@/app/player/lib";
import { Match, PlayerPage } from "@/app/types";
import { useCallback, useEffect, useState } from "react";
import { BarChart, BarChartSkeleton, formatBar } from "./BarChart";
import { Matches, MatchesSkeleton } from "./Matches";
import { Player, PlayerSkeleton } from "./Player";
import { Session, SessionSkeleton } from "./Session";
import { SessionStats, getSessionStats } from "./SessionStats";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function Main({
  params
}: {
  params: { rCode: string; characterShort: string };
}) {
  const { rCode, characterShort } = params;
  let themeLocalStorage = window && window.localStorage.getItem("theme");
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

  const fetchUpdate = useCallback(() => {
    fetchPlayerPage(rCode, characterShort, MATCH_LIMIT)
      .then((data) => {
        setData(data);
        setStatus("resolved");
      })
      .catch((e) => {
        // skip showing error and keep polling
        console.error(e);
        window.analytics.track("Session Poll Error", {
          r_code: rCode,
          character_short: characterShort,
          error: e.message
        });
      })
      .finally(() => {
        setNextPollMs(Date.now() + POLLING_INTERVAL);
        window.analytics.track("Session Poll", {
          r_code: rCode,
          character_short: characterShort
        });
      });
  }, [rCode, characterShort]);

  const onSessionClick = useCallback(() => {
    if (!active) fetchUpdate();
    setActive(!active);
    setNextPollMs(Date.now() + POLLING_INTERVAL);
    setSessionStartTimestamp(Date.now() - SESSION_TIMEFRAME);
    const actionType = active ? "End" : "Start";
    window.analytics.track(`Session ${actionType}`, {
      r_code: rCode,
      character_short: characterShort
    });
  }, [active, characterShort, fetchUpdate, rCode]);

  useEffect(() => {
    document.documentElement.classList.remove("theme-dark", "theme-light");
    document.documentElement.classList.add("theme-" + theme);
    localStorage.setItem("theme", theme);
    window.analytics.track("Theme Change", { theme });
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
        fetchUpdate();
      }, POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [active, characterShort, fetchUpdate, rCode]);
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
      <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme player-page">
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
  const onMatchClickBuilder = (match: Match) => {
    return () => {
      setSessionStartTimestamp(match.timePeriod.date.getTime());
    };
  };
  try {
    return (
      <main className="min-h-screen max-w-2xl mx-auto text-x-offwhite flex flex-col pt-2 mono-300 container theme player-page">
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
        <Matches
          matches={data.matches}
          onMatchClickBuilder={onMatchClickBuilder}
        />
      </main>
    );
  } catch (e) {
    return <div>{(e as Error).message}</div>;
  }
}
