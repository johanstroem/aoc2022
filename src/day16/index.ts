import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

async function releasePressure(filename = TEST_INPUT) {
  const state = await readInput(filename);

  const result = [];

  // const ITERATIONS = 200_000;
  // const ITERATIONS = 100_000;
  // const ITERATIONS = 10_000;
  const ITERATIONS = 1_000;
  // const ITERATIONS = 500;
  // const ITERATIONS = 1;

  console.log("================ START ==================");

  for (let i = 0; i < ITERATIONS; i++) {
    const r = iterate(state);
    result.push(r);
  }

  // const sorted = result.sort((a, b) => b.score - a.score);

  // console.log(
  //   "sorted top 10",
  //   sorted.slice(0, 10).map((n) => n.score)
  // );

  // const max = Math.max(...result.map((r) => r.score));
  const max1 = Math.max(...result.slice(0, ITERATIONS / 2).map((r) => r.score));
  const max2 = Math.max(...result.slice(ITERATIONS / 2).map((r) => r.score));

  console.log("max", max1);
  console.log("max", max2);
}

type Valve = string;

type ValveNode = {
  name: Valve;
  flowRate: number;
  tunnels: Valve[]; // should be ValveNode[]?
  peek: (n: number) => number;
};

const ACTIONS = {
  OPEN: "OPEN",
  MOVE: "MOVE",
};
type Actions = keyof typeof ACTIONS;

const MAX_MINUTES = 26;

function peekValve(flowRate: number) {
  return (n: number) => flowRate * (MAX_MINUTES - n - 1);
}

// function createReducer(action: Actiooons, state: Stateed) {
//   return reducer(action, state);
// }

function iterate(state: State): State {
  const { current, elephant, elapsedMinutes, opened, visited, deadEnds } =
    state;
  // console.log("Elapsed", elapsedMinutes);

  // console.log("Current", [current?.name]);

  // console.log(
  //   "Visited",
  //   visited.map((n) => n.name)
  // );

  if (!current || !elephant) {
    throw new Error("Forgot something?");
  }
  if (elapsedMinutes >= MAX_MINUTES) {
    // console.log(`elapsedTime ${elapsedMinutes}, MAX_MINUTES: ${MAX_MINUTES}`);
    return state;
  }

  // Need to peek() for elapsedMinutes + 1?
  const randomOpenThreshold = Math.random() * 6;
  // console.log("randomOpenThreshold", randomOpenThreshold);

  if (opened.indexOf(current) < 0 && current.flowRate > randomOpenThreshold) {
    console.log(
      "ACTION => OPEN",
      [current.name],
      current.peek(elapsedMinutes),
      { actor: "ME" }
    );
    // console.log("opened", opened);
    const newState = reducer("OPEN", state, { actor: "ME" });

    // newState.elephant?
    if (
      newState.opened.indexOf(elephant) < 0 &&
      elephant.flowRate > randomOpenThreshold
    ) {
      console.log(
        "ACTION => OPEN",
        [elephant.name],
        elephant.peek(elapsedMinutes),
        { actor: "ELEPHANT" }
      );
      return iterate(reducer("OPEN", newState, { actor: "ELEPHANT" }));
    } else {
      const unvisited = elephant.tunnels.filter(
        (e) => !newState.visited.map((n) => n.name).includes(e)
      );
      console.log("Unvisited", unvisited);
      const deads = deadEnds.map((d) => d.name);
      const nonDeadEnds = elephant.tunnels.filter((e) => !deads.includes(e));
      console.log("nonDeadEnds", nonDeadEnds);

      // const next = Math.floor(Math.random() * unvisited.length);
      const to = unvisited.length
        ? unvisited[Math.floor(Math.random() * unvisited.length)]
        : nonDeadEnds[Math.floor(Math.random() * nonDeadEnds.length)];
      console.log("ACTION => MOVE 1", { to }, { actor: "ELEPHANT" });
      return iterate(reducer("MOVE", newState, { actor: "ELEPHANT", to }));
    }
  } else {
    // [ ] Should not move back to current?
    // [X] Should prefer unvisited nodes?
    // [X] Should avoid dead-ends already visited

    const unvisited = current.tunnels.filter(
      (e) => !visited.map((n) => n.name).includes(e)
    );
    console.log("Unvisited", unvisited);
    const deads = deadEnds.map((d) => d.name);

    const nonDeadEnds = current.tunnels.filter((e) => !deads.includes(e));
    console.log("nonDeadEnds", nonDeadEnds);
    // const next = Math.floor(Math.random() * unvisited.length);
    const to = unvisited.length
      ? unvisited[Math.floor(Math.random() * unvisited.length)]
      : nonDeadEnds[Math.floor(Math.random() * nonDeadEnds.length)];
    console.log("ACTION => MOVE", { to }, { actor: "ME" });

    console.log(
      "visited 1",
      state.visited.map((v) => v.name)
    );

    const newState = reducer("MOVE", state, { actor: "ME", to });

    // Same if/else block for elephant as above
    if (
      newState.opened.indexOf(elephant) < 0 &&
      elephant.flowRate > randomOpenThreshold
    ) {
      console.log(
        "ACTION => OPEN",
        [elephant.name],
        elephant.peek(elapsedMinutes),
        { actor: "ELEPHANT" }
      );

      return iterate(reducer("OPEN", newState, { actor: "ELEPHANT" }));
    } else {
      console.log(
        "visited 2",
        newState.visited.map((v) => v.name)
      );

      const unvisited = elephant.tunnels.filter(
        (e) => !newState.visited.map((n) => n.name).includes(e)
      );

      console.log("Unvisited", unvisited);
      const deads = deadEnds.map((d) => d.name);
      const nonDeadEnds = elephant.tunnels.filter((e) => !deads.includes(e));

      console.log("nonDeadEnds", nonDeadEnds);

      // const next = Math.floor(Math.random() * unvisited.length);
      const to = unvisited.length
        ? unvisited[Math.floor(Math.random() * unvisited.length)]
        : nonDeadEnds[Math.floor(Math.random() * nonDeadEnds.length)];

      console.log("ACTION => MOVE 2", { to }, { actor: "ELEPHANT" });

      return iterate(reducer("MOVE", newState, { actor: "ELEPHANT", to }));
    }
  }
}

