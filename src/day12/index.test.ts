import { createMap, getNeighbors, isOutside, canVisit } from "./index";

describe("index", () => {
  describe("createMap", () => {
    it("should create tree map for test input", async () => {
      expect.assertions(1);

      const map = await createMap("./src/day12/input_test.txt");

      const expected = [
        ["S", "a", "b", "q", "p", "o", "n", "m"],
        ["a", "b", "c", "r", "y", "x", "x", "l"],
        ["a", "c", "c", "s", "z", "E", "x", "k"],
        ["a", "c", "c", "t", "u", "v", "w", "j"],
        ["a", "b", "d", "e", "f", "g", "h", "i"],
      ];
      expect(map).toEqual(expected);
    });
  });

  describe("getNeighbors", () => {
    it("should return indexes of all neighbors", () => {
      expect.assertions(1);
      const node = [0, 0] as any;
      const neighbors = getNeighbors(node);
      console.log("neighbors", neighbors);

      expect(neighbors).toEqual([
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ]);
    });
  });

  describe("isOutside", () => {
    const map = [
      [1, 2],
      [2, "o"],
    ] as any[];
    it("should return true if index is outside map", () => {
        expect.assertions(4);

      expect(isOutside([-1, 0], map)).toBe(true);
      expect(isOutside([0, -1], map)).toBe(true);
      expect(isOutside([2, 0], map)).toBe(true);
      expect(isOutside([0, 2], map)).toBe(true);
    });
    it("should return false if index is inside map", () => {
      expect.assertions(2);
      expect(isOutside([0, 1], map)).toBe(false);
      expect(isOutside([1, 1], map)).toBe(false);
    });
  }),
    describe("canVisit", () => {
      it("should return true if neighbor node is less than 1 unit higher", () => {
        expect.assertions(2);
        expect(canVisit(1, 2)).toBe(true);
        expect(canVisit(2, 3)).toBe(true);
      });
      it('should return false if neighbor node is already visited', () => {
        expect.assertions(1)
        expect(canVisit(1, 'o')).toBe(false)
    })
      it('should return false if neighbor node too high', () => {
          expect.assertions(1)
          expect(canVisit(1, 3)).toBe(false)
      })
    });
});
