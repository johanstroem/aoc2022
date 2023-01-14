import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import { Map, Index, printMap } from "../utils";
import createLineProcessor from "../utils/lineProcessor";

// Similarities to day 14?

const MOVES = ["N", "S", "W", "E"] as const;

type Moves = typeof MOVES[number];
// const DIRECTIONS = {
//   NORTH: "NORTH",
//   SOUTH: "SOUTH",
//   WEST: "WEST",
//   EAST: "EAST",
// } as const;

const DIRECTIONS = (set: Set<string>) =>
  ({
    NORTH: (e: string) => {
      const [row, col] = e.split(",").map((v) => parseInt(v));
      // console.log(`row: ${row}, col: ${col}`);
      return !(
        set.has(`${row - 1},${col - 1}`) ||
        set.has(`${row - 1},${col}`) ||
        set.has(`${row - 1},${col + 1}`)
      );
    },

    SOUTH: (e: string) => {
      const [row, col] = e.split(",").map((v) => parseInt(v));
      // console.log(`row: ${row}, col: ${col}`);
      return !(
        set.has(`${row + 1},${col - 1}`) ||
        set.has(`${row + 1},${col}`) ||
        set.has(`${row + 1},${col + 1}`)
      );
    },
    WEST: (e: string) => {
      const [row, col] = e.split(",").map((v) => parseInt(v));
      // console.log(`row: ${row}, col: ${col}`);
      return !(
        set.has(`${row - 1},${col - 1}`) ||
        set.has(`${row},${col - 1}`) ||
        set.has(`${row + 1},${col - 1}`)
      );
    },
    EAST: (e: string) => {
      const [row, col] = e.split(",").map((v) => parseInt(v));
      // console.log(`row: ${row}, col: ${col}`);
      return !(
        set.has(`${row - 1},${col + 1}`) ||
        set.has(`${row},${col + 1}`) ||
        set.has(`${row + 1},${col + 1}`)
      );
    },
  } as const);

// const MOVE = {
//   'NORTH': (e: string) => {
//     const [row, col] = e.split(",").map((v) => parseInt(v));
//     return [row -1,col].toString()
//   },
//   'SOUTH': (e: string) => {
//     const [row, col] = e.split(",").map((v) => parseInt(v));

//   }
// }

function move(e: string, move: Moves) {
  const [row, col] = e.split(",").map((v) => parseInt(v));
  switch (move) {
    case "N": {
      return [row - 1, col].toString();
    }
    case "S": {
      return [row + 1, col].toString();
    }
    case "W": {
      return [row, col - 1].toString();
    }
    case "E": {
      return [row, col + 1].toString();
    }
    default: {
      throw new Error(`Invalid move: ${move}`);
    }
  }
}
// type Directions = typeof DIRECTIONS[keyof typeof DIRECTIONS];
// type Directions = keyof typeof DIRECTIONS;

