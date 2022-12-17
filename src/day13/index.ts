import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

async function sumOrderedIndices(filename = REAL_INPUT) {
  const processor = await createLineProcessor(filename);
  let endOfFile = false;
  const READ_NO_LINES = 3;

  const input: any[] = [];

  function callback(lines: string | string[]) {
    if (typeof lines === "string") {
      throw new Error(`Oops, lines: ${lines}`);
    }

    if (lines.length !== READ_NO_LINES) {
      //   console.log("EOF?", lines);
      endOfFile = true;
      // throw new Error(`Oops, end of file?`);
    }

    const left = lines[0];
    const right = lines[1];
    // console.log("left", left);
    // console.log("right", right);

    // calculate if ordered here and just add index?
    input.push([left, right]);
  }

  try {
    while (!endOfFile) {
      await processor({
        callback,
        readNoLines: READ_NO_LINES,
      });
    }

    const compared = input
      .map(([left, right], i) => {
        // console.log(" leftParsed", JSON.parse(left));
        // console.log("rightParsed", JSON.parse(right));

        let res = compare(JSON.parse(left), JSON.parse(right));
        // console.log("res", res);

        //   return compare(l, r);
        return res < 0 ? i + 1 : -1;
      })
      .filter((index) => {
        // console.log("index", index);
        return index > 0;
      });

    console.log("compared.length", compared.length);
    // for (const i of compared) {
    //   console.log(`i: ${i}`);
    // }

    const sum = compared.reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    console.log("sum", sum);
  } catch (error) {
    console.error("error", error);
    endOfFile = true;
  }
}

function compare(left: unknown, right: unknown): number {
  //   console.log("left1", left);
  //   console.log("right1", right);

  if (typeof left === "number" && typeof right === "number") {
    return left - right; // if negative => left < right => i.e. inputs are in the right order
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    // console.log("left3", left);
    // console.log("right3", right);
    const lenLeft = left.flat(Number.POSITIVE_INFINITY).length;
    const lenRight = right.flat(Number.POSITIVE_INFINITY).length;
    // if (lenLeft === 0 && lenRight === 0) return 0
    if (lenLeft === 0 && lenRight > 0) return -1;

    // console.log("left[0]", left[0]);
    // console.log("right[0]", right[0]);

    if (typeof left[0] === "undefined" && typeof right[0] === "undefined") {
      return 0;
    }

    // if (lenLeft === 0 && true)
    for (let i = 0; i < left.length; i++) {
      const b = right[i];
      //   console.log("b", b);
      if (typeof b === "undefined") {
        // Right side ran out of items
        // console.log("right ran out of items!");
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
        //   console.log("left ran out of items!");
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

  console.log("left2", left);
  console.log("right2", right);

  throw new Error("whoopsie");
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await sumOrderedIndices();
})();

// for tests
export { compare };
