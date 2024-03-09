"use client";

import { useCallback, useState } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { POLLING_INTERVAL } from "../../../consts";

import "./Session.css";

type Props = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  nextPollMs: number;
  setNextPollMs: React.Dispatch<React.SetStateAction<number>>;
};

const Button = ({ active, setActive, nextPollMs, setNextPollMs }: Props) => {
  const height = active ? "h-6" : "h-16";
  const text = active ? "End Session" : "Start Session";
  const [percent, setPercent] = useState(60);
  const transition = percent === 0 || percent > 100 ? "width 0.3s" : "none";
  useAnimationFrame(() => {
    if (!active) return;
    const elapsed = nextPollMs - Date.now();
    const percent = Math.min(
      ((POLLING_INTERVAL - elapsed) / POLLING_INTERVAL) * 100,
      100
    );
    setPercent(percent);
  });
  const onClick = useCallback(() => {
    setActive(!active);
    setNextPollMs(Date.now() + POLLING_INTERVAL);
    // FIXME
    setPercent(0);
  }, [active, setActive, setNextPollMs]);
  return (
    <div className="container text-center session relative progress ">
      <button
        className={`${height} text-black w-full `}
        style={{
          backgroundColor: "var(--progress-bg)",
          transition: "all 0.3s",
          color: "var(--progress-text)",
        }}
        onClick={onClick}
      >
        <div
          className="progress-bar"
          style={{
            width: `${percent}%`,
            bottom: 0,
            top: 0,
            left: 0,
            backgroundColor: "var(--progress-fg)",
            position: "absolute",
            pointerEvents: "none",
            transition,
          }}
        ></div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "var(--progress-text-bg)",
            color: "var(--progress-text)",
            transition: "all 0.3s",
            height: "100%",
            padding: "0 11px",
            position: "relative",
            lineHeight: "24px",
            zIndex: 102,
          }}
        >
          <span style={{ opacity: 1 }}>{text}</span>
        </span>
      </button>
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
  const height = active ? "h-10" : "h-16";
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
