import { calculateScore, isDraw, playerWin } from "./index";

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
});
