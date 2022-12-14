import getCharValue from "../utils/getCharValue";
import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

const START = "S" as const;
const END = "E" as const;

// type Position = {
//   height: number;
//   visited: boolean;
// };

const VISITED = "o" as const;

type Height = number;
type Position = Height | typeof VISITED | typeof END | typeof START;

type Map = Position[][];

const SEARCH_DEPTH = 100;

// REAL INPUT END = [20, 112]?
// const END_ROW = 2;
// const END_COL = 5;

// TEST INPUt [2, 5]

async function getShortestPath(filename = TEST_INPUT) {
  const map: Map = (await createMap(filename)).map((row) =>
    row.map(
      // DO NOT CHANGE END TO VALUE?
      (node) => (node === START ? "S" : node === END ? "E" : getCharValue(node))
      // ({
      //   char: node,
      //   height: node === START ? 1 : node === END ? 26 : getCharValue(node),
      //   visited: node === START,
      // }))
    )
  );

  //   printMap(map, END_ROW+1, END_COL+1)

  console.log(`map size: rows ${map.length} X cols ${map[0].length}`);
  //   console.log("map[END_ROW][END_COL]", map[END_ROW][END_COL]);

  //   map[END_ROW][END_COL] = END;
  console.log("START!");

  printMap(map);

  //   const startIndex = getStartIndex(map)
  // first node should be start position

  //   JavaScript heap out of memory for Recursion
  //   Try Breadth First loop instead
  //   let loop = 24;
  //   while (Number.isInteger(loop++)) {
  while (true) {
    // console.log("loop", loop);

    // const paths = getPaths(map[0][0], [0, 0], map, 0, loop);
    const paths = getPaths(map[0][0], [0, 0], map, 0, SEARCH_DEPTH);

    // paths.forEach((p, i) => {
    //   console.log(`======== path[${i}] ========`);
    //   //   if (loop === SEARCH_DEPTH) {
    //   printMap(p, 41, 90);
    //   //   }
    // });

    //   const [eRow, eCol] = getEndIndex(map)

    const completePaths = paths.filter((p, j) => {
      // console.log(`cp[${j}]: ${p[eRow][eCol]}`);
      //   console.log("=====", j, "======");
      //   printMap(p, 10, 50);

      return p[2][5] === VISITED;
    });

    // completePaths.forEach((p, j) => {
    //   console.log("j", j);
    //   printMap(p, 10, 50);
    // });
    console.log("paths.length", paths.length);
    console.log("completePaths.length", completePaths.length);

    const completePathVisited = completePaths.map((p) =>
      p.flatMap((r) => r.filter((n) => n === VISITED))
    );

    const lengths = completePathVisited.map((p) => {
      console.log(`[${p.join("")}]: length = ${p.length}`);
      return p.length;
    });

    // if (lengths.length <= 0) {
    //   throw new Error("no complete path");
    // }
    // const lengths = completePathVisited.map((p) => p.)
    const shortestCompletePath = Math.min(...lengths);
    console.log("shortest", shortestCompletePath - 1); // minus 1 for start visited on step 0

    if (completePaths.length > 0) {
      console.log("BREAK LOOP, FOUND COMPLETE PATH");
      break;
    }

    // if (loop >= SEARCH_DEPTH) {
    //   console.log("BREAK LOOP, DEPTH REACHED", loop);
    //   break;
    // }
  }
}

async function createMap(filename: string) {
  const map: string[][] = [];
  const processor = await createLineProcessor(filename);
  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error("oops");
    }
    map.push(line.split(""));
  }
  try {
    await processor({
      callback,
    });
    return map;
  } catch (error) {
    console.error("error", error);
  }
  return [];
}

type Index = [row: number, col: number];

function getPaths(
  node: Position,
  //   [row, col]: Index,
  [nRow, nCol]: Index,
  map: Map,
  depth: number,
  searchDepth: number
): Map[] {
  // console.log(`depth: ${depth}, searchDepth: ${searchDepth}`);

  //   const copy = map.map((n) => ({
  //     ...n,
  //   }));

  //   console.log(`nRow:  ${nRow}. nCol: ${nCol}`);

  //   should have possible end state
  if (node === END) {
    console.log(`END STATE: map[${nRow}][${nCol}]=${node}`);
    let nextMap: Position[][] = map.map((row) => [...row]);
    nextMap[nRow][nCol] = VISITED;

    printMap(nextMap, 10, 90);

    return [nextMap];
  }

  if (depth >= searchDepth) {
    console.log("DEPTH REACHED", depth);
    return [map];
  }

  const neighbors: Index[] = getNeighbors([nRow, nCol]);

  //   console.log("neighbors", neighbors);

  const options: Index[] = neighbors
    .filter((neighbor) => {
      return !isOutside(neighbor, map);
    })
    .filter(([row, col]) => {
      return canVisit(node as number, map[row][col]);
    });
  // .sort(([aRow, aCol], [bRow, bCol]) => {
  //   //   console.log(`b: ${map[bRow][bCol]}, a: ${map[aRow][aCol]}`);
  //   return (map[bRow][bCol] as number) - (map[aRow][aCol] as number);
  // });
  // .slice(0, 2)
  // .sort((_a, _b) => 0.5 - Math.random());

  console.log("opts", options);

  //   Dead end?
  if (options.length === 0) {
    console.log(`DEAD END: map[${nRow}][${nCol}]=${node}`);
    printMap(map, 10, 90);
    return [map];
  } else {
    // flatMap?
    // return options.flatMap(([row, col]) => {
    const nextDepth = ++depth;

    return options.slice(0).flatMap(([row, col]) => {
      //   console.log(`row:  ${row}. col: ${col}`);
      const node: Position = map[row][col];
      const idx: Index = [row, col];
      const nextMap: Position[][] = map.map((row) => [...row]);
      nextMap[nRow][nCol] = VISITED;

      //   printMap(nextMap);

      //   return getPaths(node, idx, nextMap, ++depth, searchDepth);
      return getPaths(node, idx, nextMap, nextDepth, searchDepth);
      // return [];
      // return getPaths(map[row][col], [row, col], copy)
    });
  }
}

function getNeighbors([row, col]: Index): Index[] {
  return [
    [row, col + 1], //right
    [row + 1, col], //bottom
    [row - 1, col], //top
    [row, col - 1], //left
  ];
}

function isOutside([row, col]: Index, map: Map) {
  return row < 0 || col < 0 || row > map.length - 1 || col > map[0].length - 1;
}

function canVisit(node: number | typeof START, neighbor: Position) {
  // check index or height or visited
  if (neighbor === VISITED) {
    return false;
  } else if (node === START) {
    return neighbor <= 2;
  } else if (neighbor === END) {
    return getCharValue("z") <= node + 1;
  } else {
    return neighbor <= node + 1;
  }
}

function printMap(map: Position[][], rows = map.length, cols = map[0].length) {
  //   console.log("map", map);
  map.slice(0, rows).forEach((row) => {
    // console.log(`[${row.map((n) => (n.visited ? "v" : ".")).join("")}]`);
    console.log(
      //   `[${row.map((n) => n.height.toString().padStart(2, " ")).join(" ")}]`
      //   `[${row.map((n) => n.toString().padStart(2, " ")).join("")}]`
      `[${row
        .slice(0, cols)
        .map((n) => n.toString().padStart(2, " "))
        .join("")}]`
    );
  });
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await getShortestPath();
})();

// for tests
export { createMap, getNeighbors, isOutside, canVisit };
