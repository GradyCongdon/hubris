"use client";

import { useEffect, useState } from "react";
import { MatchRow, formatMatch } from "./MatchRow";
import { FAKE_getPlayerMatch } from "@/app/api/rating-update/sets/fake";
import { Match } from "@/app/api/hubris/types";

type Props = {
  active: boolean;
};

export const LiveFeed = ({ active }: Props) => {
  const [matches, setMatches] = useState<Match[]>([]);
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const fakeMatch = FAKE_getPlayerMatch();
      setMatches((prev) => {
        return [fakeMatch.matches[0], ...prev];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [active]);
  return (
    <section>
      {matches.map((match: Match) => {
        const props = formatMatch(match);
        return <MatchRow key={props.id} {...props} />;
      })}
    </section>
  );
};
