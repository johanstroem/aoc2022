import getCharValue from "../utils/getCharValue";
import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

const START = "S" as const;
const END = "E" as const;

const VISITED = "o" as const;

type Height = number;
type Position = Height | typeof VISITED | typeof END | typeof START;

type Map = Position[][];

const SEARCH_DEPTH = 3300;

// REAL INPUT END = [20, 112]?
const END_ROW = 20;
const END_COL = 112;

// TEST INPUt [2, 5]

async function getShortestPath(filename = REAL_INPUT) {
  const map: Map = (await createMap(filename)).map((row) =>
    row.map(
      // DO NOT CHANGE END TO VALUE?
      (node) => (node === START ? "S" : node === END ? "E" : getCharValue(node))
    )
  );

  //   printMap(map, END_ROW+1, END_COL+1)

  console.log(`map size: rows ${map.length} X cols ${map[0].length}`);
  //   console.log("map[END_ROW][END_COL]", map[END_ROW][END_COL]);

  //   map[END_ROW][END_COL] = END;
  console.log("START!");

  //   printMap(map);

  //   const startIndex = getStartIndex(map)

  //   JavaScript heap out of memory for Recursion
  //   Try Breadth First loop instead
  //   let loop = 24;
  //   while (Number.isInteger(loop++)) {
  //   while (true) {
  // console.log("loop", loop);

  // const paths = getPaths(map[0][0], [0, 0], map, 0, loop);
  // const paths = getPaths(
  //   map[END_ROW][END_COL],
  //   [END_ROW, END_COL],
  //   map,
  //   0,
  //   SEARCH_DEPTH
  // );
  const paths = getPaths([[END_ROW, END_COL]], map, 0, SEARCH_DEPTH, [
    [[END_ROW, END_COL]],
  ]);

  //   paths.forEach((p, i) => {
  //   console.log(`======== path[${i}] ========`);
  //   if (loop === SEARCH_DEPTH) {
  //   printMap(p, 0, 41, 50, 140);
  //   }
  //   });

  //   const [eRow, eCol] = getEndIndex(map)

  console.log("paths.length", paths.length);

  const completePaths = paths
    .slice(paths.length - 50, paths.length - 1)
    .filter((p, j) => {
      //   console.log(`cp[${j}]: ${p[eRow][eCol]}`);
      console.log("=====", j, "======");
      //   printMap(p, 10, 50);
      //   return p[0][0] === VISITED;
      //   printPath(p);
      return p[p.length - 1][0] === 0 && p[p.length - 1][1] === 0;
    });

  // completePaths.forEach((p, j) => {
  //   console.log("j", j);
  //   printMap(p, 10, 50);
  // });
  console.log("completePaths.length", completePaths.length);

  // const completePathVisited = completePaths.map((p) =>
  //   p.flatMap((r) => r.filter((n) => n === VISITED))
  // );

  // const lengths = completePathVisited.map((p) => {
  //   console.log(`[${p.join("")}]: length = ${p.length}`);
  //   return p.length;
  // });

  const lengths = paths.slice(0, 100).map((p) => {
    // console.log('p', p)
    return p.length;
  });

  // if (lengths.length <= 0) {
  //   throw new Error("no complete path");
  // }
  const shortestCompletePath = Math.min(...lengths);
  const longestPath = Math.max(...lengths);

  console.log("shortest", shortestCompletePath - 1); // minus 1 for start visited on step 0
  console.log("longest", longestPath); // minus 1 for start visited on step 0

  if (completePaths.length > 0) {
    console.log("BREAK LOOP, FOUND COMPLETE PATH");
    //   break;
  } else {
    throw new Error("no complete path");
  }

  // if (loop >= SEARCH_DEPTH) {
  //   console.log("BREAK LOOP, DEPTH REACHED", loop);
  //   break;
  // }
}
// }

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
  //   node: Position,
  //   [row, col]: Index,
  frontier: Index[],
  map: Map,
  depth: number,
  searchDepth: number,
  paths: Index[][]
): Index[][] {
  console.log(`depth: ${depth}, searchDepth: ${searchDepth}`);
  //   console.log(`frontier.length = ${frontier.length}`);

  //   const copy = map.map((n) => ({
  //     ...n,
  //   }));

  const next = frontier.slice(0).shift();
  //   console.log("frontier", frontier);

  if (!next) {
    throw new Error("Search done?");
  }

  const [nRow, nCol] = next;
  const node = map[nRow][nCol];

  //   console.log(`map[${nRow}][${nCol}]: ${node}`);

  //   should have possible end state
  if (node === START) {
    console.log(`END STATE: map[${nRow}][${nCol}]=${node}`);
    let nextMap: Position[][] = map.map((row) => [...row]);
    nextMap[nRow][nCol] = VISITED;

    printMap(nextMap, 0, 10, 0, 90);
    // return [nextMap];
    return paths;
  }

  //   if (node === VISITED) {
  //     console.log(`ALREADY VISITED!: map[${nRow}][${nCol}]=${node}`);

  //     // for (const m in paths) {
  //     //   printMap(paths[m], 0, 10, 0, 90);
  //     // }
  //     return paths;
  //   }

  if (depth >= searchDepth) {
    console.log("DEPTH REACHED", depth);
    // let nextMap: Position[][] = map.map((row) => [...row]);
    // let nextMap = map;
    map[nRow][nCol] = VISITED;

    printMap(map, 0, 50, 0, 95);

    return paths;
  }

  //   const neighbors: Index[] = getNeighbors([nRow, nCol]);
  //   console.log("neighbors", neighbors);

  //   const options: Index[] = neighbors
  //     .filter((neighbor) => {
  //       return !isOutside(neighbor, map);
  //     })
  //     .filter(([row, col]) => {
  //       return canVisit(node as number, map[row][col]);
  //     });

  const options: Index[] = leetCanVisit([nRow, nCol], map);
  // .sort(([aRow, aCol], [bRow, bCol]) => {
  //   //   console.log(`b: ${map[bRow][bCol]}, a: ${map[aRow][aCol]}`);
  //   return (map[bRow][bCol] as number) - (map[aRow][aCol] as number);
  // });
  // .slice(0, 2)
  // .sort((_a, _b) => 0.5 - Math.random());

  //   console.log("options", options);

  const nextFrontier = [
    ...frontier,
    ...options,
    // ...options.filter(([i, j]) => {
    //   //   console.log(
    //   //     `frontier includes [ ${i} , ${j} ]? ${frontier
    //   //       .join(":")
    //   //       .split(":")
    //   //       .includes(`${i},${j}`)}`
    //   //   );
    //   //   console.log("frontier.join", frontier.join(":"));

    //   return !frontier.join(":").split(":").includes(`${i},${j}`);
    // }),
  ];

  //   console.log("nextFrontier", nextFrontier);
  const nextDepth = ++depth;
  //   const nextMap: Position[][] = map.map((row) => [...row]);
  const nextMap = map;
  nextMap[nRow][nCol] = VISITED;

  //   let nextPaths: Index[][] = paths;
  //   if (options.length === 1) {
  //     nextPaths = paths.map((p) => {
  //       return [...p, ...options];
  //     });
  //     // nextPaths = [...paths, ...nextFrontier];
  //   } else {

  //     nextPaths = options.flatMap((o) => {
  //       //   console.log("frontier", f);
  //       //   return [f];
  //       return paths.map((p) => {
  //         if (p[p.length - 1][0] === nRow && p[p.length - 1][1] === nCol) {
  //           return [...p, o];
  //         } else {
  //           return [...p];
  //         }
  //       });
  //     });
  //   }

  //   const nextPaths: Index[][] = paths.flatMap((p) => {
  //     if (options.length === 0) {
  //       // dead end, can remove this path?
  //       //   - which paths to remove? Can't be sure exactly which path led to this node with no options
  //       return [p];
  //     } else {
  //       return options.map((o) => {
  //         // Add option to path ending with current node.
  //         // NB. Can't be sure the path is actually the exact path which led to this node
  //         if (p[p.length - 1][0] === nRow && p[p.length - 1][1] === nCol) {
  //           return [...p, o];
  //         } else {
  //           return p;
  //         }
  //       });
  //     }
  //   });

  let nextPaths: Index[][] = [];
  if (options.length === 0) {
    // No options === Dead end, can remove this path?
    nextPaths = paths;
    //   } else {
    //     const curr = paths.filter(
    //       (p) => p[p.length - 1][0] === nRow && p[p.length - 1][1] === nCol
    //     );
    //     const acc = paths.filter(
    //       (p) => p[p.length - 1][0] !== nRow || p[p.length - 1][1] !== nCol
    //     );

    //     nextPaths = [
    //       ...acc,
    //       ...curr.flatMap((p) => {
    //         return options.map((o) => [...p, o]);
    //       }),
    //     ];
  }

  //   for (const p in nextPaths) {
  //     console.log(`=====path[${p}]======`);
  //     printPath(nextPaths[p]);
  //     // console.log("nextPaths[m].length", nextPaths[m].length);
  //   }

  return getPaths(nextFrontier, nextMap, nextDepth, searchDepth, nextPaths);

  //   //   Dead end?
  //   if (options.length === 0) {
  //     console.log(`DEAD END: map[${nRow}][${nCol}]=${node}`);
  //     // printMap(map, 10, 90);
  //     return [map];
  //   } else {
  //     // flatMap?
  //     // return options.flatMap(([row, col]) => {
  //     const nextDepth = ++depth;

  //     return options.flatMap(([row, col]) => {
  //       //   console.log(`row:  ${row}. col: ${col}`);
  //       const node: Position = map[row][col];
  //       const idx: Index = [row, col];
  //       const nextMap: Position[][] = map.map((row) => [...row]);
  //       nextMap[nRow][nCol] = VISITED;

  //       //   console.log("=============================================");
  //       //   printMap(nextMap, 0, 40, 100, 141);

  //       //   return getPaths(node, idx, nextMap, ++depth, searchDepth);
  //       return getPaths(node, idx, nextMap, nextDepth, searchDepth);
  //       // return [];
  //       // return getPaths(map[row][col], [row, col], copy)
  //     });
  //   }
}

