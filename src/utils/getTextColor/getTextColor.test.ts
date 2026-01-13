import { describe, it, expect } from "vitest";
import { getTextColor } from "./getTextColor";

describe("getTextColor", () => {
  it("It should return black color for bright background", () => {
    expect(getTextColor("#FFFFFF")).toBe("black");
    expect(getTextColor("#CCCCCC")).toBe("black");
    expect(getTextColor("#FFFF00")).toBe("black");
    expect(getTextColor("#7FFFFF")).toBe("black");
    expect(getTextColor("#94ffff")).toBe("black");
    expect(getTextColor("#ebfc8c")).toBe("black");
  });

  it("It should return white color for dark background", () => {
    expect(getTextColor("#000000")).toBe("white");
    expect(getTextColor("#000080")).toBe("white");
    expect(getTextColor("#0000FF")).toBe("white");
    expect(getTextColor("#800000")).toBe("white");
    expect(getTextColor("#58307e")).toBe("white");
    expect(getTextColor("#3ca12f")).toBe("white");
  });

  it("should handle shorthand hex format", () => {
    expect(getTextColor("#FFF")).toBe("black");
    expect(getTextColor("#000")).toBe("white");
    expect(getTextColor("#F00")).toBe("white");
  });

  it("It should return white for null/undefined", () => {
    expect(getTextColor(undefined)).toBe("white");
    expect(getTextColor(null)).toBe("white");
    expect(getTextColor("")).toBe("white");
  });
});
