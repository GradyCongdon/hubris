
export const rgbScale = (
  value: number,
  min: number,
  max: number,
  opacity = 1
) => {
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
