import { updateBottom, printBottom, getShape } from "./index";
// import { updateBottom, printBottom } from "./index";

describe("index", () => {
  describe("updateBottom", () => {
    it("should update bottom for '-' shape", () => {
      let bottom: any[] = [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
      ];

      const res = updateBottom("-", [2, 1], bottom);
      expect(res).toEqual([
        ...bottom,
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
      ]);
    });
    it("should update bottom for '+' shape", () => {
      let bottom: any[] = [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
        [6, 0],
      ];

      const res = updateBottom("+", [1, 2], bottom);
      printBottom(res);
      expect(res).toEqual([
        ...bottom,
        [1, 2],
        [2, 2],
        [2, 1],
        [2, 3],
        [3, 2],
      ]);
    });
  });
  describe("getShape", () => {
    it("should return '-' when", () => {
      expect.assertions(4);

      expect(getShape(0)).toBe("-");
      expect(getShape(5)).toBe("-");
      expect(getShape(10)).toBe("-");
      expect(getShape(15)).toBe("-");
    });

    it("should return '+' when", () => {
      expect.assertions(4);

      expect(getShape(1)).toBe("+");
      expect(getShape(6)).toBe("+");
      expect(getShape(11)).toBe("+");
      expect(getShape(16)).toBe("+");
    });

    it("should return 'L' when", () => {
      expect.assertions(4);

      expect(getShape(2)).toBe("L");
      expect(getShape(7)).toBe("L");
      expect(getShape(12)).toBe("L");
      expect(getShape(17)).toBe("L");
    });

    it("should return 'I' when", () => {
      expect.assertions(4);

      expect(getShape(3)).toBe("I");
      expect(getShape(8)).toBe("I");
      expect(getShape(13)).toBe("I");
      expect(getShape(18)).toBe("I");
    });

    it("should return 'o' when", () => {
      expect.assertions(4);

      expect(getShape(4)).toBe("o");
      expect(getShape(9)).toBe("o");
      expect(getShape(14)).toBe("o");
      expect(getShape(19)).toBe("o");
    });
  });
});
