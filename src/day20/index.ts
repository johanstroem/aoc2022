import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

type Encoded = string;
type Decoded = number;

type Code = (Encoded | Decoded)[];

async function decodeCoordinates(filename = REAL_INPUT) {
  const input: Code = await readInput(filename);
  const realInputLength = input.length;

  const ITERATIONS = 10;
  Array(ITERATIONS)
    .fill(null)
    .forEach((_, k) => {
      // console.log("K", k + 1);

      [...input].forEach((_e, i, arr) => {
        const currentIndex = input.findIndex((e) =>
          typeof e === "string" ? e.endsWith(`:${i}`) : -1
        );

        const e = input.at(currentIndex);

        if (typeof e !== "string") {
          throw new Error(`Tried to decrypt already decrypted item: ${e}`);
        }
        const [n, _oi] = e.split(":");

        const normalizedSteps = parseInt(n) % (input.length - 1);

        input.splice(currentIndex, 1);

        const spliceIndex = currentIndex + normalizedSteps;

        // console.log(
        //   `n: ${n}, normalizedSteps: ${normalizedSteps}, currentIndex: ${currentIndex} => spliceIndex: ${spliceIndex} => ${
        //     spliceIndex % (realInputLength - 1)
        //   }`
        // );

        if (normalizedSteps < 0 && spliceIndex === 0) {
          input.splice(realInputLength, 0, e);
        } else {
          spliceIndex > realInputLength - 1
            ? input.splice(spliceIndex % (realInputLength - 1), 0, e)
            : input.splice(spliceIndex, 0, e);
        }
      });
      // console.log(
      //   input
      //     .join(", ")
      // );
    });

  const decoded: Decoded[] = input.map((e) =>
    parseInt(typeof e === "string" ? e.split(":")[0] : "oops")
  );

  // console.log("input", input);
  // console.log("decoded", decoded);

  const zeroIndex = decoded.findIndex((e) => e === 0);

  console.log("zeroIndex", zeroIndex);

  const _1000th = decoded[(zeroIndex + 1000) % decoded.length];
  const _2000th = decoded[(zeroIndex + 2000) % decoded.length];
  const _3000th = decoded[(zeroIndex + 3000) % decoded.length];

  console.log(`1000th: ${_1000th}, 2000th: ${_2000th}, 3000th: ${_3000th}`);

  console.log("result =", _1000th + _2000th + _3000th);
}

const DECRYPTION_KEY = 811589153;
async function readInput(filename: string): Promise<Encoded[]> {
  const processor = await createLineProcessor(filename);

  const input: Encoded[] = [];
  let i = 0;
  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error(`Oops, lines: ${line}`);
    }

    const num = parseInt(line) * DECRYPTION_KEY;
    input.push(`${num}:${i++}`);

    // parseInt(line)
  }

  try {
    await processor({
      callback,
    });
  } catch (error) {
    console.error("error", error);
  }
  return input;
  // return unprocessed.map((n, i) => {
  //   return `${n % unprocessed.length}:${i}`;
  // });
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;
  console.time("run");

  const res = await decodeCoordinates();

  console.timeEnd("run");
})();

// for tests
export {};
