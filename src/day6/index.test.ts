import { findMarker } from "./index";
import { REAL_INPUT, TEST_INPUT } from "../utils";

describe("index", () => {
  describe("findMarker", () => {
    it("should return end index of start sequence", () => {
      expect.assertions(5);

      expect(findMarker("mjqjpqmgbljsphdztnvjfqwrcgsmlb")).toBe(7);
      expect(findMarker("bvwbjplbgvbhsrlpgdmjqwftvncz")).toBe(5);
      expect(findMarker("nppdvjthqldpwncqszvftbrmjlhg")).toBe(6);
      expect(findMarker("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")).toBe(10);
      expect(findMarker("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw")).toBe(11);
    });
  });
});
