import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

type Operation = string;
type Expression = string;
type Instruction = Resolved | Unknown | Pending;
type Resolved = [id: string, n: number];
type Unknown = [id: string, operation: Operation];
type Pending = [id: string, expression: Expression];

const OPERAND = ["+", "-", "/", "*"] as const;
type Operand = typeof OPERAND[number];

const HUMAN = "humn" as const;

async function getRootSum(filename = REAL_INPUT) {
  const input: Instruction[] = await readInput(filename);

  const parsed = input.map(([id, n]) => {
    if (id === HUMAN) {
      return [id, "X"] as Pending;
    } else if (Number.isNaN(Number.parseInt(n as string))) {
      return [id, n] as Unknown;
    } else {
      return [id, parseFloat(n as string)] as Resolved;
    }
  });

  // could be a Map<id, number> instead of tuple array for better performance?
  const resolved = parsed.filter(
    ([_id, n]) => typeof n === "number" || n === "X"
  ) as (Resolved | Pending)[];
  console.log("#resolved", resolved.length);

  const unknown = parsed.filter(
    ([_id, n]) => typeof n === "string" && n !== "X"
  ) as Unknown[];

  console.log("#unknown", unknown.length);

  let i = 0;

  while (unknown.length !== 0) {
    const [id, n] = unknown.shift() as [string, Operation];
    // console.log(`id: ${id}, n: ${n}`);

    const [left, operand, right] = n.trim().split(" ") as [
      left: string,
      operand: Operand,
      right: string
    ];
    // console.log(`left: ${left}, operand: ${operand}, right: ${right}`);

    const ln = resolved.find(([id]) => id === left);
    const rn = resolved.find(([id]) => id === right);

    if (ln && rn) {
      // console.log(`ln: ${ln}`);
      // console.log(`rn: ${rn}`);

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
  const answer = solve(root[1] as string);
  console.log("answer:", answer);
}

function solve(e: Expression): number {
  const [left, right] = arrangeExpression(e);

  // console.log(`right=${right}`);
  // console.log(`left=${left}`);

  if (left === "X") {
    return parseFloat(right);
  }

  // left = right
  else if (left.includes("X")) {
    // always true?
    const [oL, operator] = left.split(" ", 2);
    const oR = left.slice(left.indexOf(operator) + 1).trim();
    console.log(`l: ${oL}, o: ${operator}, r: ${oR}`);

    const [dRight, dR, dL] = [right, oR, oL].map(parseFloat);

    // console.log(
    //   `dRight: ${dRight}, dR: ${dR}, dL: ${dL}, operand: ${operator}`
    // );

    // return l.includes("X")
    //   ? solve(`${l} = ${eval(`${dRight} ${o} ${dR}`)}`)
    //   : solve(`${r} = ${eval(`${dRight} ${o} ${dR}`)}`);
    if (operator === "+") {
      return oL.includes("X")
        ? solve(`${oL} = ${dRight - dR}`)
        : solve(`${oR} = ${dRight - dL}`);
      // return solve(`${r} = ${dRight - dL}`);
    } else if (operator === "-") {
      return oL.includes("X")
        ? solve(`${oL} = ${dRight + dR}`)
        : solve(`${oR} = ${dL - dRight}`);
      // return solve(`${r} = ${dRight + dL}`);
    } else if (operator === "*") {
      return oL.includes("X")
        ? solve(`${oL} = ${dRight / dR}`)
        : solve(`${oR} = ${dRight / dL}`);
      // return solve(`${r} = ${dRight / dL}`);
    } else {
      return oL.includes("X")
        ? solve(`${oL} = ${dRight * dR}`)
        : solve(`${oR} = ${dL / dRight}`);
      // return solve(`${r} = ${dRight * dL}`);
    }
  }
  return Number.POSITIVE_INFINITY;
}

function arrangeExpression(e: Expression): [unsolved: string, solved: string] {
  const [left, right] = e.split("=").map((variable) => {
    const trimmed = variable.trim();
    return trimmed.startsWith("(") && trimmed.endsWith(")")
      ? trimmed.slice(1, -1)
      : trimmed;
  });

  if (left.startsWith("(")) {
    const variableAndOperator = left
      .split("")
      .splice(left.lastIndexOf(")") + 1)
      .join("")
      .split(" ")
      .reverse()
      .join(" ");
    const leftArranged =
      variableAndOperator +
      left
        .split("")
        .splice(0, left.lastIndexOf(")") + 1)
        .join("");

    const [l, o] = leftArranged.split(" ", 2);

    if (o === "-") {
      return [
        [
          `${parseFloat(l) * -1}`,
          " +",
          ...leftArranged.slice(leftArranged.indexOf(o) + 1),
        ].join(""),
        right,
      ];
    }

    if (o === "/") {
      return [
        [
          `${1 / parseFloat(l)}`,
          " *",
          ...leftArranged.slice(leftArranged.indexOf(o) + 1),
        ].join(""),
        right,
      ];
    }

    return [leftArranged, right];
  }

  return left.includes("X") ? [left, right] : [right, left];
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
export { solve, arrangeExpression };