async function countGroundTiles(filename = REAL_INPUT) {
  const input: Map<"." | "#"> = await readInput(filename);

  // printMap({ map: input });
  // console.log(
  //   // "input",
  //   // input,
  //   "#rows:",
  //   input.length,
  //   "#cols:",
  //   input[0].length
  // );

  // .filter((e): e is string => e !== null);
  let elves = new Set<string>(
    input.flatMap((r, i) => {
      return r
        .map((e, j) => {
          return e === "#" ? [i, j].toString() : null!;
        })
        .filter((e) => e !== null);
    })
  );
  // console.log("elves", elves, "#elves", elves.size);

  // const [rMin, cMin, rMax, cMax] = getBoundingBox(elves);

  // printMap({ map: toMap(elves) });

  const ITERATIONS = 10000;

  const order = [...MOVES];

  for (let i = 0; i < ITERATIONS; i++) {
    // Only works for first iteration?
    // console.log("order", order);
    // const direction = order.shift();
    // order.push(direction!)

    const directions = DIRECTIONS(elves);
    // const moves: [
    //   north: string[],
    //   south: string[],
    //   west: string[],
    //   east: string[]
    // ] = [[], [], [], []];
    const moves: Record<Moves, string[]> = {
      N: [],
      S: [],
      W: [],
      E: [],
    };

    const next: typeof elves = new Set();

    for (let e of elves) {
      // const [row, col] = e.split(",").map((v) => parseInt(v));
      // console.log(`row: ${row}, col: ${col}`);

      // Do for all elves
      const movableDirections = order
        .map((dir, _i) => {
          if (dir === "N") {
            return directions["NORTH"];
          } else if (dir === "S") {
            return directions["SOUTH"];
          } else if (dir === "W") {
            return directions["WEST"];
          } else {
            return directions["EAST"];
          }
        })
        // run for each elves' coordinates
        .map((direction) => direction(e));

      if (movableDirections.every((d) => d)) {
        // Stay put
        // console.log("STAY PUT");
        next.add(e);
        // continue
      } else if (movableDirections.every((d) => d === false)) {
        // cannot move?
        // console.log("CANNOT MOVE");
        // continue
        next.add(e);
      } else {
        const moveDirection = order[movableDirections.indexOf(true)];
        // console.log("moveDirection", moveDirection);
        moves[moveDirection].push(e);
      }
    }

    if (Object.keys(moves).every((dir) => moves[dir as Moves].length === 0)) {
      console.log(`NO MORE MOVES: [${i}]`);
      break;
    }
    // console.log("next1", next);

    // console.log("moves", moves);

    const northBound = new Set(moves["N"].map((e) => move(e, "N")));
    const southBound = new Set(moves["S"].map((e) => move(e, "S")));
    const westBound = new Set(moves["W"].map((e) => move(e, "W")));
    const eastBound = new Set(moves["E"].map((e) => move(e, "E")));

    // console.log("northBound", northBound);
    // console.log("southBound", southBound);
    // console.log("westBound", westBound);
    // console.log("eastBound", eastBound);

    for (const [dir, m] of Object.entries(moves)) {
      // console.log("dir:", dir, "m:", m);
      if (dir === "N") {
        const rest = new Set([...southBound, ...westBound, ...eastBound]);
        // console.log("rest", rest);
        m.forEach((d) => {
          rest.has(move(d, dir)) ? next.add(d) : next.add(move(d, dir));
        });
      } else if (dir === "S") {
        const rest = new Set([...northBound, ...westBound, ...eastBound]);
        m.forEach((d) => {
          rest.has(move(d, dir)) ? next.add(d) : next.add(move(d, dir));
        });
      } else if (dir === "W") {
        const rest = new Set([...northBound, ...southBound, ...eastBound]);
        m.forEach((d) => {
          rest.has(move(d, dir)) ? next.add(d) : next.add(move(d, dir));
        });
      } else if (dir === "E") {
        const rest = new Set([...northBound, ...southBound, ...westBound]);
        m.forEach((d) => {
          rest.has(move(d, dir)) ? next.add(d) : next.add(move(d, dir));
        });
      } else {
        throw new Error(`Invalid direction: ${dir}`);
      }
    }

    // console.log("next2", next);
    // const [rMin, cMin, rMax, cMax] = getBoundingBox(next);
    elves = next;

    // printMap({
    //   map: toMap(elves),
    //   // size: {
    //   //   minRow: rMin,
    //   //   rows: rMax,
    //   //   minCol: cMin,
    //   //   cols: cMax,
    //   // },
    // });

    // Update order
    order.push(order.shift()!);
  }

  // console.log(
  //   `size: ${map.length} x ${map[0].length} = ${map.length * map[0].length}`
  // );
  const [rMin, cMin, rMax, cMax] = getBoundingBox(elves);

  console.log("#elves:", elves.size);
  console.log(
    "#Ground tiles:",
    (rMax - rMin + 1) * (cMax - cMin + 1) - elves.size
  );
  printMap({
    map: toMap(elves),
  });
}

function toMap(set: Set<string>): Map<"X" | "."> {
  // const arr = Array.from(set).map(
  //   (e) => e.split(",").map((e) => parseInt(e)) as unknown as Index
  // );
  // console.log("arr", arr, "#arr", arr.length);

  const [rMin, cMin, rMax, cMax] = getBoundingBox(set);

  // console.log(`rMin: ${rMin}, rMax: ${rMax}`);
  // console.log(`cMin: ${cMin}, cMax: ${cMax}`);

  const map = Array(rMax - rMin + 1)
    .fill(null)
    // TODO: adjust for negative rows/cols to have zero based indexes
    .map((_) => Array(cMax - cMin + 1).fill("."));

  for (const e of set.values()) {
    const [row, col] = e.split(",").map((v) => parseInt(v));
    map[row - rMin][col - cMin] = "#";
    // map[row - rMin][col - cMin] = [row - rMin, col - cMin].toString()
    // map[row - rMin][col - cMin] = [row, col].toString()
  }

  return map;
}

// function getBoundingBox(
//   elves: Set<string>
// ): [rMin: number, cMin: number, rMax: number, cMax: number];
// {
//   return [0, 0, 1, 1];
// }

function getBoundingBox(
  set: // Map<"#" | ".">
  Set<string>
  // Index[]
): [rMin: number, cMin: number, rMax: number, cMax: number] {
  // TODO: adjust for negative rows/cols to have zero based indexes
  const arr = Array.from(set).map(
    (e) => e.split(",").map((e) => parseInt(e)) as unknown as Index
  );
  const rows = arr.flatMap(([x]) => x);
  const cols = arr.flatMap(([, y]) => y);

  const rMin = Math.min(...rows);
  const cMin = Math.min(...cols);
  const rMax = Math.max(...rows);
  const cMax = Math.max(...cols);
  console.log(`rMin: ${rMin}, cMin: ${cMin}, rMax: ${rMax}, cMax: ${cMax}`);

  return [rMin, cMin, rMax, cMax];
}

async function readInput(filename: string): Promise<any[]> {
  const processor = await createLineProcessor(filename);

  const input: string[][] = [];

  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error(`Oops, lines: ${line}`);
    }

    input.push(line.split("") as unknown as [string, string]);
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

  const res = await countGroundTiles();

  console.timeEnd("run");
})();

// for tests
export { getBoundingBox };
