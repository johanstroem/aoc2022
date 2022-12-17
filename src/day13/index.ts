import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

type Packet = String;

type Pair = [left: Packet, right: Packet];

async function sumOrderedIndices(filename = REAL_INPUT) {
  const processor = await createLineProcessor(filename);
  let endOfFile = false;
  const READ_NO_LINES = 3;

  const input: Pair[] = [];

  function callback(lines: string | string[]) {
    if (typeof lines === "string") {
      throw new Error(`Oops, lines: ${lines}`);
    }

    if (lines.length !== READ_NO_LINES) {
      console.log("EOF?", lines);
      endOfFile = true;
    }

    // calculate if ordered here and just add index?
    input.push([JSON.parse(lines[0]), JSON.parse(lines[1])]);
  }

  try {
    while (!endOfFile) {
      await processor({
        callback,
        readNoLines: READ_NO_LINES,
      });
    }

    const orderedIndices = input
      .map(([left, right], i) => {
        return compare(left, right) < 0 ? i + 1 : -1;
      })
      .filter((index) => {
        return index > 0;
      });

    const sum = orderedIndices.reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    console.log("sum", sum);

    const [divider1, divider2] = [[[2]], [[6]]];

    // console.log("input flat.length", [...input.flat()].length);
    // console.log([...input.flat()]);
    const ordered = [divider1, divider2, ...input.flat()].sort(compare);

    const d1 = ordered.indexOf(divider1) + 1;
    const d2 = ordered.indexOf(divider2) + 1;

    console.log("decoderKey", d1 * d2);
  } catch (error) {
    console.error("error", error);
    endOfFile = true;
  }
}

function compare(left: unknown, right: unknown): number {
  if (typeof left === "number" && typeof right === "number") {
    return left - right; // if negative => left < right => i.e. inputs are in the right order
  }

  if (typeof left === "number") {
    return compare([left], right);
  }

  if (typeof right === "number") {
    return compare(left, [right]);
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (typeof left[0] === "undefined") {
      return typeof right[0] === "undefined" ? 0 : -1;
    }

    for (const [i, l] of left.entries()) {
      const r = right[i];

      if (typeof r === "undefined") {
        // Right side ran out of items
        return 1;
      }
      const res = compare(l, r);

      if (i === left.length - 1) {
        // last iteration for left

        if (res > 0) return 1;
        if (typeof right[i + 1] !== "undefined") {
          return -1;
        }
      } else if (res === 0) {
        continue;
      }
      return res;
    }
  }

  

  throw new Error(`Whoopsie. Error comparing ${left} & ${right} `);
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await sumOrderedIndices();
})();

// for tests
export { compare };
