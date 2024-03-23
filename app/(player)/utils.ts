const blocks = " ▁▂▃▄▅▆▇█".split("");
export function scaleConvert(
  number: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
// // maps win percent to a block text based on the blocks array length
// const getClosestBlock = (value) => {
//   const converted = scaleConvert(value, 0, 100, 0, blocks.length - 1);
//   const index = Math.floor(converted);
//   console.log(index, converted, value, blocks[index]);
//   return blocks[index];
// };

// postive is blue and negative is red scaled from -20 to 20
export const rgbScale = (
  value: number,
  min: number,
  max: number,
  opacity = 1
) => {
  // if (Math.abs(value) < 1) return "rgba(255, 255, 255, 0)";
  const range = max - min;
  const scaled = (value - min) / range;
  const r = Math.floor(255 * (1 - scaled));
  const b = Math.floor(255 * scaled);
  const g = 0;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const formatChange = (change: number): string => {
  const isNegative = change < 0;
  const hasDecimal = change.toString().match(/\./);
  const changeAbsolute = Math.abs(change);
  const isLarge = changeAbsolute >= 100;
  const changeFormatted = `${isNegative ? "" : "+"}${change}${
    hasDecimal ? "" : ".0"
  }`;
  const [whole, decimal] = changeFormatted.split(".");
  if (isLarge) {
    return whole;
  }
  const singleDecimal = decimal ? decimal.slice(0, 1) : "0";
  return `${whole}.${singleDecimal}`;
};
