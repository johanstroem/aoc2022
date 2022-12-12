import readInput from "../utils/simpleInputReader";
import { parseInstruction, execute } from "./index";

describe("index", () => {
  describe("readInput", () => {
    it("should read and parse test input", async () => {
      expect.assertions(1);

      const res = await readInput(
        "./src/day10/input_test_small.txt",
        parseInstruction
      );
      expect(res).toEqual([
        ["addx", 15],
        ["addx", -11],
        ["addx", 6],
        ["addx", -3],
        ["addx", 5],
        ["addx", -1],
        ["addx", -8],
        ["addx", 13],
        ["addx", 4],
        ["noop"],
      ]);
    });
  });

  describe("execute", () => {
    it("should read instructions and calculate registerX value", () => {
      expect.assertions(1);

      const instructions: any[] = [
        ["addx", 15],
        ["addx", -11],
        ["addx", 6],
        ["addx", -3],
        ["addx", 5],
        ["addx", -1],
        ["addx", -8],
        ["addx", 13],
        ["addx", 4],
        ["noop"],
      ];
      const res = execute(instructions);
      expect(res).toEqual([
        1, 16, 16, 5, 5, 11, 11, 8, 8, 13, 13, 12, 12, 4, 4, 17, 17, 21, 21,
      ]);
    });
  });
});
