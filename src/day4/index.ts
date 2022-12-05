import { processNLines, REAL_INPUT, TEST_INPUT } from "../utils";

async function countContainedRanges(filename = TEST_INPUT) {
  let count = 0;

  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error("oops");
    }

    const [range1, range2] = parseRanges(line);

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
    await processNLines({ filename, callback });
  } catch (error) {
    console.error("error", error);
  }

  console.log("count", count);
  return count;
}

async function countOverlappingRanges(filename = TEST_INPUT) {
  let count = 0;

  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error("oops");
    }

    const [range1, range2] = parseRanges(line);

    if (range1.min <= range2.min && range1.max >= range2.min) {
      console.log(`range 1 overlap`);

      printRange(range1);
      printRange(range2);
      count += 1;
    } else if (range2.min <= range1.min && range2.max >= range1.min) {
      console.log(`range 2 overlap`);

      printRange(range1);
      printRange(range2);
      count += 1;
    }
  }

  try {
    await processNLines({ filename, callback });
  } catch (error) {
    console.error("error", error);
  }

  console.log("count", count);
  return count;
}

function parseRanges(line: string) {
  return line.split(",").map((range) => {
    const [min, max] = range.split("-");
    return {
      length: 1 + +max - +min,
      min: +min,
      max: +max,
    };
  });
}

(async function run() {
  // await countContainedRanges(REAL_INPUT);
  await countOverlappingRanges(REAL_INPUT);
})();

function printRange(range: { length: number; min: number; max: number }) {
  let output = "";
  for (let i = 1; i < range.min; i++) {
    output += ".";
  }
  for (let i = range.min; i <= range.max; i++) {
    output += i;
  }
  for (let i = range.max + 1; i < 10; i++) {
    output += ".";
  }
  console.log(output);
}

// for tests
export {};
