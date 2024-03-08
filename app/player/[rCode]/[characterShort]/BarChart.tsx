import { Match } from "@/app/types";

type Props = {
  id: string;
  height: string;
  displace: string;
  value: number;
};

export const formatBar = (match: Match) => {
  const height = `${match.record.winPercent}%`;
  const displace = 0 + "px";
  return {
    id: match.timePeriod.dateString,
    height,
    displace,
    value: match.record.winPercent,
  };
};

export const Bar = ({ id, height, displace, value }: Props) => (
  <span
    id={id}
    style={{
      display: "inline-block",
      minHeight: "var(--bar-height)",
      width: "var(--bar-container-width)",
      position: "relative",
    }}
    data-percent={Math.round(value)}
  >
    <span
      style={{
        display: "inline-block",
        fontSize: 0,
        height: `calc(${height} - ${displace})`,
        width: "var(--bar-width)",
        position: "absolute",
        bottom: displace,
        backgroundColor: "var(--accent-color)",
      }}
    ></span>
  </span>
);

export const BarChart = ({ matches }: { matches: Match[] }) => {
  return (
    <div className="bars border-t overflow-hidden">
      {matches.slice(0, 65).map((match: Match) => {
        const bar = formatBar(match);
        return <Bar key={match.id} {...bar} />;
      })}
    </div>
  );
};

export const BarChartSkeleton = () => {
  return (
    <div className="bars border-t overflow-hidden">
      <Bar key="1" id="skeleton" height="0%" displace="0" value={0} />
    </div>
  );
};
