import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

async function countVisibleTrees(filename = REAL_INPUT) {
  const map = await createTreeMap(filename);

  const visibility = setVisibility(map);

  const visibleCount = visibility
    .flat(1)
    .filter(({ visibility }) => visibility === VISIBLE).length;
  console.log("visibleCount", visibleCount);
  const maxScenicScore = Math.max(...visibility.flatMap((val) => val.map(t => t.scenicScore)))
  console.log("maxScenicScore", maxScenicScore);

}

async function createTreeMap(filename: string): Promise<number[][]> {
  const map: number[][] = [];
  const processor = await createLineProcessor(filename);

  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error("oops");
    }
    let row = line.split("").map((n) => Number(n));
    map.push(row);
  }

  try {
    await processor({
      callback,
    });
    return map;
  } catch (error) {
    // console.error("error", error);
  }
  return [];
}

const HIDDEN = "H";
type Hidden = typeof HIDDEN;
const VISIBLE = "V";
type Visible = typeof VISIBLE;

// type Range = Tree['height']

type Tree = {
  height: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  visibility: Hidden | Visible;
  scenicScore: number;
};

function setVisibility(map: number[][]): Tree[][] {
  //   let rows = map.length;
  //   let columns = map[0].length;

  //   console.log("rows", rows);
  //   console.log("columns", columns);

  let visibility = map.map((row, i, arr) => {
    // console.log(`row[${i}]`, row);
    if (i === 0 || i === arr.length - 1) {
      return row.map((tree) => ({
        height: tree,
        visibility: VISIBLE,
        scenicScore: 0,
      }));
    }
    return row.map((tree, j, arr) => {
      if (j === 0 || j === arr.length - 1) {
        return {
          height: tree,
          visibility: VISIBLE,
          scenicScore: 0,
        };
      }
    //   console.log(`tree[${i}][${j}]`, tree);

      const [visibility, scenicScore] = checkVisibility({
        tree: tree as Tree["height"],
        position: [i, j],
        row,
        column: map.map((row) => row[j]),
      });
    //   console.log("visibility", visibility);

      return {
        height: tree,
        visibility,
        scenicScore,
      };
    });
  });

//   console.log("visibility", visibility);

  return visibility as Tree[][];
}

function checkVisibility({
  tree,
  position,
  row,
  column,
}: {
  tree: Tree["height"];
  position: [row: number, column: number];
  row: number[];
  column: number[];
}) {
//   console.log("tree", tree);

  const [i, j] = position;
  const top = column.slice(0, i);
  const bottom = column.slice(i + 1);
//   console.log("top", top);
//   console.log("bottom", bottom);

  const left = row.slice(0, j);
  const right = row.slice(j + 1);
//   console.log("left", left);
//   console.log("right", right);

  const topIndex = top.reverse().findIndex((height) => height >= tree);
  const bottomIndex = bottom.findIndex((height) => height >= tree);
  const leftIndex = left.reverse().findIndex((height) => height >= tree);
  const rightIndex = right.findIndex((height) => height >= tree);

//   console.log("top", topIndex);
//   console.log("bottom", bottomIndex);
//   console.log("left", leftIndex);
//   console.log("right", rightIndex);

  const scenicScore =
    (topIndex >= 0 ? topIndex + 1 : top.length) *
    (bottomIndex >= 0 ? bottomIndex + 1 : bottom.length) *
    (leftIndex >= 0 ? leftIndex + 1 : left.length) *
    (rightIndex >= 0 ? rightIndex + 1 : right.length);

  const visibility =
    top.some((height) => height >= tree) &&
    bottom.some((height) => height >= tree) &&
    left.some((height) => height >= tree) &&
    right.some((height) => height >= tree)
      ? HIDDEN
      : VISIBLE;
  return [visibility, scenicScore];
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await countVisibleTrees();
})();

// for tests
export { createTreeMap, setVisibility, Tree, HIDDEN, VISIBLE, checkVisibility };
