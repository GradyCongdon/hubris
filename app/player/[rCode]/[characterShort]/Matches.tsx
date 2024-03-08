import { Match } from "@/app/types";
import { formatMatch, MatchRow } from "./MatchRow";

export const Matches = ({ matches }: { matches: Match[] }) => {
  const FIXME = matches
    .sort((a, b) => b.timePeriod.date.getTime() - a.timePeriod.date.getTime())
    .slice(0, 100);
  return (
    <section className="">
      {FIXME.map((match: Match) => {
        const props = formatMatch(match);
        return <MatchRow key={props.id} {...props} />;
      })}
    </section>
  );
};
