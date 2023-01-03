import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

type Index = [x: number, y: number, z: number];

type Coord = "X" | "Y" | "Z";

const INITIAL_SCAN = {
  data: [] as Index[],
  area: 0 as number,
} as const;

type Scan = typeof INITIAL_SCAN;

type Cube = {
  index: Index;
  surfaceArea: number;
};

async function calculateRockSize(filename = REAL_INPUT) {
  const input = await readInput(filename);

  console.log("input", input);
  const xAdjacent = sortBy("Y")(input.slice()).map((cube, i, arr) => {
    let initialSurfaceArea = cube.surfaceArea;
    const prev = arr[i - 1];
    const next = arr[i + 1];
    if (isAdjacent(cube, prev, "X")) {
      if (prev.index[0] === cube.index[0] - 1) {
        //covered on left
        initialSurfaceArea = initialSurfaceArea - 1;
      }

      if (prev.index[0] === cube.index[0] + 1) {
        //covered on right
        initialSurfaceArea = initialSurfaceArea - 1;
      }
    }
    //  Do same for next
    if (isAdjacent(cube, next, "X")) {
      if (next.index[0] === cube.index[0] - 1) {
        //covered on left
        initialSurfaceArea = initialSurfaceArea - 1;
      }

      if (next.index[0] === cube.index[0] + 1) {
        //covered on right
        initialSurfaceArea = initialSurfaceArea - 1;
      }
    }
    return {
      ...cube,
      surfaceArea: initialSurfaceArea,
    };
  });
  console.log("xAdjacent", xAdjacent);

  const yAdjacent = sortBy("Z")(xAdjacent.slice()).map((cube, i, arr) => {
    let initialSurfaceArea = cube.surfaceArea;
    const prev = arr[i - 1];
    const next = arr[i + 1];
    if (isAdjacent(cube, prev, "Y")) {
      if (prev.index[1] === cube.index[1] - 1) {
        //covered below
        initialSurfaceArea = initialSurfaceArea - 1;
      }

      if (prev.index[1] === cube.index[1] + 1) {
        //covered above
        initialSurfaceArea = initialSurfaceArea - 1;
      }
    }
    //  Do same for next
    if (isAdjacent(cube, next, "Y")) {
      if (next.index[1] === cube.index[1] - 1) {
        //covered below
        initialSurfaceArea = initialSurfaceArea - 1;
      }

      if (next.index[1] === cube.index[1] + 1) {
        //covered above
        initialSurfaceArea = initialSurfaceArea - 1;
      }
    }
    return {
      ...cube,
      surfaceArea: initialSurfaceArea,
    };
  });

  console.log("yAdjacent", sortBy("Y")(yAdjacent.slice()));

  const zAdjacent = sortBy("X")(yAdjacent.slice()).map((cube, i, arr) => {
    let initialSurfaceArea = cube.surfaceArea;
    const prev = arr[i - 1];
    const next = arr[i + 1];
    if (isAdjacent(cube, prev, "Z")) {
      if (prev.index[2] === cube.index[2] - 1) {
        //covered in front
        initialSurfaceArea = initialSurfaceArea - 1;
      }

      if (prev.index[2] === cube.index[2] + 1) {
        //covered in back
        initialSurfaceArea = initialSurfaceArea - 1;
      }
    }
    //  Do same for next
    if (isAdjacent(cube, next, "Z")) {
      if (next.index[2] === cube.index[2] - 1) {
        //covered in front
        initialSurfaceArea = initialSurfaceArea - 1;
      }

      if (next.index[2] === cube.index[2] + 1) {
        // covered in back
        initialSurfaceArea = initialSurfaceArea - 1;
      }
    }
    return {
      ...cube,
      surfaceArea: initialSurfaceArea,
    };
  });

  console.log("zAdjacent", sortBy("Y")(zAdjacent.slice()));

  const totalSurfaceArea = zAdjacent.reduce((acc, curr) => {
    return acc + curr.surfaceArea
  }, 0)

  console.log('totalSurfaceArea', totalSurfaceArea);
  
}

async function readInput(filename: string): Promise<Cube[]> {
  const processor = await createLineProcessor(filename);

  const input: Cube[] = [];
  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error(`Oops, lines: ${line}`);
    }

    input.push({
      index: line.split(",").map((c) => parseInt(c)) as Index,
      surfaceArea: 6,
    });
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

function sortBy(coord: Coord) {
  if (coord === "X") {
    return (arr: Cube[]) => {
      return arr.sort((a, b) => {
        const [ax, ay, az] = a.index;
        const [bx, by, bz] = b.index;
        return ax === bx ? (ay === by ? az - bz : ay - by) : ax - bx;
      });
    };
  } else if (coord === "Y") {
    return (arr: Cube[]) => {
      return arr.sort((a, b) => {
        const [ax, ay, az] = a.index;
        const [bx, by, bz] = b.index;
        return ay === by ? (az === bz ? ax - bx : az - bz) : ay - by;
      });
    };
  } else {
    return (arr: Cube[]) => {
      return arr.sort((a, b) => {
        const [ax, ay, az] = a.index;
        const [bx, by, bz] = b.index;
        return az === bz ? (ax === bx ? ay - by : ax - bx) : az - bz;
      });
    };
  }
}

function isAdjacent(cube: Cube, adj: Cube, coord: Coord) {
  if (coord === "X") {
    return (
      adj && adj.index[1] === cube.index[1] && adj.index[2] === cube.index[2]
    );
  } else if (coord === "Y") {
    return (
      adj && adj.index[0] === cube.index[0] && adj.index[2] === cube.index[2]
    );
  } else {
    return (
      adj && adj.index[0] === cube.index[0] && adj.index[1] === cube.index[1]
    );
  }
}

function addCube([x, y, z]: Index, { data, area }: Scan = INITIAL_SCAN): Scan {
  if (!data.length) {
    return {
      data: [[x, y, z]],
      area: 6,
    };
  }

  const updated = data.reduce(
    ({ data, area }, part, index, arr) => {
      // if ();
      const adjacent = data.findIndex(([dx, dy, dz]) => {
        return (
          (dx === x && dy === y) ||
          (dx === x && dz === z) ||
          (dy === y && dz === z)
        );
      });

      if (adjacent >= 0) {
        console.log("HERE1");

        return {
          data: [...data, [x, y, z] as Index],
          area: area + 4,
        };
      } else {
        console.log("HERE2");
        return {
          data: [...data, [x, y, z] as Index],
          area: area + 6,
        };
      }
    },
    { data, area }
  );
  return updated;
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;
  console.time("run");

  const res = await calculateRockSize();

  console.timeEnd("run");
})();

// for tests
export { addCube, sortBy };
