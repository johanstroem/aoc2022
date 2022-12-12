import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import readInput from "../utils/simpleInputReader";

async function measureSignalStrength(filename = REAL_INPUT) {
  const instructions = await readInput<ReturnType<typeof parseInstruction>>(
    filename,
    parseInstruction
  );

  const res = readInstructions(instructions);
  // console.log("res", res);
  // console.log(`signalStrength cycle during 20 = ${20 * res[20 - 2]}`);
  // console.log(`res[217-2] = ${res[217 - 2]}`);
  // console.log(`res[218-2] = ${res[218 - 2]}`);
  // console.log(`res[219-2] = ${res[219 - 2]}`);
  // console.log(`res[220-2] = ${res[220 - 2]}`);
  // console.log(`res[221-2] = ${res[221 - 2]}`);
  // console.log(`res[222-2] = ${res[222 - 2]}`);
  // console.log(`signalStrength cycle during 220 = ${220 * res[220 - 2]}`);

  let sum = 0;
  for (let i = 20; i < res.length - 1; i += 40) {
    sum += res[i - 2] * i;
  }

  console.log("sum", sum);
}

type Instruction = "addx" | "noop";

function parseInstruction(
  line: string
): [instruction: Instruction, n?: number] {
  const [instruction, n] = line.split(" ");
  return Number(n)
    ? [instruction as Instruction, Number(n)]
    : [instruction as Instruction];
}

function readInstructions(instructions: ReturnType<typeof parseInstruction>[]) {
  let cycle = 0;
  let registerX = 1;
  let arr = [...instructions];
  const result = [];
  while (++cycle) {
    // console.log("cycle", cycle);
    const [i, v] = arr.shift() || [];

    // console.log(`instruction = ${i}`);
    if (i === "addx") {
      result.push(registerX);
      registerX += v || 0;
      // console.log(`value = ${v}, registerX = ${registerX}`);
      ++cycle;
      result.push(registerX);
    } else if (i === "noop") {
      result.push(registerX);
      continue;
    } else {
      break;
    }
  }
  return result;
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await measureSignalStrength();
})();

// for tests
export { parseInstruction, readInstructions };
