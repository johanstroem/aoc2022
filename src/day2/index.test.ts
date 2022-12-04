import readline from "readline";
import fs from "fs";
import { calculateScore, isDraw, playerWin, rockPaperScissor } from "./index";

describe("index", () => {
  describe("isDraw", () => {
    beforeEach(async () => {});
    it("should return true for ROCK (A) and ROCK (X)", async () => {
      expect.assertions(1);
      const result = isDraw("A", "X");
      expect(result).toBe(true);
    });
    it("should return true for PAPER (B) and PAPER (Y)", async () => {
      expect.assertions(1);
      const result = isDraw("B", "Y");
      expect(result).toBe(true);
    });
    it("should return true for SCISSOR (C) and SCISSOR (Z)", async () => {
      expect.assertions(1);
      const result = isDraw("C", "Z");
      expect(result).toBe(true);
    });
  });

  describe("playerWin", () => {
    it("should return true for ROCK (X) vs SCISSOR (C)", async () => {
      expect.assertions(1);
      const result = playerWin("C", "X");
      expect(result).toBe(true);
    });

    it("should return false for ROCK(X) vs PAPER (B)", async () => {
      expect.assertions(1);
      const result = playerWin("B", "X");
      expect(result).toBe(false);
    });

    it("should return true for SCISSOR(Z) vs PAPER (B)", async () => {
      expect.assertions(1);
      const result = playerWin("B", "Z");
      expect(result).toBe(true);
    });
  });

  describe("calculateScore", () => {
    it("should return 8 points for ROCK(A) vs PAPER (Y)", async () => {
      expect.assertions(1);
      const result = calculateScore(["A", "Y"]);
      expect(result).toBe(8);
    });

    it("should return 1 points for PAPER(B) vs ROCK(X)", async () => {
      expect.assertions(1);
      const result = calculateScore(["B", "X"]);
      expect(result).toBe(1);
    });

    it("should return 6 points for SCISSOR(C) vs SCISSOR (Z)", async () => {
      expect.assertions(1);
      const result = calculateScore(["C", "Z"]);
      expect(result).toBe(6);
    });
  });

  describe("calculateScore", () => {
    it("should return 8 points for ROCK(A) vs PAPER (Y)", async () => {
      expect.assertions(1);
      const result = calculateScore(["A", "Y"]);
      expect(result).toBe(8);
    });

    it("should return 1 points for PAPER(B) vs ROCK(X)", async () => {
      expect.assertions(1);
      const result = calculateScore(["B", "X"]);
      expect(result).toBe(1);
    });

    it("should return 6 points for SCISSOR(C) vs SCISSOR (Z)", async () => {
      expect.assertions(1);
      const result = calculateScore(["C", "Z"]);
      expect(result).toBe(6);
    });
  });

  describe("with test input", () => {
    let rl: any;

    beforeEach(async () => {
      rl = readline.createInterface({
        input: fs.createReadStream("./src/day2/input_test.txt"),
        crlfDelay: Infinity,
      });
    });

    it("should return 12 points", async () => {
      expect.assertions(1);
      const result = await rockPaperScissor(rl);

      expect(result).toBe(12);
    });
  });

  describe("with real input", () => {
    let rl: any;

    beforeEach(async () => {
      rl = readline.createInterface({
        input: fs.createReadStream("./src/day2/input.txt"),
        crlfDelay: Infinity,
      });
    });

    it("should return 10334 points", async () => {
      expect.assertions(1);
      const result = await rockPaperScissor(rl);

      expect(result).toBe(10334);
    });
  });
});
