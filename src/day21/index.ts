import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

type Operation = string;
type Instruction = Resolved | Unknown;
type Resolved = [id: string, n: number];
type Unknown = [id: string, n: Operation];

const OPERAND = ["+", "-", "/", "*"] as const;
type Operand = typeof OPERAND[number];

async function getRootSum(filename = REAL_INPUT) {
  const input: Instruction[] = await readInput(filename);

  const parsed = input.map(([id, n]) => {
    if (Number.isNaN(Number.parseInt(n as string))) {
      return [id, n] as Unknown;
    } else {
      return [id, parseInt(n as string)] as Resolved;
    }
  });

  // could be a Map<id, number> instead of tuple array for better performance?
  const resolved = parsed.filter(
    ([_id, n]) => typeof n === "number"
  ) as Resolved[];
  console.log(resolved);

  const unknown = parsed.filter(
    ([_id, n]) => typeof n === "string"
  ) as Unknown[];

  console.log(unknown);

  let i = 0;

  while (unknown.length !== 0) {
    const [id, n] = unknown.shift() as [string, string];
    console.log(`id: ${id}, n: ${n}`);
    const [left, operand, right] = n.trim().split(" ") as [
      left: string,
      operand: Operand,
      right: string
    ];
    console.log(`left: ${left}, operand: ${operand}, right: ${right}`);

    const ln = resolved.find(([id]) => id === left);
    const rn = resolved.find(([id]) => id === right);

    if (ln && rn) {
      if (operand == "+") {
        resolved.push([id, ln[1] + rn[1]]);
      } else if (operand === "-") {
        resolved.push([id, ln[1] - rn[1]]);
      } else if (operand === "*") {
        resolved.push([id, ln[1] * rn[1]]);
      } else {
        resolved.push([id, ln[1] / rn[1]]);
      }
      // if (id === 'root') {
      //   console.log('BREAK');
      // }
    } else {
      console.log('CONTINUE');
      
      unknown.push([id, n]);
    }
    i++;
  }
  console.log(`final i: ${i}`);

  console.log(resolved);

  const root = resolved.find(([id]) => id === 'root')
  console.log('root =', root)
}

async function readInput(filename: string): Promise<Instruction[]> {
  const processor = await createLineProcessor(filename);

  const input: Instruction[] = [];

  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error(`Oops, lines: ${line}`);
    }

    input.push(line.split(":") as Instruction);
  }

  try {
    await processor({
      callback,
    });
  } catch (error) {
    console.error("error", error);
  }
  return input;
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;
  console.time("run");

  const res = await getRootSum();

  console.timeEnd("run");
})();

// for tests
export {};
