import {
  handleMoves,
  moveHead,
  readInput,
  shouldTailMove,
  moveTail,
} from "./index";

describe("index", () => {
  describe("readInput", () => {
    it("should read and parse test input", async () => {
      expect.assertions(1);

      const res = await readInput("./src/day9/input_test.txt");
      expect(res).toEqual([
        ["R", 4],
        ["U", 4],
        ["L", 3],
        ["D", 1],
        ["R", 4],
        ["D", 1],
        ["L", 5],
        ["R", 2],
      ]);
    });
  });
  describe.only("handleMoves", () => {
    it("should return number of visited positions for tail with test_input", () => {
      expect.assertions(1);
      const moves = [
        ["R", 4],
        ["U", 4],
        ["L", 3],
        ["D", 1],
        ["R", 4],
        ["D", 1],
        ["L", 5],
        ["R", 2],
      ] as any[];
      const res = handleMoves(moves);
      expect(res).toBe(13);
    });
    it("should return number of visited positions for tail with test_input for part 2", () => {
        expect.assertions(1);
        const moves = [
          ["R", 5],
          ["U", 8],
          ["L", 8],
          ["D", 3],
          ["R", 17],
          ["D", 10],
          ["L", 25],
          ["U", 20],
        ] as any[];
        const res = handleMoves(moves, 9);
        expect(res).toBe(36);
      });
    it.skip("should return visited positions for tail with test_input", async () => {
      expect.assertions(1);

      const moves = [
        ["R", 4],
        ["U", 4],
        ["L", 3],
        ["D", 1],
        ["R", 4],
        ["D", 1],
        ["L", 5],
        ["R", 2],
      ] as any;
      const res = handleMoves(moves);
      expect(res).toEqual([
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 4],
        [2, 4],
        [3, 4],
        [4, 3],
        [4, 2],
        [3, 3],
        [3, 4],
        [2, 3],
        [2, 2],
        [2, 1],
      ]);
    });
  });

  describe("moveHead", () => {
    it("should move head position one step left", () => {
      expect.assertions(1);
      const position = [0, 0] as [number, number];
      const res = moveHead(position, "L");
      expect(res).toEqual([0, -1]);
    });

    it("should move head position one step right", () => {
      expect.assertions(1);
      const position = [0, 0] as [number, number];
      const res = moveHead(position, "R");
      expect(res).toEqual([0, 1]);
    });
    it("should move head position one step down", () => {
      expect.assertions(1);
      const position = [10, 5] as [number, number];
      const res = moveHead(position, "D");
      expect(res).toEqual([9, 5]);
    });
  }),
    describe("shouldTailMove", () => {
      it("should return true if tail is not adjacent to head", () => {
        expect(shouldTailMove([0, 0], [0, 1])).toBe(false);
        expect(shouldTailMove([0, 0], [0, 2])).toBe(true);
        expect(shouldTailMove([0, -1], [0, 2])).toBe(true);
        expect(shouldTailMove([0, -1], [0, -2])).toBe(false);
        expect(shouldTailMove([0, -1], [0, -3])).toBe(true);
        expect(shouldTailMove([0, 0], [-1, -1])).toBe(false);
        expect(shouldTailMove([0, 0], [1, 1])).toBe(false);
        expect(shouldTailMove([0, 0], [1, 2])).toBe(true);
      });
    });

  describe("moveTail", () => {
    it("should move tail adjacent to head and return new position", () => {
      expect(moveTail([0, 0], [0, 2])).toEqual([0, 1]);
      expect(moveTail([0, 0], [2, 1])).toEqual([1, 1]);
      expect(moveTail([0, 0], [0, -2])).toEqual([0, -1]);
      expect(moveTail([0, -1], [0, -3])).toEqual([0, -2]);
      expect(moveTail([0, 0], [1, 2])).toEqual([1, 1]);
      expect(moveTail([0, 0], [2, 0])).toEqual([1, 0]);
      expect(moveTail([1, 0], [3, 0])).toEqual([2, 0]);
      expect(moveTail([0, 0], [2, -1])).toEqual([1, -1]);
      expect(moveTail([0, 0], [2, -1])).toEqual([1, -1]);
    });
  });
});
