"use client";

type Props = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  timer: number;
};

const TIME = 600;
const Button = ({ active, setActive, timer }: Props) => {
  const bg = active ? "bg-red-200" : "bg-green-300";
  const height = active ? "h-10" : "h-20";
  const text = active ? "Stop Session" : "Start Session";
  const percent = ((TIME - timer) / TIME) * 100;
  return (
    <div className="container text-center session relative ">
      <button
        className={`${bg} ${height} text-black w-full`}
        style={{ transition: "all 0.3s" }}
        onClick={() => setActive(!active)}
      >
        {text}
      </button>
      <div
        style={{
          width: `${percent}%`,
          bottom: 0,
          top: 0,
          left: 0,
          backgroundColor: "black",
          position: "absolute",
          opacity: 0.2,
          pointerEvents: "none",
          transition: "width 0.3s",
        }}
      ></div>
    </div>
  );
};

export const Session = ({ active, setActive, timer }: Props) => {
  return (
    <>
      <Button active={active} setActive={setActive} timer={timer} />
      {/* <LiveFeed active={active} /> */}
    </>
  );
};

export const SessionSkeleton = () => {
  const active = false;
  const bg = active ? "bg-red-200" : "bg-green-300";
  const height = active ? "h-10" : "h-20";
  const text = active ? "" : "";
  const percent = 0;
  return (
    <div
      className="container text-center session relative"
      data-active={{ active }}
    >
      <button
        className={`${bg} ${height} text-black w-full`}
        style={{ transition: "all 0.3s" }}
      >
        {text}
      </button>
      <div
        style={{
          width: `${percent}%`,
          bottom: 0,
          top: 0,
          left: 0,
          backgroundColor: "black",
          position: "absolute",
          opacity: 0.2,
          pointerEvents: "none",
          transition: "width 0.3s",
        }}
      ></div>
    </div>
  );
};
