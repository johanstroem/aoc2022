import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

type Operation = string;
type Expression = string;

type Instruction<T> = [id: string, InstructionType: T];

const OPERATORS = ["+", "-", "/", "*"] as const;
type Operator = typeof OPERATORS[number];

const HUMAN = "humn" as const;

async function getRootSum(filename = REAL_INPUT) {
  const input: Instruction<unknown>[] = await readInput(filename);

  const parsed = input.map(([id, n]) => {
    if (id === HUMAN) {
      return [id, "X"] as Instruction<Expression>;
    } else if (Number.isNaN(Number.parseInt(n as string))) {
      return [id, n] as Instruction<Operation>;
    } else {
      return [id, parseFloat(n as string)] as Instruction<number>;
    }
  });

  // could be a Map<id, number> instead of tuple array for better performance?
  const resolved = parsed.filter(
    ([_id, n]) => typeof n === "number" || n === "X"
  ) as Instruction<Expression | number>[];
  console.log("#resolved", resolved.length);

  // use Partition fn to partition into resolved and unknown
  const unknown = parsed.filter(
    ([_id, n]) => typeof n === "string" && n !== "X"
  ) as Instruction<Operation>[];

  console.log("#unknown", unknown.length);

  let i = 0;

  while (unknown.length) {
    const [id, n] = unknown.shift() as [string, Operation];

    const [left, operand, right] = n.trim().split(" ") as [
      left: string,
      operand: Operator,
      right: string
    ];
    // console.log(`left: ${left}, operand: ${operand}, right: ${right}`);

    const ln = resolved.find(([id]) => id === left);
    const rn = resolved.find(([id]) => id === right);

    if (ln && rn) {
      const statement = `${ln[1]} ${operand} ${rn[1]}`;
      if (typeof ln[1] === "string" || typeof rn[1] === "string") {
        if (id === "root") {
          console.log("@ROOT");
          resolved.push([id, `${ln[1]} = ${rn[1]}`]);
          break;
        }
        resolved.push([id, `(${statement})`]);
      } else {
        resolved.push([id, eval(statement)]);
        if (id === "root") {
          console.log("BREAK @ ROOT, fully solved?");
          break;
        }
      }
    } else {
      if (unknown.length === 1 && id === HUMAN) {
        break;
      }
      unknown.push([id, n]);
    }
    i++;
  }
  console.log(`final i: ${i}`);

  const root = resolved.find(([id]) => id === "root");
  console.log(root);

  if (!root) {
    throw new Error(`Root not found`);
  }
  const answer = solve(root[1] as Expression);
  console.log("answer:", answer);
}

function solve(e: Expression): number {
  const [operand, operator, rest, right] = arrangeExpression(e);

  if (!operator) {
    return right;
  }

  if (operator === "+") {
    return solve(`${rest} = ${right - operand}`);
  } else if (operator === "-") {
    return solve(`${rest} = ${operand - right}`);
  } else if (operator === "*") {
    return solve(`${rest} = ${right / operand}`);
  } else {
    return solve(`${rest} = ${operand / right}`);
  }
}

function arrangeExpression(
  e: Expression
): [operand: number, operator: Operator, rest: Expression, right: number] {
  let [left, right] = e
    .split("=")
    .map((variable) => {
      const trimmed = variable.trim();
      return trimmed.startsWith("(") && trimmed.endsWith(")")
        ? trimmed.slice(1, -1)
        : trimmed;
    })
    .sort((_a, b) => b.indexOf("X"));

  let fromEnd = false;
  if (left.startsWith("(") || left.startsWith("X")) {
    const variableAndOperator = left
      .substring(left.lastIndexOf(")") + 1)
      .split(" ")
      .reverse()
      .join(" ");
    left =
      variableAndOperator +
      left
        .split("")
        .splice(0, left.lastIndexOf(")") + 1)
        .join("");

    fromEnd = true;
  }

  const [l, o] = left.split(" ", 2) as [string, Operator];
  const rest = left.slice(left.indexOf(o) + 1);

  let operand: number | "X" = l === "X" ? "X" : parseFloat(l);
  let operator = o;

  if (fromEnd && o === "-") {
    operand = l === "X" ? "X" : parseFloat(l) * -1;
    operator = "+";
  }

  if (fromEnd && o === "/") {
    operand = l === "X" ? "X" : 1 / parseFloat(l);
    operator = "*";
  }

  if (operand === "X") {
    return [parseFloat(rest.trim()), operator, "X", parseFloat(right)];
  }
  return [operand, operator, rest.trim(), parseFloat(right)];
}

async function readInput(filename: string): Promise<Instruction<unknown>[]> {
  const processor = await createLineProcessor(filename);

  const input: Instruction<unknown>[] = [];

  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error(`Oops, lines: ${line}`);
    }

    input.push(line.split(":") as Instruction<unknown>);
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
export { solve, arrangeExpression };
