import { formatChange, rgbScale } from "@/app/(player)/utils";
import { Character, Match, Player } from "@/app/api/hubris/types";
import { ReactNode } from "react";

const getIdentifier = (player: Player, _character: Character) => {
  const { name: playerName } = player;
  const { name: characterName, shortCode } = _character;

  const isHidden = playerName === "(Hidden)";
  if (isHidden) {
    return (
      <span>
        <i>Hidden</i> ({characterName})
      </span>
    );
  }
  const isLongName = playerName.length + characterName.length >= 21;
  const identifier = isLongName
    ? `${playerName} (${shortCode})`
    : `${playerName} (${characterName})`;
  return identifier;
};

export const formatMatch = (match: Match): Props => {
  const { value: rating, deviation, change } = match.rating;

  const changeFormatted = formatChange(change);
  const rgb = rgbScale(change, deviation / -6, deviation / 6);
  const record = `${match.record.wins} - ${match.record.losses}`;
  const _date = match.timePeriod.date.getTime();
  const date = new Date(_date);
  const timestamp = date
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .replace(",", "")
    .replace(" at ", " ");
  const opponentIdentifier = getIdentifier(
    match.opponent.player,
    match.opponent.character
  );
  const oRating = match.opponent.rating.value;
  const opponentRating = oRating === 0 ? "????" : oRating.toString();
  const playerRating = rating.toString();

  return {
    id: match.id,
    playerRating,
    change: changeFormatted,
    opponentRating,
    opponentIdentifier: opponentIdentifier,
    record: record,
    timestamp,
    rgb,
  };
};

type Props = {
  id: string;
  playerRating: ReactNode;
  change: ReactNode;
  opponentRating: ReactNode;
  opponentIdentifier: ReactNode;
  record: ReactNode;
  timestamp: ReactNode;
  rgb: string;
  onClick?: () => void;
};
export const MatchRow = ({
  id,
  playerRating,
  change,
  opponentRating,
  opponentIdentifier,
  record,
  timestamp,
  rgb,
  onClick,
}: Props) => (
  <div id={id} className="set border-b mono-300" onClick={onClick}>
    <div className="container rating rt-md text-center">{playerRating}</div>
    <div className="container change rt-sm text-center relative">
      <div
        className="change-bg"
        style={{
          background: rgb,
        }}
      ></div>
      <span className="change-value" style={{ left: "-2px" }}>
        {change}
      </span>
    </div>
    <div className="container rating rt-md text-center">{opponentRating}</div>
    <div className="container set-meta border-l">
      <div className="border-b opponent-name">
        <div className={`container pl-1 theme-invert overflow-hidden rt-op`}>
          {opponentIdentifier}
        </div>
      </div>
      <div className="container border-r rt-xl text-center">{record}</div>
      <div className="container rt-md text-center">{timestamp}</div>
    </div>
  </div>
);

const Blank = <span className="invisible">????</span>;

export const MatchRowSkeleton = () => {
  return (
    <MatchRow
      id="123"
      playerRating={Blank}
      opponentIdentifier={Blank}
      record={Blank}
      opponentRating={Blank}
      change={Blank}
      timestamp={Blank}
      rgb="rgb(0, 0, 255)"
    />
  );
};