function leetCanVisit([row, col]: Index, map: Map) {
  // const bottom = [row + 1, col]
  // const left = [row, col - 1]
  // const top = [row - 1, col]
  // const right = [row, col + 1]
  const ns = [
    [row + 1, col], //bottom
    [row, col - 1], //left
    [row - 1, col], //top
    [row, col + 1], //right
  ].filter(([i, j]) => {
    return i > 0 && j > 0 && i < map.length - 1 && j < map[0].length - 1;
  });

  const go: Index[] = (ns as Index[]).filter(([i, j]) => {
    if (map[i][j] === VISITED) {
      return false;
    } else if (map[i][j] === START) {
      return map[row][col] <= 2;
    } else if (map[row][col] === END) {
      return 26 - (map[i][j] as number) <= 1;
    } else {
      return (map[row][col] as number) - (map[i][j] as number) <= 1;
    }
  });
  //   console.log("Go", go);

  return go;
}

function getNeighbors([row, col]: Index): Index[] {
  return [
    [row + 1, col], //bottom
    [row, col - 1], //left
    [row - 1, col], //top
    [row, col + 1], //right
  ];
}

function isOutside([row, col]: Index, map: Map) {
  return row < 0 || col < 0 || row > map.length - 1 || col > map[0].length - 1;
}

function canVisit(node: Position, neighbor: Position) {
  // check index or height or visited
  //   console.log("node", node, "neighbor", neighbor);

  if (neighbor === VISITED) {
    return false;
  } else if (neighbor === START) {
    return node <= 2;
  } else if (node === START) {
    return neighbor <= 2;
  } else if (node === END) {
    return getCharValue("z") - (neighbor as number) <= 1;
  } else if (neighbor === END) {
    return getCharValue("z") <= (node as number) - 1;
  } else {
    return (node as number) - neighbor <= 1;
  }
}

function printPath(path: Index[]) {
  console.log(`${path.join("-")}`);
}

function printMap(
  map: Position[][],
  minRow = 0,
  rows = map.length,
  minCol = 0,
  cols = map[0].length
) {
  //   console.log("map", map);
  map.slice(minRow, rows).forEach((row) => {
    // console.log(`[${row.map((n) => (n.visited ? "v" : ".")).join("")}]`);
    console.log(
      //   `[${row.map((n) => n.height.toString().padStart(2, " ")).join(" ")}]`
      //   `[${row.map((n) => n.toString().padStart(2, " ")).join("")}]`
      `[${row
        .slice(minCol, cols)
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
