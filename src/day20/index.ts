import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

type Encoded = string;
type Decoded = number;

type Code = (Encoded | Decoded)[];

async function decodeCoordinates(filename = REAL_INPUT) {
  const input: Code = await readInput(filename);
  const realInputLength = input.length;

  console.log("input", input);

  [...input].forEach((e, i, arr) => {
    if (typeof e !== "string") {
      throw new Error(`Tried to decrypt already decrypted item: ${e}`);
    }
    const [n, _oi] = e.split(":");

    // normalize input, remove steps > input.length -1
    const normalizedSteps = parseInt(n) % (input.length - 1);
    const currentIndex = input.findIndex((e) =>
      typeof e === "string" ? e.endsWith(`:${i}`) : -1
    );

    input.splice(currentIndex, 1);

    const spliceIndex = currentIndex + normalizedSteps;

    if (spliceIndex === 0) {
      input.splice(realInputLength, 0, n);
    } else {
      spliceIndex > realInputLength
        ? input.splice(spliceIndex % (realInputLength - 1), 0, n)
        : input.splice(spliceIndex, 0, n);
    }
  });

  const decoded: Decoded[] = input.map((e) =>
    parseInt(typeof e === "string" ? e.split(":")[0] : "oops")
  );

  // console.log("input", input);
  console.log("decoded", decoded);

  const zeroIndex = decoded.findIndex((e) => e === 0);

  const _1000th = decoded[(zeroIndex + 1000) % decoded.length];
  const _2000th = decoded[(zeroIndex + 2000) % decoded.length];
  const _3000th = decoded[(zeroIndex + 3000) % decoded.length];

  // console.log(`1000th: ${_1000th}, 2000th: ${_2000th}, 3000th: ${_3000th}`);

  console.log("result =", _1000th + _2000th + _3000th);
}

async function readInput(filename: string): Promise<Encoded[]> {
  const processor = await createLineProcessor(filename);

  const input: Encoded[] = [];
  let i = 0;
  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error(`Oops, lines: ${line}`);
    }

    input.push(`${line}:${i++}`);

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
