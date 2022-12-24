import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

async function releasePressure(filename = REAL_INPUT) {
  const state = await readInput(filename);
  // console.log("STATE", state);

  //   const reducer =
  const result = [];

  // const ITERATIONS = 100_000;
  const ITERATIONS = 10_000;
  // const ITERATIONS = 1_000;
  // const ITERATIONS = 500;
  // const ITERATIONS = 1;

  console.log("================ START ==================");

  for (let i = 0; i < ITERATIONS; i++) {
    const r = iterate(state);
    result.push(r);
  }
  // console.log("RESULT", result.length);

  const sorted = result.sort((a, b) => b.score - a.score);

  console.log(
    "sorted top 10",
    sorted.slice(0, 10).map((n) => n.score)
  );

  const max = Math.max(...result.map((r) => r.score));
  console.log("max", max);
}

type Valve = string;

type ValveNode = {
  name: Valve;
  flowRate: number;
  //   visited: boolean;
  tunnels: Valve[]; // should be ValveNode[]?
  peek: (n: number) => number;
  //   open: (n: number) => number;
};

type State = {
  currentLocation: Valve;
  currentTunnels: Valve[];
  elapsedMinutes: number;
  opened: ValveNode[];
  visited: ValveNode[];
  // unvisited: ValveNode[];
  score: number; // Pressure released
};

type Actions = {
  // 'OPEN': (valve: Valve) => void
  OPEN: () => void; // Opens
  // 'MOVE': (from: Valve, to: Valve) => void
  MOVE: (to: Valve) => void;
};

const ACTIONS = {
  OPEN: "OPEN",
  MOVE: "MOVE",
};
type Actiooons = keyof typeof ACTIONS;

const MAX_MINUTES = 30;

function peekValve(flowRate: number) {
  return (n: number) => flowRate * (MAX_MINUTES - n - 1);
}

function openValve(node: ValveNode) {
  return (n: number) => {
    // node.visited = true; // mutable action
    return node.flowRate * n;
  };
}

// function createReducer(action: Actiooons, state: Stateed) {
//   return reducer(action, state);
// }

function iterate(state: Stateed): Stateed {
  const { current, elapsedMinutes, opened, visited } = state;
  // console.log("Elapsed", elapsedMinutes);

  // console.log("CURR", current);
  // console.log("Current", [current?.name]);

  // console.log(
  //   "Visited",
  //   visited.map((n) => n.name)
  // );

  if (!current) {
    throw new Error("Forgot something?");
  }
  if (elapsedMinutes >= MAX_MINUTES) {
    // console.log(`elapsedTime ${elapsedMinutes}, MAX_MINUTES: ${MAX_MINUTES}`);

    return state;
  }

  // Need to peek() for elapsedMinutes + 1?

  const randomOpenThreshold = Math.random() * 6;
  // console.log("randomOpenThreshold", randomOpenThreshold);

  if (
    opened.indexOf(current) < 0 &&
    current.flowRate > randomOpenThreshold
  ) {
    // console.log("ACTION => OPEN", [current.name], current.peek(elapsedMinutes));

    // console.log('opened', opened);
    return iterate(reducer("OPEN", state));
  } else {
    // [ ] Should not move back to current
    // [X] Should prefer unvisited nodes?
    // [ ] Should avoid dead-ends once visited

    const unvisited = current.tunnels.filter(
      (e) => !visited.map((n) => n.name).includes(e)
    );

    // console.log("Unvisited", unvisited);
    // console.log("ACTION => MOVE");

    // const next = Math.floor(Math.random() * unvisited.length);

    const to = unvisited.length
      ? unvisited[Math.floor(Math.random() * unvisited.length)]
      : current.tunnels[Math.floor(Math.random() * current.tunnels.length)];

    const newState = reducer("MOVE", state, { to });

    return iterate(newState);
  }
}

function reducer(
  action: Actiooons,
  state: Stateed,
  payload?: { to: Valve }
): Stateed {
  switch (action) {
    case ACTIONS.OPEN: {
      //   console.log("ACTIONS OPEN");
      return {
        ...state,
        score:
          state.score +
          state.current!.flowRate * (MAX_MINUTES - state.elapsedMinutes - 1), // should be -1 extra for time it takes to open!
        opened: [...state.opened, state.current as ValveNode],
        elapsedMinutes: state.elapsedMinutes + 1,
      };
    }
    case ACTIONS.MOVE: {
      //   console.log("ACTIONS MOVE");
      return {
        ...state,
        visited:
          state.current === null ||
          state.visited.findIndex((n) => n.name === state.current?.name) >= 0
            ? [...state.visited]
            : [...state.visited, state.current],
        current: state.nodes.find((n) => n.name === payload?.to) || null,
        elapsedMinutes: state.elapsedMinutes + 1,
      };
    }
    default: {
      throw new Error(`Unknown action: ${action}`);
    }
  }
}

const INITIAL_STATE = {
  current: null as null | ValveNode,
  elapsedMinutes: 0 as number,
  opened: [] as ValveNode[],
  visited: [] as ValveNode[],
  nodes: [] as ValveNode[],
  score: 0 as number,
} as const;

type Stateed = typeof INITIAL_STATE;

async function readInput(filename: string): Promise<Stateed> {
  const processor = await createLineProcessor(filename);

  let state = { ...INITIAL_STATE };
  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error(`Oops, lines: ${line}`);
    }

    let [valveFlowRate, leadsTo] = line.split(";");
    const valve = (valveFlowRate.match(/[A-Z]{2}/) || []).map((s) => s)[0];
    console.log("valve", valve);
    const flowRate = (valveFlowRate.match(/-?\d+/) || []).map((s) =>
      parseInt(s)
    )[0];
    console.log("flowRate", flowRate);
    const tunnels = leadsTo.match(/[A-Z]{2}/g) || [];
    console.log("tunnels", tunnels);

    const node = {
      name: valve,
      flowRate,
      tunnels,
      peek: peekValve(flowRate),
    };

    if (state.current === null) {
      state.current = node;
    }
    state.nodes.push(node);
  }

  try {
    await processor({
      callback,
    });
  } catch (error) {
    console.error("error", error);
  }
  return state;
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;
  console.time("run");
  await releasePressure();
  console.timeEnd("run");
})();

// for tests
export {};
