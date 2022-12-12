import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import readInput from "../utils/simpleInputReader";

const CANVAS = Array(6 * 40).fill(" ");

async function measureSignalStrength(filename = REAL_INPUT) {
  const instructions = await readInput<ReturnType<typeof parseInstruction>>(
    filename,
    parseInstruction
  );

  const res = execute(instructions, drawCrt(CANVAS));
  // console.log("res", res);

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

function execute(
  instructions: ReturnType<typeof parseInstruction>[],
  draw?: (cycle: number, registerX: number) => void
) {
  let cycle = 0;
  let registerX = 1;
  let arr = [...instructions];
  const result = [];
  while (++cycle) {
    if (typeof draw === "function") draw(cycle, registerX);
    const [i, v] = arr.shift() || [];

    if (i === "addx") {
      result.push(registerX);
      ++cycle;
      if (typeof draw === "function") draw(cycle, registerX);
      registerX += v || 0;
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

function drawCrt(canvas: string[]) {
  return (cycle: number, registerX: number) => {
    const sprite = [registerX - 1, registerX, registerX + 1];
    if (sprite.includes((cycle - 1) % 40)) {
      canvas[cycle - 1] = "#";
    } else {
      canvas[cycle - 1] = ".";
    }

    for (let i = 0; i < canvas.filter((p) => Boolean(p)).length -1; i += 40) {
      console.log(canvas.slice(i, i + 40).join(""));
    }
    console.log("\n");
  };
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await measureSignalStrength();
})();

// for tests
export { parseInstruction, execute };
