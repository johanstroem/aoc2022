import {
  checkVisibility,
  createTreeMap,
  HIDDEN,
  setVisibility,
  Tree,
  VISIBLE,
} from "./index";

describe("index", () => {
  describe("createTreeMap", () => {
    it("should create tree map for test input", async () => {
      expect.assertions(1);

      const map = await createTreeMap("./src/day8/input_test.txt");

      const expected = [
        [3, 0, 3, 7, 3],
        [2, 5, 5, 1, 2],
        [6, 5, 3, 3, 2],
        [3, 3, 5, 4, 9],
        [3, 5, 3, 9, 0],
      ];
      expect(map).toEqual(expected);
    });
  });
  describe("setVisibility", () => {
    it("should create visibility map for test input", async () => {
      expect.assertions(1);
      const map = [
        [3, 0, 3, 7, 3],
        [2, 5, 5, 1, 2],
        [6, 5, 3, 3, 2],
        [3, 3, 5, 4, 9],
        [3, 5, 3, 9, 0],
      ];

      const visibility = setVisibility(map);

      const expected: Tree[][] = [
        [
          expect.objectContaining({ height: 3, visibility: VISIBLE }),
          expect.objectContaining({ height: 0, visibility: VISIBLE }),
          expect.objectContaining({ height: 3, visibility: VISIBLE }),
          expect.objectContaining({ height: 7, visibility: VISIBLE }),
          expect.objectContaining({ height: 3, visibility: VISIBLE }),
        ],
        [
          expect.objectContaining({ height: 2, visibility: VISIBLE }),
          expect.objectContaining({ height: 5, visibility: VISIBLE }),
          expect.objectContaining({ height: 5, visibility: VISIBLE }),
          expect.objectContaining({ height: 1, visibility: HIDDEN }),
          expect.objectContaining({ height: 2, visibility: VISIBLE }),
        ],
        [
          expect.objectContaining({ height: 6, visibility: VISIBLE }),
          expect.objectContaining({ height: 5, visibility: VISIBLE }),
          expect.objectContaining({ height: 3, visibility: HIDDEN }),
          expect.objectContaining({ height: 3, visibility: VISIBLE }),
          expect.objectContaining({ height: 2, visibility: VISIBLE }),
        ],
        [
          expect.objectContaining({ height: 3, visibility: VISIBLE }),
          expect.objectContaining({ height: 3, visibility: HIDDEN }),
          expect.objectContaining({ height: 5, visibility: VISIBLE }),
          expect.objectContaining({ height: 4, visibility: HIDDEN }),
          expect.objectContaining({ height: 9, visibility: VISIBLE }),
        ],
        [
          expect.objectContaining({ height: 3, visibility: VISIBLE }),
          expect.objectContaining({ height: 5, visibility: VISIBLE }),
          expect.objectContaining({ height: 3, visibility: VISIBLE }),
          expect.objectContaining({ height: 9, visibility: VISIBLE }),
          expect.objectContaining({ height: 0, visibility: VISIBLE }),
        ],
      ];
      expect(visibility).toEqual(expected);
    });

    it.skip("should create visibility map with scenic score for test input", () => {
      expect.assertions(1);
      const map = [
        [3, 0, 3, 7, 3],
        [2, 5, 5, 1, 2],
        [6, 5, 3, 3, 2],
        [3, 3, 5, 4, 9],
        [3, 5, 3, 9, 0],
      ];

      const visibility = setVisibility(map);

      const expected: Tree[][] = [
        [
          { height: 3, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 0, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 3, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 7, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 3, visibility: VISIBLE, scenicScore: expect.anything() },
        ],
        [
          { height: 2, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 5, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 5, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 1, visibility: HIDDEN, scenicScore: expect.anything() },
          { height: 2, visibility: VISIBLE, scenicScore: expect.anything() },
        ],
        [
          { height: 6, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 5, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 3, visibility: HIDDEN, scenicScore: expect.anything() },
          { height: 3, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 2, visibility: VISIBLE, scenicScore: expect.anything() },
        ],
        [
          { height: 3, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 3, visibility: HIDDEN, scenicScore: expect.anything() },
          { height: 5, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 4, visibility: HIDDEN, scenicScore: expect.anything() },
          { height: 9, visibility: VISIBLE, scenicScore: expect.anything() },
        ],
        [
          { height: 3, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 5, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 3, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 9, visibility: VISIBLE, scenicScore: expect.anything() },
          { height: 0, visibility: VISIBLE, scenicScore: expect.anything() },
        ],
      ];
      expect(visibility).toEqual(expected);
    });
  });

  describe("checkVisibility", () => {
    it("should return hidden if surrounding trees are taller in all directions", () => {
      expect.assertions(1);

      const [res] = checkVisibility({
        tree: 1,
        position: [1, 3],
        row: [2, 5, 5, 1, 2],
        column: [7, 1, 3, 4, 9],
      });

      expect(res).toBe("H");
    });

    it("should return visible if surrounding trees are shorter in any direction", () => {
      expect.assertions(1);

      const shorter = 0;
      const [res] = checkVisibility({
        tree: 1,
        position: [1, 3],
        row: [2, 5, 5, 1, 2],
        column: [shorter, 1, 3, 4, 9],
      });

      expect(res).toBe("V");
    });
    it("should return visible if surrounding trees are shorter in any direction", () => {
      expect.assertions(1);

      const shorter = 0;
      const [res] = checkVisibility({
        tree: 1,
        position: [1, 3],
        row: [2, 5, 5, 1, shorter],
        column: [7, 1, 3, 4, 9],
      });

      expect(res).toBe("V");
    });
    it("should return scenicScore for position", () => {
      expect.assertions(1);

      const [, scenicScore] = checkVisibility({
        tree: 5,
        position: [1, 2],
        row: [2, 5, 5, 1, 2],
        column: [3, 5, 3, 5, 3],
      });

      expect(scenicScore).toBe(1 * 1 * 2 * 2);
    });

    it("should return scenicScore for position", () => {
      expect.assertions(1);

      const [, scenicScore] = checkVisibility({
        tree: 5,
        position: [3, 2],
        row: [3, 3, 5, 4, 9],
        column: [3, 5, 3, 5, 3],
      });

      expect(scenicScore).toBe(2 * 2 * 1 * 2);
    });
  });
});
