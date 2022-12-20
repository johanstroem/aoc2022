import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import { Map, printMap } from "../utils";
import createLineProcessor from "../utils/lineProcessor";

async function countSand(filename = REAL_INPUT) {
  const vectors = await readInput(filename);

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
  console.log(`Sand source @ row 0, column ${sandSource}`);

  const copy = map.map((r) => [...r]);
  let abyss: Index[] = [];

  const start: Index = [0, sandSource];

  let shouldBreak = false;
  let n = 0;

  do {
    const { index: atRestIndex } = iterate(start, copy, 0, abyss);

    if (atRestIndex[0] === start[0] && atRestIndex[1] === start[1]) {
      console.log("Sand can't move from Start");
      console.log("Final Iterations", n + 1);
      break;
    }

    if (withinMapBoundaries(atRestIndex, map)) {
      copy[atRestIndex[0]][atRestIndex[1]] = SAND_AT_REST;
    } else {
      abyss = updateAbyss(atRestIndex, abyss);
    }

    n++;
    shouldBreak = deadManSwitch(n);
  } while (!shouldBreak);

  return {
    iterations: n,
    map: copy,
  };
}

function iterate(
  [row, col]: Index,
  map: Map<Tiles>,
  i: number,
  abyss: Index[] = []
): {
  iterations: number;
  index: Index;
} {
  if (row >= map.length) {
    // Sand at bottom row";
    return {
      iterations: i,
      index: [row, col],
    };
  }

  const [down, downLeft, downRight] = directions([row, col], map, abyss);

  if (down.value === AIR || down.value === null) {
    // down
    return iterate(down.index, map, ++i, abyss);
  } else if (downLeft.value === AIR || downLeft.value === null) {
    // down-left
    return iterate(downLeft.index, map, ++i, abyss);
  } else if (downRight.value === AIR || downRight.value === null) {
    // down-right
    return iterate(downRight.index, map, ++i, abyss);
  } else {
    return {
      iterations: i,
      index: [row, col],
    };
  }
}

const directions = (
  [row, col]: Index,
  map: Map<Tiles>,
  abyss: Index[] = []
): { index: Index; value: Tiles | null }[] => {
  const nextRow = map[row + 1] || {};
  const isInAbyss = ([r, c]: Index, abyss: Index[]) => {
    return abyss.some(([row, col]) => row === r && col === c);
  };

  const down = isInAbyss([row + 1, col], abyss) ? ROCK : nextRow[col] || null;
  const downLeft = isInAbyss([row + 1, col - 1], abyss)
    ? ROCK
    : nextRow[col - 1] || null;
  const downRight = isInAbyss([row + 1, col + 1], abyss)
    ? ROCK
    : nextRow[col + 1] || null;
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

function updateAbyss(atRestIndex: Index, abyss: ReadonlyArray<Index>) {
  const abysser = [...abyss];
  abysser.push(atRestIndex);
  const unreachable = abysser.findIndex(([row, col]) => {
    return row === atRestIndex[0] + 2 && col === atRestIndex[1];
  });

  if (unreachable >= 0) {
    abysser.splice(unreachable, 1);
  }
  return abysser;
}

function deadManSwitch(n: number): boolean {
  return n >= 28500 ? true : false;
}

function withinMapBoundaries([row, col]: Index, map: Map<Tiles>) {
  return (
    row >= 0 && row <= map.length - 1 && col >= 0 && col <= map[0].length - 1
  );
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

  vectors.forEach((v) => {
    v.forEach((n, j, vi) => {
      const last = vi[j - 1];
      if (!last) return;

      if (last[0] === n[0]) {
        for (
          let i = last[1] > n[1] ? n[1] : last[1];
          i <= (last[1] > n[1] ? last[1] : n[1]);
          i++
        ) {
          map[i][last[0] - xMin] = ROCK;
        }
      } else {
        const size = Math.abs(last[0] - n[0]) + 1;
        map[n[1]].splice(
          (n[0] < last[0] ? n[0] : last[0]) - xMin,
          size,
          ...Array(size).fill(ROCK)
        );
      }
    });
  });
  return map;
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;
  console.time("test");
  await countSand();
  console.timeEnd("test");
})();

// for tests
export { simulateSand };
