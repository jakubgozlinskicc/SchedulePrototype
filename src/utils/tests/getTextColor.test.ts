import { describe, it, expect } from "vitest";
import { getTextColor } from "../getTextColor";

describe("getTextColor", () => {
  it("It should return black color for bright background", () => {
    expect(getTextColor("#FFFFFF")).toBe("black");
    expect(getTextColor("#CCCCCC")).toBe("black");
    expect(getTextColor("#FFFF00")).toBe("black");
  });

  it("It should return white color for dark background", () => {
    expect(getTextColor("#000000")).toBe("white");
    expect(getTextColor("#000080")).toBe("white");
    expect(getTextColor("#0000FF")).toBe("white");
  });

  it("It should return white below (0xFFFFFF/2)", () => {
    expect(getTextColor("#7FFFFF")).toBe("white");
  });

  it("It should return balck above (0xFFFFFF/2)", () => {
    expect(getTextColor("#800000")).toBe("black");
  });

  it("It should return white for null/undefined", () => {
    expect(getTextColor(undefined)).toBe("white");
    expect(getTextColor(null)).toBe("white");
    expect(getTextColor("")).toBe("white");
  });
});
