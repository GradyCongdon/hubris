
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
};

export const longToShort: { [key: string]: string; } = Object.entries(shortToLong).reduce((acc, [k, v]) => {
  // @ts-ignore
  acc[v] = k;
  return acc;
}, {});