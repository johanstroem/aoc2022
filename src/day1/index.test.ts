import { calorieCount } from "./index";

describe("index", () => {
  describe("CalorieCount with test input", () => {
    beforeEach(async () => {});
    it("should return 24000 as max value (part 1)", async () => {
      expect.assertions(1);
      const [max] = await calorieCount("./src/day1/input_test.txt");
      expect(max).toBe(24000);
    });

    it("should return 45000 as top 3 combined value (part 2)", async () => {
      expect.assertions(1);
      const [, top3] = await calorieCount("./src/day1/input_test.txt");
      expect(top3).toBe(45000);
    });
  });

  describe("CalorieCount with real input", () => {
    beforeEach(async () => {});
    it("should return 72070 as max value (part 1)", async () => {
      expect.assertions(1);
      const [max] = await calorieCount("./src/day1/input.txt");
      expect(max).toBe(72070);
    });

    it("should return 211805 as top 3 combined value (part 2)", async () => {
      expect.assertions(1);
      const [, top3] = await calorieCount("./src/day1/input.txt");
      expect(top3).toBe(211805);
    });
  });
});
