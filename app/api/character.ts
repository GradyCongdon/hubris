export const shortToLong = {
  SO: "Sol",
  KY: "Ky",
  MA: "May",
  AX: "Axl",
  CH: "Chipp",
  PO: "Potemkin",
  FA: "Faust",
  MI: "Millia",
  ZA: "Zato-1",
  RA: "Ramlethal",
  LE: "Leo",
  NA: "Nagoriyuki",
  GI: "Giovanna",
  AN: "Anji",
  IN: "I-No",
  GO: "Goldlewis",
  JC: "Jack-O'",
  HA: "Happy Chaos",
  BA: "Baiken",
  TE: "Testament",
  BI: "Bridget",
  SI: "Sin",
  BE: "Bedman?",
  AS: "Asuka",
  JN: "Johnny",
  EL: "Elphelt",
  AB: "A.B.A",
};

const others = {
  "A.B.A.": "AB",
  "Jack-O": "JC",
  "Jack O": "JC",
  Bedman: "BE",
};

export type shortKey = keyof typeof shortToLong;

export const longToShort: { [key: string]: string } = Object.entries(
  shortToLong
).reduce(
  (acc, [k, v]) => {
    // @ts-ignore
    acc[v] = k;
    return acc;
  },
  { ...others }
);

export type longKey = keyof typeof longToShort;
