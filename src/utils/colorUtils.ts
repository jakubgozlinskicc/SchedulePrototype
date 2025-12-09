export const getTextColor = (
  hexColor: string | undefined | null,
  defaultHexColor: string = "#591efd"
): "black" | "white" => {
  const bg = hexColor || defaultHexColor;

  const brightness = parseInt(bg.replace("#", ""), 16);
  const threshold = 0xffffff / 2;

  return brightness > threshold ? "black" : "white";
};
