import { Match, PlayerPage } from "@/app/types";
import { formatChange } from "../../utils";
import "./SessionStats.css";

export const getSessionStats = (
  data: PlayerPage,
  sessionStartTimestamp: number
) => {
  const sessionMatches = data.matches.filter(
    (match) => match.timePeriod.date.getTime() >= sessionStartTimestamp
  );
  const stats = sessionMatches.reduce(
    (session, match) => {
      session.wins += match.record.wins;
      session.losses += match.record.losses;
      session.change += match.rating.change;
      return session;
    },
    {
      wins: 0,
      losses: 0,
      total: sessionMatches.length,
      matches: sessionMatches,
      change: 0,
      changeRGB: "",
      changeFormatted: ""
    }
  );
  const rgb = stats.change >= 0 ? "blue" : "red";
  stats.changeRGB = rgb;
  stats.changeFormatted = formatChange(stats.change);
  return stats;
};

type Props = {
  changeFormatted: string;
  changeRGB: string;
  sessionMatches: Match[];
};
export const SessionStats = ({
  changeFormatted,
  changeRGB,
  sessionMatches
}: Props) => {
  const gameStats = {
    wins: 0,
    losses: 0,
    total: sessionMatches.length
  };
  const games = sessionMatches.flatMap((match) => {
    const wins = new Array(match.record.wins).fill({
      key: match.timePeriod.dateString,
      backgroundColor: "blue"
    });
    gameStats.wins += match.record.wins;
    const losses = new Array(match.record.losses).fill({
      key: match.timePeriod.dateString,
      backgroundColor: "red"
    });
    gameStats.losses += match.record.losses;
    return [...wins, ...losses];
  });

  return (
    <div className="session-stats border-t">
      <div
        className="flex align-center justify-center rt-md"
        style={{ backgroundColor: changeRGB, color: "white" }}
      >
        {changeFormatted}
      </div>
      <div className="flex align-center justify-center border-r ml-1 rt-md">
        {gameStats.wins}W:{gameStats.losses}L
      </div>
      <div className="session-chart">
        {games.map((game) => (
          <div
            key={game.key}
            style={{
              width: "4px",
              height: "100%",
              backgroundColor: game.backgroundColor
            }}
          />
        ))}
      </div>
    </div>
  );
};
