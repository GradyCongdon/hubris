"use client";

import { LiveFeed } from "./LiveFeed";
type Props = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const Button = ({ active, setActive }: Props) => {
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

export const Session = ({ active, setActive }: Props) => {
  return (
    <>
      <Button active={active} setActive={setActive} />
      {/* <LiveFeed active={active} /> */}
    </>
  );
};
