import { simulateSand } from "./index";
import { printMap } from "../utils";

describe("index", () => {
  describe("simulateSand", () => {
    let map: any[][] = [];

    describe("2x2 map", () => {
      beforeEach(() => {
        map = Array(2)
          .fill(null)
          .map((_r) => Array(2).fill("."));
        map[0][1] = "+"; // Sand source
      });

      it("should return 2 iterations to fill when empty", () => {
        expect.assertions(1);
        const { iterations, map: resMap } = simulateSand(map);
        printMap({
          map: resMap,
        });
        expect(iterations).toBe(2);
      });
    });

    describe("2x3 map", () => {
      beforeEach(() => {
        map = Array(2)
          .fill(null)
          .map((_r) => Array(3).fill("."));
        map[0][1] = "+"; // Sand source
      });

      it("should return 3 iterations to fill when empty", () => {
        expect.assertions(1);
        const { iterations, map: resMap } = simulateSand(map);
        printMap({
          map: resMap,
        });
        expect(iterations).toBe(3);
      });
    });
    describe("3x3 map", () => {
      beforeEach(() => {
        map = Array(3)
          .fill(null)
          .map((_r) => Array(3).fill("."));
        map[0][1] = "+"; // Sand source
      });

      it("should return 6 iterations to fill when empty", () => {
        expect.assertions(1);
        const { iterations, map: resMap } = simulateSand(map);
        printMap({
          map: resMap,
        });
        expect(iterations).toBe(6);
      });

      it("should return 5 iterations to fill when 1 stone", () => {
        expect.assertions(1);
        map[1][1] = "#";
        const { iterations, map: resMap } = simulateSand(map);
        printMap({
          map: resMap,
        });
        expect(iterations).toBe(5);
      });

      it("should return 5 iterations to fill when 1 stone", () => {
        expect.assertions(1);
        map[1][2] = "#";
        const { iterations, map: resMap } = simulateSand(map);
        printMap({
          map: resMap,
        });
        expect(iterations).toBe(5);
      });

      it("should return 4 iterations to fill when 2 vertical stones", () => {
        expect.assertions(1);
        map[1][1] = "#";
        map[2][1] = "#";
        const { iterations, map: resMap } = simulateSand(map);
        printMap({
          map: resMap,
        });
        expect(iterations).toBe(4);
      });

      it("should return 3 iterations to fill when 2 horizontal stones", () => {
        expect.assertions(1);
        map[1][1] = "#";
        map[1][2] = "#";
        const { iterations, map: resMap } = simulateSand(map);
        printMap({
          map: resMap,
        });
        expect(iterations).toBe(3);
      });

      it("should return 4 iterations to fill when 2 horizontal stones at bottom", () => {
        expect.assertions(1);
        map[2][1] = "#";
        map[2][2] = "#";
        const { iterations, map: resMap } = simulateSand(map);
        printMap({
          map: resMap,
        });
        expect(iterations).toBe(4);
      });

      it("should return 0 iterations when start is blocked", () => {
        expect.assertions(1);
        map[1][0] = "#";
        map[1][1] = "#";
        map[1][2] = "#";
        const { iterations, map: resMap } = simulateSand(map);
        printMap({
          map: resMap,
        });
        expect(iterations).toBe(0);
      });
    });
  });
});
