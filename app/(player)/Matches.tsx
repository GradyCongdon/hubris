import { Match } from "@/app/api/hubris/types";
import { formatMatch, MatchRow, MatchRowSkeleton } from "./MatchRow";

export const Matches = ({
  matches,
  onMatchClickBuilder,
}: {
  matches: Match[];
  onMatchClickBuilder?: (match: Match) => () => void;
}) => {
  const FIXME = matches
    .sort((a, b) => b.timePeriod.date.getTime() - a.timePeriod.date.getTime())
    .slice(0, 100);
  return (
    <section className="">
      {FIXME.map((match: Match) => {
        const props = formatMatch(match);
        const onClick = onMatchClickBuilder && onMatchClickBuilder(match);
        return <MatchRow key={props.id} {...props} onClick={onClick} />;
      })}
    </section>
  );
};

export const MatchesSkeleton = () => {
  const matches = Array.from({ length: 15 }, (_, i) => i);

  return (
    <section className="">
      {matches.map((match) => (
        <MatchRowSkeleton key={match} />
      ))}
    </section>
  );
};
