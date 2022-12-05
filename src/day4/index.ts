import { processNLines, REAL_INPUT, TEST_INPUT } from "../utils";

async function countContainedRanges(filename = TEST_INPUT) {
  let count = 0;

  function callback(lines: string[]) {
    const line = lines[0];
    const [range1, range2] = line.split(",").map((range) => {
      const [min, max] = range.split("-");
      return {
        length: 1 + +max - +min,
        min: +min,
        max: +max,
      };
    });

    if (range1.length > range2.length) {
      if (range2.min >= range1.min && range2.max <= range1.max) {
        count += 1;
      }
    }

    if (range2.length >= range1.length) {
      if (range1.min >= range2.min && range1.max <= range2.max) {
        count += 1;
      }
    }
  }

  try {
    await processNLines(filename, callback);
  } catch (error) {
    console.error("error", error);
  }

  console.log("count", count);
  return count;
}

(async function run() {
  await countContainedRanges(REAL_INPUT);
})();

// for tests
export {};
