import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import processNLines from "../utils/processNLines";

async function getInitialState(filename: string) {
  function callback(lines: string | string[]) {
    if (typeof lines === "string") {
      throw new Error("oops");
    }

    return lines;
  }

  try {
    const result = await processNLines({
      filename,
      callback,
      n: Number.POSITIVE_INFINITY,
      returnCondition: (line) => line === "",
    });

    return {
      initialState: parseInitialState(result!.lines),
      endLine: result!.endLine,
    };
  } catch (error) {
    console.error("error", error);
  }
}

function parseInitialState(lines: string[]) {
  const boxes = lines.slice(0, -1);
  const indexLine = lines.slice(-1)[0];

  const parsed = [...Array(indexLine.replace(/\s/g, "").length)].map((_) =>
    Array()
  );

  boxes.forEach((line) => {
    for (let i = 1, j = 0; i < line.length; i += 4, j++) {
      if (line[i] !== " ") {
        parsed[j].push(line[i]);
      }
    }
  });
  return parsed;
}

async function processMoves(
  filename: string,
  initialState: string[][],
  startLine: number
) {
  let state = initialState;

  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error("oops");
    }

    state = moveBox(state, parseLine(line));
  }

  try {
    await processNLines({
      filename,
      callback,
      startLine,
    });

    return { state };
  } catch (error) {
    console.error("error", error);
  }
}

function parseLine(line: string) {
  const [n, from, to] = line
    .split(" ")
    .filter((p) => parseInt(p))
    .map((n) => parseInt(n));
  return {
    n,
    from,
    to,
  };
}

function moveBox(
  state: string[][],
  { n, to, from }: ReturnType<typeof parseLine>
) {
  const newState = state.map((stack, i, arr) => {
    if (i + 1 === from) {
      return stack.slice(n);
    }

    if (i + 1 === to) {
      return [...arr[from - 1].slice(0, n).reverse(), ...stack];
    }
    return stack;
  });

  return newState;
}

async function moveBoxes(filename = REAL_INPUT) {
  const { initialState, endLine = 0 } = (await getInitialState(filename)) || {};

  if (!initialState) {
    throw new Error("Oops, cannot read initial state");
  }

  const { state } = await processMoves(filename, initialState, endLine + 1) || {};

  if (!state) {
    throw new Error("Oops, error processing moves");
  }

  console.log("final state", state);
  const topBoxes = state.map((stack) => {
    return stack[0];
  });

  console.log("topBoxes", topBoxes.toString().replaceAll(",", ""));
}

(async function run() {
  await moveBoxes();
})();

// for tests
export { moveBox, parseInitialState, parseLine };
