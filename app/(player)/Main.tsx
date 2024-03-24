"use client";
import { MATCH_LIMIT, POLLING_INTERVAL, SESSION_TIMEFRAME } from "@/app/consts";
import { getPlayerCharacterMatchIndex } from "@/app/api/hubris/actions";
import { Match, PlayerCharacterMatchIndex } from "@/app/api/hubris/types";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { BarChart, BarChartSkeleton, formatBar } from "./BarChart";
import { Matches, MatchesSkeleton } from "./Matches";
import { Player, PlayerSkeleton } from "./Player";
import { Session, SessionSkeleton } from "./Session";
import { SessionStats, getSessionStats } from "./SessionStats";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { setThemeCookie } from "./theme-cookie";

type Props = {
  rCode: string;
  characterShort: string;
  themeCookie: string;
};

export default function Main({ rCode, characterShort, themeCookie }: Props) {
  const [theme, setTheme] = useState(themeCookie);
  const [data, setData] = useState<PlayerCharacterMatchIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("init");
  const [active, setActive] = useState(false);
  const [nextPollMs, setNextPollMs] = useState(Date.now() + POLLING_INTERVAL);
  const [sessionStartTimestamp, setSessionStartTimestamp] = useState(0);

  const fetchUpdate = useCallback(() => {
    getPlayerCharacterMatchIndex(rCode, characterShort, MATCH_LIMIT)
      .then((data: SetStateAction<PlayerCharacterMatchIndex | null>) => {
        setData(data);
        setStatus("resolved");
      })
      .catch((e: Error) => {
        // skip showing error and keep polling
        console.error(e);
        window.analytics.track("Session Poll Error", {
          r_code: rCode,
          character_short: characterShort,
          error: e.message,
        });
      })
      .finally(() => {
        setNextPollMs(Date.now() + POLLING_INTERVAL);
        window.analytics.track("Session Poll", {
          r_code: rCode,
          character_short: characterShort,
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
      character_short: characterShort,
    });
  }, [active, characterShort, fetchUpdate, rCode]);
  useEffect(() => {
    document.documentElement.classList.remove("theme-dark", "theme-light");
    document.documentElement.classList.add("theme-" + theme);
    window.analytics.track("Theme Change", { theme: theme });
    setThemeCookie(theme);
    console.debug("theme change", theme);
  }, [theme]);

  useEffect(() => {
    setStatus("loading");
    console.debug("fetching", rCode, characterShort);
    getPlayerCharacterMatchIndex(rCode, characterShort, MATCH_LIMIT)
      .then((data: SetStateAction<PlayerCharacterMatchIndex | null>) => {
        setData(data);
        setStatus("resolved");
      })
      .catch((e: Error) => {
        setError(e.message);
        setStatus("error");
      });
  }, [rCode, characterShort]);

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        console.debug("polling", rCode, characterShort);
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
        <PlayerSkeleton rCode={rCode} characterShort={characterShort} />
        <BarChartSkeleton />
        <SessionSkeleton />
        <MatchesSkeleton />
      </main>
    );
  }
  if (!data) {
    return <div>No data</div>;
  }

  const stats = getSessionStats(data.matches, sessionStartTimestamp);
  const onMatchClickBuilder = (match: Match) => {
    return () => {
      setSessionStartTimestamp(match.timePeriod.date.getTime());
    };
  };

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
}
