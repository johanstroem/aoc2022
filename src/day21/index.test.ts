import { solve, arrangeExpression } from "./index";

describe("index", () => {
  describe("solve", () => {
    it("should handle basic algebra", () => {
      expect(solve("X + 1 = 2")).toBe(1);
      expect(solve("1 + X = 2")).toBe(1);
      expect(solve("X - 3 = 1 ")).toBe(4);
      expect(solve("3 - X = 1 ")).toBe(2);
      12;
      expect(solve("2 * X = 4")).toBe(2);
      expect(solve("X * 2 = 4")).toBe(2);
      expect(solve("4 / X = 2")).toBe(2);
      expect(solve("X / 4 = 2")).toBe(8);
    });

    it("should solve for X", () => {
      // expect.assertions(1);
      expect(solve("X = 1")).toBe(1);
      expect(solve("(X) = 1")).toBe(1);
      expect(solve("(X + 1) = 1")).toBe(0);
      expect(solve("(1 + X) = 1")).toBe(0);
      expect(solve("(X + 1) = 2")).toBe(1);
      expect(solve("(1 + X) = 2")).toBe(1);
      expect(solve("2 = (1 + X)")).toBe(1);
      expect(solve("2 = (X + 1)")).toBe(1);
      expect(solve("(X - 1) = 1")).toBe(2);
      expect(solve("(2 * X) = 2")).toBe(1);
      expect(solve("(2 / X) = 1")).toBe(2);
      expect(solve("(2 * (X - 3)) = 2")).toBe(4);
      expect(solve("(2 * (3 - X)) = 2")).toBe(2);
      expect(solve("((3 - X) * 2) = 2")).toBe(2);
      expect(solve("((3 / X) * 2) = 2")).toBe(3);
      // Can't handle floats?
      expect(solve("((3 * X) * 2) = 2")).toBe(1 / 3);
      expect(solve("((4 + (2 * (X - 3))) / 4) = 150")).toBe(301);
      expect(solve("((4 + (3 * (X - 3))) / 4) = 150") - 201.666).toBeLessThan(
        0.1
      );
      expect(
        solve("28 * (((49 + (X - 165)) / 2) + 1) = 1000") - 185.42857142857144
      ).toBeLessThan(0.1);
    });

    it("should solve large problems", () => {
      const expression =
        "64 + ((819 + (2 * ((((2 * ((21 * (299 + (((((((((367 + ((2 * (((((224 + ((((((323 + (((6 * (((((560 + ((((116 + ((((((((((((((449 + (X - 165)) / 2) + 1) * 68) - 489) * 2) + 729) / 5) - 892) * 2) + 687) / 5) - 506) * 2)) / 2) - 71) / 2)) * 10) - 397) / 9) + 782)) - 249) / 3)) * 3) + 170) / 2) - 438) * 3)) / 4) - 160) * 4) + 249)) - 873)) / 12) + 667) + 490) / 3) - 983) * 5) - 900) / 5))) - 660)) + 495) / 3) - 230))) / 3) = 18688";
      expect(solve(expression) - 1069).toBeLessThan(1);
    });
  });

  describe("arrangeExpression", () => {
    it("should push sort variables by algorithmic priority from left to right", () => {
      // expect.assertions(1);
      expect(arrangeExpression("(2 * (3 - X)) = 2")).toEqual([
        "2 * (3 - X)",
        "2",
      ]);
      expect(arrangeExpression("((3 - X) * 2) = 2")).toEqual([
        "2 * (3 - X)",
        "2",
      ]);
    });

    it("Should handle large expression", () => {
      const expression = `((21 * (299 + (((((((((367 + ((2 * (((((224 + ((((((323 + (((6 * (((((560 + ((((116 + ((((((((((((((449 + (X - 165)) / 2) + 1) * 68) - 489) * 2) + 729) / 5) - 892) * 2) + 687) / 5) - 506) * 2)) / 2) - 71) / 2)) * 10) - 397) / 9) + 782)) - 249) / 3)) * 3) + 170) / 2) - 438) * 3)) / 4) - 160) * 4) + 249)) - 873)) / 12) + 667) + 490) / 3) - 983) * 5) - 900) / 5))) - 660) = 10000`;
      const expected = [
        `-660 + (21 * (299 + (((((((((367 + ((2 * (((((224 + ((((((323 + (((6 * (((((560 + ((((116 + ((((((((((((((449 + (X - 165)) / 2) + 1) * 68) - 489) * 2) + 729) / 5) - 892) * 2) + 687) / 5) - 506) * 2)) / 2) - 71) / 2)) * 10) - 397) / 9) + 782)) - 249) / 3)) * 3) + 170) / 2) - 438) * 3)) / 4) - 160) * 4) + 249)) - 873)) / 12) + 667) + 490) / 3) - 983) * 5) - 900) / 5)))`,
        "10000",
      ];

      const res = arrangeExpression(expression);

      expect(res[1]).toBe(expected[1]);
      expect(res[0]).toBe(expected[0]);
    });
  });
});
