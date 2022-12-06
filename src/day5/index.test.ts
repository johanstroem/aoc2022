import { moveBox, parseInitialState, parseLine } from "./index";
import { REAL_INPUT, TEST_INPUT } from "../utils";

describe("index", () => {
  describe("moveBox", () => {
    let state: any;
    beforeEach(() => {
      state = [["N", "Z"], ["D", "C", "M"], ["P"]];
    });
    it("should move 'D' to start of first array", () => {
      expect.assertions(1);

      const result = moveBox(state, {
        n: 1,
        from: 2,
        to: 1,
      });
      expect(result).toEqual([["D", "N", "Z"], ["C", "M"], ["P"]]);
    });
    it("should move 3 from 2 to 3", () => {
      expect.assertions(1);

      const result = moveBox(state, {
        n: 3,
        from: 2,
        to: 3,
      });
      // expect(result).toEqual([["N", "Z"], [], ["M", "C", "D", "P"]]);
      expect(result).toEqual([["N", "Z"], [], ["D", "C", "M", "P"]]);
    });
  });

  describe("parseInitialState", () => {
    let lines: any;
    let endLine: number;
    beforeEach(() => {
      lines = ["    [D]    ", "[N] [C]    ", "[Z] [M] [P]", "1   2   3 "];
      endLine = 5;
    });

    it("should contain 3 stacks", () => {
      expect.assertions(1);

      const result = parseInitialState(lines);
      expect(result.length).toBe(3);
    });

    it("should place boxes in each stack", () => {
      expect.assertions(1);

      const result = parseInitialState(lines);
      expect(result).toEqual([["N", "Z"], ["D", "C", "M"], ["P"]]);
    });
  });

  describe("parseLine", () => {
    it("should parse number of moves and to/from", () => {
      expect.assertions(2);

      expect(parseLine("move 1 from 2 to 1")).toEqual({
        n: 1,
        from: 2,
        to: 1,
      });
      expect(parseLine("move 10 from 1 to 2")).toEqual({
        n: 10,
        from: 1,
        to: 2,
      });
    });
  });
});