// Update reducer to handle "Actor"
function reducer(
  action: Actions,
  state: State,
  payload: { actor: "ME" | "ELEPHANT"; to?: Valve }
): State {
  switch (action) {
    case ACTIONS.OPEN: {
      //   console.log("ACTIONS OPEN");
      const actor = payload.actor === "ME" ? state.current : state.elephant;
      return {
        ...state,
        score:
          state.score +
          actor!.flowRate *
            (MAX_MINUTES - Math.floor(state.elapsedMinutes) - 1), // should be -1 extra for time it takes to open!
        opened: [...state.opened, actor as ValveNode],
        elapsedMinutes: state.elapsedMinutes + 0.5,
      };
    }
    case ACTIONS.MOVE: {
      //   console.log("ACTIONS MOVE");
      const actor = payload.actor === "ME";
      const to = state.nodes.find((n) => n.name === payload?.to) || null;
      return {
        ...state,
        visited:
          to === null || state.visited.findIndex((n) => n.name === to.name) >= 0
            ? [...state.visited]
            : [...state.visited, to],
        current: actor ? to : state.current,
        elephant: !actor ? to : state.elephant,
        elapsedMinutes: state.elapsedMinutes + 0.5,
      };
    }
    default: {
      throw new Error(`Unknown action: ${action}`);
    }
  }
}

const INITIAL_STATE = {
  current: null as null | ValveNode,
  elephant: null as null | ValveNode,
  elapsedMinutes: 0 as number,
  opened: [] as ValveNode[],
  visited: [] as ValveNode[],
  nodes: [] as ValveNode[],
  deadEnds: [] as ValveNode[],
  score: 0 as number,
} as const;

type State = typeof INITIAL_STATE;

async function readInput(filename: string): Promise<State> {
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
      state.elephant = node;
      state.visited.push(node);
    }
    if (node.tunnels.length === 1) {
      state.deadEnds.push(node);
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
