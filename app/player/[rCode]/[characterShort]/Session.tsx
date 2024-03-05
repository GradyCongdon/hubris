"use client";

import { useEffect, useState } from "react";
import { LiveFeed } from "./LiveFeed";
import "./Progress.css";

const Button = ({
  active,
  setActive
}: {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const bg = active ? "bg-red-300" : "bg-green-300";
  const height = active ? "h-10" : "h-20";
  const text = active ? "Stop Session" : "Start Session";
  return (
    <div className="container text-center session ">
      <button
        className={`${bg} ${height} text-black w-full`}
        style={{ transition: "all 0.3s" }}
        onClick={() => setActive(!active)}
      >
        {text}
      </button>
    </div>
  );
};

const Progress = ({
  active,
  percent
}: {
  active: boolean;
  percent: number;
}) => {
  return (
    <svg
      width="250"
      height="250"
      viewBox="0 0 250 250"
      className="circular-progress"
    >
      <circle className="bg"></circle>
      <circle className="fg"></circle>
    </svg>
  );
};

export const Session = () => {
  const [active, setActive] = useState(false);
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 16);
      }, 16);
      return () => {
        setTime(0);
        clearInterval(interval);
      };
    }
  }, [active]);
  const percent = (time / 2000) * 100;
  return (
    <>
      <Button active={active} setActive={setActive} />
      <LiveFeed active={active} />
    </>
  );
};
