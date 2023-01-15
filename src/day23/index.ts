import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import { Map, Index, printMap } from "../utils";
import createLineProcessor from "../utils/lineProcessor";

const MOVES = ["N", "S", "W", "E"] as const;

type Moves = typeof MOVES[number];

const DIRECTIONS = (set: Set<string>) =>
  ({
    NORTH: (e: string) => {
      const [row, col] = e.split(",").map((v) => parseInt(v));
      return !(
        set.has(`${row - 1},${col - 1}`) ||
        set.has(`${row - 1},${col}`) ||
        set.has(`${row - 1},${col + 1}`)
      );
    },
    SOUTH: (e: string) => {
      const [row, col] = e.split(",").map((v) => parseInt(v));
      return !(
        set.has(`${row + 1},${col - 1}`) ||
        set.has(`${row + 1},${col}`) ||
        set.has(`${row + 1},${col + 1}`)
      );
    },
    WEST: (e: string) => {
      const [row, col] = e.split(",").map((v) => parseInt(v));
      return !(
        set.has(`${row - 1},${col - 1}`) ||
        set.has(`${row},${col - 1}`) ||
        set.has(`${row + 1},${col - 1}`)
      );
    },
    EAST: (e: string) => {
      const [row, col] = e.split(",").map((v) => parseInt(v));
      return !(
        set.has(`${row - 1},${col + 1}`) ||
        set.has(`${row},${col + 1}`) ||
        set.has(`${row + 1},${col + 1}`)
      );
    },
  } as const);

async function countGroundTiles(filename = TEST_INPUT) {
  const input: Map<"." | "#"> = await readInput(filename);

  let elves = new Set<string>(
    input.flatMap((r, i) => {
      return r
        .map((e, j) => {
          return e === "#" ? [i, j].toString() : null!;
        })
        .filter((e) => e !== null);
    })
  );

  console.log("#Initial elves:", elves.size);

  const order = [...MOVES];
  let moved = true;
  let i = 0;

  while (moved) {
    moved = false;
    const directions = DIRECTIONS(elves);
    const next: typeof elves = new Set();

    for (let e of elves) {
      const movableDirections = order
        .map((dir) => {
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
        .map((direction) => direction(e));

      if (movableDirections.every((d) => d)) {
        next.add(e);
      } else if (movableDirections.every((d) => !d)) {
        next.add(e);
      } else {
        const moveDirection = order[movableDirections.indexOf(true)];
        const moving = move(e, moveDirection);
        if (next.delete(moving)) {
          next.add(e);
          next.add(move(moving, moveDirection)); // undo previous move coming from opposite direction
        } else {
          next.add(moving);
          moved = true;
        }
      }
    }

    if (!moved) {
      console.log(`No elves moved: [${i + 1}]`);
      break;
    }

    elves = next;
    if (++i === 10) {
      console.log("After 10 rounds:");
      printMap({
        map: toMap(elves),
      });
      const [rMin, cMin, rMax, cMax] = getBoundingBox(elves);
      console.log(`rMin: ${rMin}, cMin: ${cMin}, rMax: ${rMax}, cMax: ${cMax}`);
      console.log("#elves:", elves.size);
      console.log(
        "#Ground tiles:",
        (rMax - rMin + 1) * (cMax - cMin + 1) - elves.size
      );
    }
    order.push(order.shift()!);
  }

  printMap({
    map: toMap(elves),
  });
}

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

function toMap(set: Set<string>): Map<"X" | "."> {
  const [rMin, cMin, rMax, cMax] = getBoundingBox(set);

  const map = Array(rMax - rMin + 1)
    .fill(null)
    .map((_) => Array(cMax - cMin + 1).fill("."));

  for (const e of set.values()) {
    const [row, col] = e.split(",").map((v) => parseInt(v));
    map[row - rMin][col - cMin] = "#";
  }

  return map;
}

function getBoundingBox(
  set: Set<string>
): [rMin: number, cMin: number, rMax: number, cMax: number] {
  const arr = Array.from(set).map(
    (e) => e.split(",").map((e) => parseInt(e)) as unknown as Index
  );
  const rows = arr.flatMap(([x]) => x);
  const cols = arr.flatMap(([, y]) => y);

  const rMin = Math.min(...rows);
  const cMin = Math.min(...cols);
  const rMax = Math.max(...rows);
  const cMax = Math.max(...cols);

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
