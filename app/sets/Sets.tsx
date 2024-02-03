"use client";
import { groupBy } from "lodash";
import { useState } from "react";
import allSetsJSON from "./2EC3DCA33129F30.json";

const dateSortNewest = (
  a: { Date: string | number | Date },
  b: { Date: string | number | Date }
) => {
  const aDate = new Date(a.Date);
  const bDate = new Date(b.Date);
  return bDate.getTime() - aDate.getTime();
};

type GearSetJSON = {
  Date: string;
  Character: string;
  CharacterShort: string;
  Rating: number;
  Rating1500: number;
  Error: number;
  Min: number;
  Max: number;
  Wins: number;
  Losses: number;
  OpponentCharacter: string;
  OpponentCharacterShort: string;
  OpponentRating: number;
  OpponentError: number;
  OpponentName: string;
  OpponentSystem: string;
  Odds: number;
  OddsFactor: number;
  Change: number;
  GameCount: number;
};

type GearSet = GearSetJSON & {
  Date: Date;
};

export const SetCard = ({
  Date: _Date,
  Rating,
  OpponentName,
  Wins,
  Losses,
  Character,
  OpponentCharacter,
  Change,
}: GearSet) => {
  const date = new Date(_Date);
  const time = date.toLocaleTimeString().replace(/:00/, "");
  // const when = `${date.toLocaleDateString()} ${time}`;
  const when = time.padStart(8, "0");
  const record = `${Wins} - ${Losses}`;
  const changeBg = Change > 0 ? "bg-green-600" : "bg-red-600";
  const ratingClasses = `text-3xl font-bold tracking-tight text-white ${changeBg}`;
  return (
    <a
      href="#"
      className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      style={{
        minHeight: "160px",
        minWidth: "300px",
        position: "relative",
      }}
    >
      <h5
        className={ratingClasses}
        style={{
          top: "-1rem",
          left: "-1rem",
          position: "absolute",
          borderRadius: "100px",
          padding: "0.25rem 0.5rem",
        }}
      >
        {Rating} ({Change})
      </h5>
      <h3 className="my-6 text-center text-2xl">
        {Character}({record}) {OpponentCharacter}
      </h3>
      <h4 className="mb-2 text-xl font-medium tracking-tight text-gray-700 dark:text-white">
        {OpponentName}
      </h4>
      <p className="font-normal text-gray-700 dark:text-gray-400 text-left">
        {when}
      </p>
    </a>
  );
};
const SEC = 1000,
  MIN = 60 * SEC,
  HRS = 60 * MIN;
const getDiffHours = (diff: number) => Math.floor(diff / HRS);

// const Spaces = (last, set) => {
//   const timeDiff = last - set.Date.getTime();
//   last = set.Date.getTime();
//   const diffHours = getDiffHours(timeDiff);
//   const spacer =
//     timeDiff > 1000 * 60 * 60 * 1 ? (
//       <div
//         style={{
//           minHeight: "24px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: 4 * diffHours + "px",
//           border: "1px solid lightgray",
//           borderRadius: "4px",
//         }}
//       >
//         {diffHours} Hours
//       </div>
//     ) : null;
// };

// const isDifferentDate =
//   date.toLocaleDateString() !== set.Date.toLocaleDateString();
// date = set.Date;
// const dateLine = isDifferentDate ? (
//   <h2
//     className="my-2 text-center border-indigo-500 w-full"
//     style={{ borderBottomWidth: "1px" }}
//   >
//     {date.toLocaleDateString()}
//   </h2>
// ) : null;
// return (
//   <>
//     {dateLine}
export const Sets = () => {
  const [characterShort, setCharacterShort] = useState("KY");
  const filterCharacter = (set: GearSet) => {
    if (characterShort === "all") return true;
    return set.CharacterShort === characterShort;
  };
  const allSets = allSetsJSON
    .filter(filterCharacter)
    .sort(dateSortNewest)
    .map((set) => ({
      ...set,
      Date: new Date(set.Date),
    })) as unknown as GearSet[];
  const byDay = groupBy(allSets, (set) => set.Date.toLocaleDateString());
  return (
    <div className="w-full">
      Count {allSets.length}
      <select onChange={(e) => setCharacterShort(e.target.value)}>
        <option value="KY">Ky</option>
        <option value="all">All</option>
      </select>
      {Object.entries(byDay).map(([date, sets]) => {
        const dateLine = (
          <h2
            className="my-2 text-center border-indigo-500 w-full"
            style={{ borderBottomWidth: "1px" }}
          >
            {date}
          </h2>
        );
        return (
          <div key={date}>
            {dateLine}
            <div className="flex flex-wrap gap-4">
              {sets.map((set) => (
                <SetCard key={set.Date.getTime()} {...set} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
