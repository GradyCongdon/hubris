import { formatChange, rgbScale } from "@/app/player/utils";
import { Match } from "@/app/types";

export const formatMatch = (match: Match): Props => {
  const { value: rating, error, change } = match.rating;

  const changeFormatted = formatChange(change);
  const rgb = rgbScale(change, error / -6, error / 6);
  const record = `${match.record.wins} - ${match.record.losses}`;
  const _date = match.timePeriod.date.getTime();
  const date = new Date(_date - new Date().getTimezoneOffset() * 60000);
  const timestamp = date
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    })
    .replace(",", "");
  const { name: oName } = match.opponent.player;
  const { name: oCharacter, shortCode: oShortCode } = match.opponent.character;
  const isLongName = oName.length + oCharacter.length >= 21;
  const opponentName = isLongName
    ? `${oName} (${oShortCode})`
    : `${oName} (${oCharacter})`;
  const oRating = match.opponent.rating.value;

  return {
    id: match.id,
    playerRating: rating,
    change: changeFormatted,
    opponentRating: oRating,
    opponentName: opponentName,
    record: record,
    timestamp,
    rgb,
    onClick: () => {}
  };
};

type Props = {
  id: string;
  playerRating: number;
  change: string;
  opponentRating: number;
  opponentName: string;
  record: string;
  timestamp: string;
  rgb: string;
  onClick: () => void;
};
export const MatchRow = ({
  id,
  playerRating,
  change,
  opponentRating,
  opponentName,
  record,
  timestamp,
  rgb,
  onClick
}: Props) => (
  <div id={id} className="set border-b mono-300" onClick={onClick}>
    <div className="container rating rt-md text-center">{playerRating}</div>
    <div className="container change rt-sm text-center relative">
      <div
        className="change-bg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          background: rgb
        }}
      ></div>
      <span
        className="value"
        style={{ position: "relative", zIndex: 101, left: "-2px" }}
      >
        {change}
      </span>
    </div>
    <div className="container rating rt-md text-center">{opponentRating}</div>
    <div className="container set-meta border-l">
      <div className="border-b opponent-name">
        <div className={`container pl-1 theme-invert overflow-hidden rt-op`}>
          {opponentName}
        </div>
      </div>
      <div className="container border-r rt-xl text-center">{record}</div>
      <div className="">
        <div className="container rt-md text-center">{timestamp}</div>
      </div>
    </div>
  </div>
);

export const MatchRowSkeleton = () => (
  <div className="set border-b mono-300">
    <div className="container rating rt-md text-center"></div>
    <div className="container change rt-sm text-center relative">
      <div
        className="change-bg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100
        }}
      ></div>
      <span
        className="value"
        style={{ position: "relative", zIndex: 101, left: "-2px" }}
      ></span>
    </div>
    <div className="container rating rt-md text-center"></div>
    <div className="container set-meta border-l">
      <div className="border-b opponent-name">
        <div
          className={`container pl-1 theme-invert overflow-hidden rt-op`}
          style={{ minHeight: "var(--set-grid-height-2)" }}
        ></div>
      </div>
      <div className="container border-r rt-xl text-center"></div>
      <div className="">
        <div className="container rt-md text-center"></div>
      </div>
    </div>
  </div>
);
