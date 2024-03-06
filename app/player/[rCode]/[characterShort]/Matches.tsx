import { Match } from "@/app/types";
import { formatMatch, MatchRow } from "./MatchRow";

export const Matches = ({ matches }: { matches: Match[] }) => {
  return (
    <section className="">
      {matches.slice(0, 100).map((match: Match) => {
        const props = formatMatch(match);
        return <MatchRow key={props.id} {...props} />;
      })}
    </section>
  );
};
