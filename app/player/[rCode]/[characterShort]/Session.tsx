"use client";

import { useCallback, useState } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { POLLING_INTERVAL } from "./consts";

type Props = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  nextPollMs: number;
  setNextPollMs: React.Dispatch<React.SetStateAction<number>>;
};

const Button = ({ active, setActive, nextPollMs, setNextPollMs }: Props) => {
  const height = active ? "h-10" : "h-20";
  const text = active ? "End Session" : "Start Session";
  const [percent, setPercent] = useState(0);
  const transition = percent === 0 || percent > 100 ? "width 0.3s" : "none";
  useAnimationFrame(() => {
    if (!active) return;
    const elapsed = nextPollMs - Date.now();
    const percent = ((POLLING_INTERVAL - elapsed) / POLLING_INTERVAL) * 100;
    setPercent(percent);
  });
  const onClick = useCallback(() => {
    setActive(!active);
    setNextPollMs(Date.now() + POLLING_INTERVAL);
    // FIXME
    setPercent(0);
  }, [active, setActive, setNextPollMs]);
  return (
    <div className="container text-center session relative ">
      <button
        className={`${height} text-black w-full`}
        style={{
          backgroundColor: active ? "var(--bg)" : "var(--accent-color)",
          transition: "all 0.3s",
          color: active ? "var(--color)" : "var(--accent-text)",
        }}
        onClick={onClick}
      >
        <span
          style={{
            position: "relative",
            background: active ? "var(--bg)" : "none",
            padding: "0 .3rem",
            transition: "all 0.3s",
            zIndex: 102,
          }}
        >
          {text}
        </span>
      </button>
      <div
        style={{
          width: `${percent}%`,
          bottom: 0,
          top: 0,
          left: 0,
          backgroundColor: "var(--accent-color)",
          position: "absolute",
          // opacity: 0.7,
          pointerEvents: "none",
          transition,
        }}
      ></div>
    </div>
  );
};

export const Session = ({
  active,
  setActive,
  nextPollMs,
  setNextPollMs,
}: Props) => {
  return (
    <>
      <Button
        active={active}
        setActive={setActive}
        nextPollMs={nextPollMs}
        setNextPollMs={setNextPollMs}
      />
    </>
  );
};

export const SessionSkeleton = () => {
  const active = false;
  const height = active ? "h-10" : "h-20";
  const text = active ? "" : "";
  const percent = 0;
  return (
    <div className="container text-center session relative ">
      <button
        className={`${height} text-black w-full`}
        style={{
          backgroundColor: active ? "var(--bg)" : "var(--accent-color)",
          transition: "all 0.3s",
          color: active ? "var(--color)" : "var(--accent-text)",
        }}
      >
        {text}
      </button>
      <div
        style={{
          width: `${percent}%`,
          bottom: 0,
          top: 0,
          left: 0,
          backgroundColor: "white",
          position: "absolute",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};
