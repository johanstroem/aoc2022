import getCharValue from "./getCharValue";

describe("getCharValue", () => {
    it("should return 1 for 'a'", () => {
      expect.assertions(1);
      const result = getCharValue("a");
      expect(result).toBe(1);
    });
    it("should return 26 for 'z'", () => {
      expect.assertions(1);
      const result = getCharValue("z");
      expect(result).toBe(26);
    });
    it("should return 27 for 'A'", () => {
      expect.assertions(1);
      const result = getCharValue("A");
      expect(result).toBe(27);
    });
    it("should return 52 for 'Z'", () => {
      expect.assertions(1);
      const result = getCharValue("Z");
      expect(result).toBe(52);
    });
  });