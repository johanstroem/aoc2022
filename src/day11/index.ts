import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

const NUMBER_OF_MONKEYS = 8;
const NUMBER_OF_ROUNDS = 10000;

async function calculateMonkeyBusiness(filename = REAL_INPUT) {
  const monkeys = await parseMonkeys(filename);
  //   console.log("monkeys", monkeys);

  const inspections = monkeys.map((m) => m.inspections);
//   console.log("inspections", inspections);
  const inspectionsSorted = inspections.sort((a, b) => b - a);
  console.log("inspectionsSorted", inspectionsSorted);
  const monkeyBusiness = inspectionsSorted[0] * inspectionsSorted[1];
  console.log("monkeyBusiness", monkeyBusiness);
}

type Monkey = {
  items: number[];
  operation: (worry: number) => number;
  test: (worry: number) => number;
  divisor: number;
  inspections: number;
};

async function parseMonkeys(filename: string) {
  let monkeys: Monkey[] = [];

  const processor = await createLineProcessor(filename);

  function callback(lines: string | string[]) {
    if (typeof lines === "string") {
      throw new Error("oops");
    }
    const items = parseItems(lines[1]);

    const [_arg1, operation, arg2] = parseOperation(lines[2]);
    const [test, whenTrue, whenFalse] = parseTest(lines.splice(3));
    const monkey: Monkey = {
      items,
      operation: (worry) => {
        if (operation === "*") {
          return worry * (arg2 === "old" ? worry : parseInt(arg2));
        } else if (operation === "+") {
          return worry + (arg2 === "old" ? worry : parseInt(arg2));
        } else {
          throw new Error("unknown sign");
        }
      },
      test: (worry) => {
        return worry % test == 0 ? whenTrue : whenFalse;
      },
      divisor: test,
      inspections: 0,
    };

    monkeys.push(monkey);
  }

  try {
    const MONKEY_LINES = 7;
    for (let i = 0; i < NUMBER_OF_MONKEYS; i++) {
      await processor({
        callback,
        readNoLines: MONKEY_LINES,
        startLine: i * MONKEY_LINES,
      });
    }

    const worryReducer = (worry: number) => {
      const lcd = monkeys.reduce((acc, m) => {
        return acc * m.divisor;
      }, 1);

      return worry % lcd;
    };

    for (let i = 0; i < NUMBER_OF_ROUNDS * monkeys.length; i++) {
      monkeys = doTurn(
        monkeys[i % monkeys.length],
        i % monkeys.length,
        monkeys,
        worryReducer
      );
    }
  } catch (error) {
    console.error("error", error);
  }

  return monkeys;
}

function doTurn(
  monkey: Monkey,
  i: number,
  arr: Monkey[],
  //   testFn: (worry: number) => number
  worryReducer: (number: number) => number
): Monkey[] {
  const copy = arr.map((m) => ({
    ...m,
  }));
  monkey.items.forEach((item) => {
    let worry = monkey.operation(item);
    worry = worryReducer(worry);
    const throwTo = monkey.test(worry);
    copy[throwTo].items.push(worry);
  });

  copy[i] = {
    ...copy[i],
    items: [],
    inspections: copy[i].inspections + monkey.items.length,
  };
  return copy;
}

function parseItems(line: string) {
  return line
    .split(":")[1]
    .replaceAll(",", "")
    .split(" ")
    .filter((p) => parseInt(p))
    .map((n) => parseInt(n));
}

function parseOperation(line: string) {
  return line.split(":")[1].split("=")[1].trim().split(" ") as [
    arg1: "old",
    operation: "+" | "*",
    arg2: "old" | string
  ];
}

function parseTest(lines: string[]) {
  return [
    parseInt(lines[0].replace(/^\D+/g, "")),
    parseInt(lines[1].replace(/^\D+/g, "")),
    parseInt(lines[2].replace(/^\D+/g, "")),
  ] as [test: number, whenTrue: number, whenFalse: number];
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await calculateMonkeyBusiness();
})();

// for tests
export {};
