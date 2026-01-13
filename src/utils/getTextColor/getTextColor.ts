export const getTextColor = (
  hexColor: string | undefined | null,
  defaultHexColor: string = "#591efd"
): "black" | "white" => {
  const hex = (hexColor || defaultHexColor).replace("#", "");

  const fullHex =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "black" : "white";
};
