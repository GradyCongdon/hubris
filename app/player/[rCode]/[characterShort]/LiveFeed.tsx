"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/app/types";
import { MatchRow, formatMatch } from "./MatchRow";
import { getSet } from "@/app/api/sets/fake";

type Props = {
  active: boolean;
};

export const LiveFeed = ({ active }: Props) => {
  const [sets, setSets] = useState<Match[]>([]);
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const _set = getSet();
      setSets((prev) => {
        return [_set, ...prev];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [active]);
  return (
    <section>
      {sets.map((s: Match) => {
        const props = formatMatch(s);
        return <MatchRow key={props.id} {...props} />;
      })}
    </section>
  );
};
