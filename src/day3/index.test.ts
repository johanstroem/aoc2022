import readline from "readline";
import fs from "fs";
import { getCharValue, getPriority } from "./index";

describe("index", () => {
  describe("getPriority", () => {
    it("should return 16 for vJrwpWtwJgWrhcsFMMfFFhFp", () => {
      expect.assertions(1);
      const result = getPriority("vJrwpWtwJgWrhcsFMMfFFhFp");
      expect(result).toBe(16);
    });
    it("should return 38 for jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL", () => {
      expect.assertions(1);
      const result = getPriority("jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL");
      expect(result).toBe(38);
    });
    it("should return 42 for PmmdzqPrVvPwwTWBwg", () => {
      expect.assertions(1);
      const result = getPriority("PmmdzqPrVvPwwTWBwg");
      expect(result).toBe(42);
    });
    it("should return 22 for wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn", () => {
      expect.assertions(1);
      const result = getPriority("wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn");
      expect(result).toBe(22);
    });
    it("should return 20 for ttgJtRGJQctTZtZT", () => {
      expect.assertions(1);
      const result = getPriority("ttgJtRGJQctTZtZT");
      expect(result).toBe(20);
    });
    it("should return 19 for CrZsJsPPZsGzwwsLwLmpwMDwß", () => {
      expect.assertions(1);
      const result = getPriority("CrZsJsPPZsGzwwsLwLmpwMDwß");
      expect(result).toBe(19);
    });
  });

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
});
