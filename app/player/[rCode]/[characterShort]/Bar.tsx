import { Match } from "../../../types";

export const formatBar = (s: Match) => {
  const wins = s.Wins;
  const losses = s.Losses;
  const total = wins + losses;
  const winPercent = (wins / total) * 100;
  const height = `${winPercent}%`;
  const displace = 0 + "px";
  return {
    id: s.Date,
    height,
    displace,
    winPercent
  };
};

type Props = {
  id: string;
  height: string;
  displace: string;
  winPercent: number;
};
export const Bar = ({ id, height, displace, winPercent }: Props) => (
  <span
    id={id}
    style={{
      display: "inline-block",
      minHeight: "var(--bar-height)",
      width: "var(--bar-container-width)",
      position: "relative"
    }}
    data-percent={Math.round(winPercent)}
  >
    <span
      style={{
        display: "inline-block",
        fontSize: 0,
        height: `calc(${height} - ${displace})`,
        width: "var(--bar-width)",
        position: "absolute",
        bottom: displace,
        backgroundColor: "var(--accent-color)"
      }}
    ></span>
  </span>
);
