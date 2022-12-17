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

    console.log("input flat.length", [...input.flat()].length);
    console.log([...input.flat()]);
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
  //   console.log("left", left);
  //   console.log("right", right);

  if (typeof left === "number" && typeof right === "number") {
    return left - right; // if negative => left < right => i.e. inputs are in the right order
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    // console.log("left3", left);
    // console.log("right3", right);
    const lenLeft = left.flat(Number.POSITIVE_INFINITY).length;
    const lenRight = right.flat(Number.POSITIVE_INFINITY).length;
    // console.log("lenLeft", lenLeft);
    // console.log("lenRight", lenRight);

    // if (lenLeft === 0 && lenRight === 0) return 0
    if (lenLeft === 0 && lenRight > 0) return -1;

    // console.log("left[0]", left[0]);
    // console.log("right[0]", right[0]);

    if (typeof left[0] === "undefined" && typeof right[0] === "undefined") {
      return 0;
    }

    if (typeof left[0] === "undefined" && typeof right[0] !== "undefined") {
      console.log("left length 0, left ran out of items!");
      return -1;
    }

    // if (lenLeft === 0 && true)
    for (let i = 0; i < left.length; i++) {
      const b = right[i];
      // console.log("b", b);
      if (typeof b === "undefined") {
        // Right side ran out of items
        console.log("right ran out of items!");
        return 1;
      }
      const res = compare(left[i], b);
      if (i === left.length - 1) {
        // last iteration
        // const nextB = right[i + 1];
        // if (typeof nextB !== "undefined") {
        //   // Left side ran out of items
        //   console.log("left ran out of items!");
        //   return -1;
        // }s

        if (res > 0) return 1;
        if (lenLeft < lenRight) {
          console.log("left ran out of items!");
          return -1;
        }
        return res;
      } else if (res === 0) continue;
      else return res;
    }
    // return res
  }

  if (typeof left === "number") {
    return compare([left], right);
  }

  if (typeof right === "number") {
    return compare(left, [right]);
  }

  //   console.log("left2", left);
  //   console.log("right2", right);

  throw new Error(`Whoopsie. Error comparing ${left} & ${right} `);
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await sumOrderedIndices();
})();

// for tests
export { compare };
