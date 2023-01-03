import { addCube, sortBy } from "./index";

describe("index", () => {
  describe("addCube", () => {
    it("should add initial cube to scan", () => {
      expect.assertions(1);
      const res = addCube([1, 1, 1]);
      expect(res.data.length).toBe(1);
    });
    it("should add set surface area when adding initial cube", () => {
      expect.assertions(1);
      const res = addCube([1, 1, 1]);
      expect(res.area).toBe(6);
    });

    it.skip("should add two adjacent cubes to scan and merge", () => {
      expect.assertions(2);
      const scan = addCube([1, 1, 1]);
      const res = addCube([1, 1, 2], scan);
      expect(res.data.length).toBe(1);
      expect(res.data).toEqual([]);
    });
    it("should add two adjacent cubes to scan with bigger area", () => {
      expect.assertions(1);
      const scan = addCube([1, 2, 2]);
      const res = addCube([2, 2, 2], scan);

      expect(res.area).toBe(10);
    });

    it("should add two non-adjacent cubes to scan", () => {
      expect.assertions(2);
      const scan = addCube([1, 1, 2]);
      const { data, area } = addCube([2, 2, 2], scan);
      expect(data.length).toBe(2);
      expect(area).toBe(12);
    });
  });

  describe("sortBy", () => {
    const list = [
      {index: [2, 2, 2], surfaceArea: 6},
      {index: [1, 2, 2], surfaceArea: 6},
      {index: [3, 2, 2], surfaceArea: 6},
      {index: [2, 1, 2], surfaceArea: 6},
      {index: [2, 3, 2], surfaceArea: 6},
      {index: [2, 2, 1], surfaceArea: 6},
    ] as const;
    it("should sort by X coordinate, then Y, then Z", () => {
      let sort = sortBy("X");

      const res = sort(list.slice() as any[]);

      expect(res).toEqual([
        {index:[1, 2, 2], surfaceArea: 6},
        {index:[2, 1, 2], surfaceArea: 6},
        {index:[2, 2, 1], surfaceArea: 6},
        {index:[2, 2, 2], surfaceArea: 6},
        {index:[2, 3, 2], surfaceArea: 6},
        {index:[3, 2, 2], surfaceArea: 6},
      ]);
    });

    it("should sort by Y coordinate, then Z, then X", () => {
      let sort = sortBy("Y");

      const res = sort(list.slice() as any[]);
      console.log("res", res);

      expect(res).toEqual([
        {index: [2, 1, 2], surfaceArea: 6},
        {index: [2, 2, 1], surfaceArea: 6},
        {index: [1, 2, 2], surfaceArea: 6},
        {index: [2, 2, 2], surfaceArea: 6},
        {index: [3, 2, 2], surfaceArea: 6},
        {index: [2, 3, 2], surfaceArea: 6},
      ]);
    });

    it("should sort by Z coordinate, then X, then Y", () => {
      let sort = sortBy("Z");

      const res = sort(list.slice() as any[]);
      
      expect(res).toEqual([
        {index: [2, 2, 1], surfaceArea: 6},
        {index: [1, 2, 2], surfaceArea: 6},
        {index: [2, 1, 2], surfaceArea: 6},
        {index: [2, 2, 2], surfaceArea: 6},
        {index: [2, 3, 2], surfaceArea: 6},
        {index: [3, 2, 2], surfaceArea: 6},
      ]);
    });
  });
});
