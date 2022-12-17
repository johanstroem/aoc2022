import { compare } from "./index";

describe("index", () => {
  describe("compare", () => {
    it("should compare a and b as integers", () => {
      //   expect.assertions(1);

      expect(compare(1, 1)).toEqual(0); // continue
      expect(compare(1, 2)).toEqual(-1); // inputs are in the right order
      expect(compare(2, 1)).toEqual(1); // inputs are NOT in the right order
    });

    it("should compare a and b as lists", () => {
      //   expect.assertions(1);
      expect(compare([1], [1])).toEqual(0);
      expect(compare([1], [2])).toEqual(-1); // inputs are in the right order
      expect(compare([2], [1])).toEqual(1); // inputs are NOT in the right order
    });
    it("should compare a as number and b as list", () => {
      //   expect.assertions(1);
      expect(compare(1, [1])).toEqual(0);
      expect(compare(1, [2])).toEqual(-1); // inputs are in the right order
      expect(compare(2, [1])).toEqual(1); // inputs are NOT in the right order
    });
    it("should compare a as list and b as number", () => {
      //   expect.assertions(1);
      expect(compare([1], 1)).toEqual(0);
      expect(compare([1], 2)).toEqual(-1); // inputs are in the right order
      expect(compare([2], 1)).toEqual(1); // inputs are NOT in the right order
    });

    it("should return negative when left=[1,1,3,1,1] and right=[1,1,5,1,1]", () => {
      //   expect.assertions(1);
      const res = compare([1, 1, 3, 1, 1], [1, 1, 5, 1, 1]);
      expect(res).toBeLessThan(0);
    });
    it("should return negative when left=[[1],[2,3,4]] and right=[[1],4]", () => {
      //   expect.assertions(1);

      const res = compare([[1], [2, 3, 4]], [[1], 4]);
      expect(res).toBeLessThan(0);
    });
    it("should return negative when left=[[4,4],4,4] and right=[[4,4],4,4,4] since Left side ran out of items", () => {
      //   expect.assertions(1);

      const res = compare([[4, 4], 4, 4], [[4, 4], 4, 4, 4]);
      expect(res).toBeLessThan(0);
    });
    it("should return negative when left=[] and right=[3] since Left side ran out of items", () => {
      //   expect.assertions(1);

      const res = compare([], [3]);
      expect(res).toBeLessThan(0);
    });
    it("should return positive when left=[9] and right=[[8,7,6]]", () => {
      //   expect.assertions(1);

      const res = compare([9], [[8, 7, 6]]);
      expect(res).toBeGreaterThan(0);
    });
    it("should return positive when left=[7,7,7,7] and right=[7,7,7] since Right side ran out of items", () => {
      //   expect.assertions(1);

      const res = compare([7, 7, 7, 7], [7, 7, 7]);
      expect(res).toBeGreaterThan(0);
    });
    it("should return positive when left=[[[]]] and right=[[]] since Right side ran out of items", () => {
      //   expect.assertions(1);

      const res = compare([[[]]], [[]]);
      expect(res).toBeGreaterThan(0);
    });
    it("should return positive when left=[1,[2,[3,[4,[5,6,7]]]],8,9] and right=[1,[2,[3,[4,[5,6,0]]]],8,9]", () => {
      //   expect.assertions(1);

      const res = compare(
        [1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
        [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]
      );
      expect(res).toBeGreaterThan(0);
    });
    it("should return 0 when left=[] and right=[]", () => {
      //   expect.assertions(1);

      const res = compare([], []);
      expect(res).toBe(0);
    });
  });
});
