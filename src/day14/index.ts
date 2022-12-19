import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import { Map, printMap } from "../utils";
import createLineProcessor from "../utils/lineProcessor";

async function countSand(filename = REAL_INPUT) {
  const vectors = await readInput(filename);
  console.log("VECTORS", vectors);

  const map = generateMap(vectors);
  printMap({ map });

  const { iterations, map: newMap } = simulateSand(map);
  console.log("iterations", iterations);
  printMap({ map: newMap });
}

async function readInput(filename: string) {
  const processor = await createLineProcessor(filename);

  const input: Vector[] = [];

  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error(`Oops, lines: ${line}`);
    }

    const vectors = line.split("->").map((v) => JSON.parse(`[${v.trim()}]`));

    input.push(vectors as Vector);
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

const ROCK = "#" as const;
const AIR = "." as const;
const SAND_SOURCE = "+" as const;
const SAND_AT_REST = "o" as const;
const TILES = [ROCK, AIR, SAND_SOURCE, SAND_AT_REST] as const;

type Tiles = typeof TILES[number];
type Index = [row: number, col: number];
type Vector = Index[];

function simulateSand(map: Map<Tiles>): {
  iterations: number;
  map: Map<Tiles>;
} {
  const sandSource = map[0].indexOf(SAND_SOURCE);
  // Need to calculated boundaries?
  // const {xMin, xMax, yMin, yMax} = getCorners(map)
  console.log(`Sand source @ row 0, column ${sandSource}`);

  const copy = map.map((r) => [...r]);

  const start: Index = [0, sandSource];
  console.log("start", start);

  let atRest = false;
  let n = 0;

  do {
    // Go down?
    // Go diagonally left
    // Go diagonally right
    const { iterations: unused, index: atRestIndex } =
      iterate(start, copy, 0) || {};
    console.log("index", atRestIndex);

    if (!atRestIndex) {
      console.log("Sand fell into abyss");
      break;
    }

    if (atRestIndex[0] === start[0] && atRestIndex[1] === start[1]) {
      console.log("Sand can't move from Start");
      break;
    }

    copy[atRestIndex[0]][atRestIndex[1]] = SAND_AT_REST;
    printMap({ map: copy });

    n++;
    // atRest = isInAbyss(index, map, n);
  } while (!atRest);

  return {
    iterations: n,
    map: copy,
  };
}

// Could throw out of bounds (i.e in "abyss") error?
function iterate(
  [row, col]: Index,
  map: Map<Tiles>,
  i: number
): {
  iterations: number;
  index: Index;
} | null {
  console.log(`iteration[${i}]: row: ${row}, col: ${col}`);

  // if (typeof map[row + 1] === "undefined") {
  //   console.log("Sand at bottom row");
  //   return {
  //     iterations: i,
  //     index: [row, col],
  //   };
  // } else

  const [down, downLeft, downRight] = directions([row, col], map);
  console.log(
    `down: ${down.value}, left: ${downLeft.value}, right: ${downRight.value}`
  );

  if (down.value === AIR) {
    // down
    console.log("go down");
    return iterate(down.index, map, ++i);
  } else if (down.value === null) {
    return null;
  } else if (downLeft.value === AIR) {
    // down-left
    console.log("go down-left");
    return iterate(downLeft.index, map, ++i);
  } else if (downLeft.value === null) {
    return null;
  } else if (downRight.value === AIR) {
    // down-right
    console.log("go down-right");
    return iterate(downRight.index, map, ++i);
  } else if (downRight.value === null) {
    return null;
  } else {
    return {
      iterations: i,
      index: [row, col],
    };
  }
}

const directions = (
  [row, col]: Index,
  map: Map<Tiles>
): { index: Index; value: Tiles }[] => {
  const nextRow = map[row + 1] || {};
  const down = nextRow[col] || null;
  const downLeft = nextRow[col - 1] || null;
  const downRight = nextRow[col + 1] || null;
  return [
    {
      index: [row + 1, col],
      value: down,
    },
    {
      index: [row + 1, col - 1],
      value: downLeft,
    },
    {
      index: [row + 1, col + 1],
      value: downRight,
    },
  ];
};

// - Add "Abyss Row" beneath bottom-most rock(s)?
// - Calculate max possible iterations?
// - Calculate max row (see above?)?
function isInAbyss([row, col]: Index, map: Map<Tiles>, n: number): boolean {
  console.log("ROW", row);
  return n >= 10000 ? true : false;
  // return row > 2 ? true : false
}

function generateMap(vectors: Vector[]) {
  const rows = vectors.flatMap((row) => row.map(([x]) => x));
  const cols = vectors.flatMap((row) => row.map(([, y]) => y));

  const xMin = Math.min(...rows, 500);
  const xMax = Math.max(...rows, 500);
  const yMin = 0;
  const yMax = Math.max(...cols);

  console.log(`xMin: ${xMin}. xMax: ${xMax}`);
  console.log(`yMin: ${yMin}. yMax: ${yMax}`);

  const map = Array(yMax + 1)
    .fill(null)
    .map((_) => Array(xMax - xMin + 1).fill(AIR));

  map[0][500 - xMin] = SAND_SOURCE;

  vectors.forEach((v, i, arr) => {
    console.log("i", i);

    const nNodes = v.length;

    // Use indexes and splice/slice instead
    for (let i = 0; i < nNodes; i++) {
      const last = v[i - 1];

      if (!last) continue;

      const curr = v[i];
      // console.log("last", last);
      // console.log("curr", curr);

      if (last[0] === curr[0]) {
        console.log("same x values", last[0]);
        for (
          let i = last[1] > curr[1] ? curr[1] : last[1];
          i <= (last[1] > curr[1] ? last[1] : curr[1]);
          i++
        ) {
          map[i][last[0] - xMin] = ROCK;
        }
      } else {
        console.log("same y values", last[1]);

        for (
          let i = last[0] > curr[0] ? curr[0] : last[0];
          i <= (last[0] > curr[0] ? last[0] : curr[0]);
          i++
        ) {
          map[last[1]][i - xMin] = ROCK;
        }
      }
    }
  });
  return map;
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await countSand();
})();

// for tests
export { simulateSand };
