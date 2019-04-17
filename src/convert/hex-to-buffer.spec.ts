import { hexToBuffer } from "./hex-to-buffer";

describe("hexToBuffer", () => {
  test("if it converts a valid hex", () =>
    expect(hexToBuffer("ff")[0]).toBe(255));
  test("it should return a empty buffer is invalid string", () =>
    expect(() => hexToBuffer("TEST_INVALID_STRING")).toHaveLength(0));
  test("it should return undefined if invalid string", () =>
    expect(hexToBuffer({ some: "object" })).toBeUndefined());
});
