import { rgbScale } from "@/app/rating/utils";
import { Match as MatchType } from "./types";

type Props = {
  id: string;
  pRating: number;
  oRating: number;
  change: string;
  opponent: string;
  record: string;
  timestamp: string;
  rgb: string;
};

export const formatMatch = (s: MatchType): Props => {
  const pRating = s.Rating;
  const oRating = s.OpponentRating;
  const isNegative = s.Change < 0;
  const isDecimal = s.Change.toString().match(/\./);
  const changeAbsolute = Math.abs(s.Change);
  const isLarge = changeAbsolute >= 100;
  const _change = `${isNegative ? "" : "+"}${s.Change}${isDecimal ? "" : ".0"}`;
  const change = isLarge ? _change.split(".")[0] : _change;
  const rgb = rgbScale(s.Change, s.Error / -6, s.Error / 6);
  const record = `${s.Wins} - ${s.Losses}`;
  const _date = new Date(s.Date).getTime();
  const date = new Date(_date - new Date().getTimezoneOffset() * 60000);
  const timestamp = date
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .replace(",", "");
  const isLongName = s.OpponentName.length + s.OpponentCharacter.length > 21;
  const opponent = isLongName
    ? `${s.OpponentName} (${s.OpponentCharacterShort})`
    : `${s.OpponentName} (${s.OpponentCharacter})`;

  return {
    id: s._DateString,
    pRating,
    oRating,
    change,
    opponent,
    record,
    timestamp,
    rgb,
  };
};

export const MatchRow = ({
  id,
  pRating,
  oRating,
  change,
  opponent,
  record,
  timestamp,
  rgb,
}: Props) => (
  <div id={id} className="set border-b divide-x mono-300">
    <div className="container rating rt-md text-center">{pRating}</div>
    <div className="container change rt-sm text-center relative">
      <div
        className="change-bg"
        style={{
          position: "absolute",
          top: 0,
          left: "-1px",
          right: "-1px",
          bottom: 0,
          zIndex: 100,
          background: rgb,
        }}
      ></div>
      <span
        className="value"
        style={{ position: "relative", zIndex: 101, left: "-2px" }}
      >
        {change}
      </span>
    </div>
    <div className="container rating rt-md text-center">{oRating}</div>
    <div className="container set-meta">
      <div className="border-b opponent-name">
        <div className={`container pl-1 theme-invert overflow-hidden rt-lg`}>
          {opponent}
        </div>
      </div>
      <div className="container border-r rt-xl text-center">{record}</div>
      <div className="">
        <div className="container rt-md text-center">{timestamp}</div>
      </div>
    </div>
  </div>
);
