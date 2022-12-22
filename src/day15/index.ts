import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import { Map, printMap } from "../utils";
import createLineProcessor from "../utils/lineProcessor";

async function discoverCoverage(filename = REAL_INPUT) {
  const [sensors, beacons] = await readInput(filename);

  //   console.log("sensors", sensors);
  console.log("sensors.length", sensors.length);
  //   console.log("beacons", beacons);
  console.log("beacons.length", beacons.length);

  //   function combineRanges(
  //     range: Range,
  //     index: number,
  //     overlappingRanges: Range[]
  //   ): Range {
  //     console.log("range", range);
  //     console.log("index", index);
  //     console.log("overlapping, i", overlappingRanges[index]);

  //     return [...range];
  //   }

  const rowCoverage = getRowCoverageFn(sensors);

  const cov10 = rowCoverage(10);
  const cov2000000 = rowCoverage(2000000);

  console.log("cov10", cov10);
  console.log("cov10 count", cov10.filter((i) => i).length);

  console.log("cov2000000", cov2000000);
  console.log("cov2000000 length", cov2000000[0][1] - cov2000000[0][0]);
}

type Index = [x: number, y: number];

type Beacon = {
  position: Index;
  sensors?: Sensor[];
};
type Sensor = {
  position: Index;
  dx: number;
  dy: number;
  manhattanDistance: number;
  beacon?: Beacon;
};
type Range = [min: number, max: number];

// type Sensor2 = {
//   x: number;
//   y: number;
//   dx: number;
//   dy: number;
//   manhattanDistance: number;
//   beacon?: Beacon;
// };

async function readInput(filename: string): Promise<[Sensor[], Beacon[]]> {
  const processor = await createLineProcessor(filename);

  const sensors: Sensor[] = [];
  const beacons: Beacon[] = [];

  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error(`Oops, lines: ${line}`);
    }

    let [sensor, beacon] = line.split(":");
    let [sx, sy] = sensor
      .split(",")
      .map((s) => (s.match(/-?\d+/) || [])[0])
      .map((s) => parseInt(s || ""));
    let [bx, by] = beacon
      .split(",")
      .map((s) => (s.match(/-?\d+/) || [])[0])
      .map((s) => parseInt(s || ""));

    // console.log(`sX: ${sx}, sY: ${sy}`);
    // console.log(`bX: ${bx}, bY: ${by}`);

    const dx = bx - sx;
    const dy = by - sy;
    // console.log(`dx: ${dx}, dy: ${dy}`);

    console.log("======== sensor =========");

    console.log({
      position: [sx, sy],
      beacon: {
        position: [bx, by],
      },
      dx,
      dy,
      manhattanDistance: Math.abs(dx) + Math.abs(dy),
    });

    sensors.push({
      position: [sx, sy],
      beacon: {
        position: [bx, by],
      },
      dx,
      dy,
      manhattanDistance: Math.abs(dx) + Math.abs(dy),
    });

    // TODO: only push new beacons
    // beacons.push({
    //   position: [+bX, +bY],
    //   sensors: [
    //     {
    //       position: [+sX, +sY],
    //     },
    //   ],
    // });
  }

  try {
    await processor({
      callback,
    });
  } catch (error) {
    console.error("error", error);
  }
  return [sensors, beacons];
}

function getRowCoverageFn(
  sensors: ReadonlyArray<Sensor>
): (row: number) => Range[] {
  return (row: number) => {
    const coveredRanges: Range[] = sensors
      .filter((s) => {
        //   console.log(
        //     `Sensor @ [${s.position[0]}, ${s.position[1]}], mDistance: ${s.manhattanDistance}`
        //   );
        const distanceToRow = Math.abs(s.position[1] - row);
        return s.manhattanDistance >= distanceToRow;
      })
      .map((s) => {
        console.log(
          `Sensor @ [${s.position[0]}, ${s.position[1]}], mDistance: ${s.manhattanDistance}`
        );

        const distanceToRow = Math.abs(s.position[1] - row);
        console.log("distance to row", distanceToRow);
        const xMinRowCoverage =
          s.position[0] - (s.manhattanDistance - distanceToRow);
        const xMaxRowCoverage =
          s.position[0] + (s.manhattanDistance - distanceToRow);
        console.log(`range: [${xMinRowCoverage}, ${xMaxRowCoverage}]`);

        return [xMinRowCoverage, xMaxRowCoverage] as Range;
      })
      .sort((a, b) => a[0] - b[0]); // sort by xMinRowCoverage, ascending

    //   console.log("coveredRanges", coveredRanges);

    const combinedRanges = coveredRanges.reduce(
      (acc, [min, max], i, arr) => {
        console.log(`curr: [${min}, ${max}]`);

        console.log("acc", acc);
        const last = acc.slice(-1)[0];
        console.log("last", last);

        // min > last.max, then extend range
        if (min <= last[1]) {
          let newLast = [last[0], Math.max(last[1], max)] as Range;
          console.log("newLast", newLast);

          return [...acc.slice(0, -1), newLast];
        } else {
          return [...acc, [min, max] as Range];
        }
      },
      [coveredRanges[0]]
    );
    // .map((v, i,arr) => combineRanges(v, i, arr));

    console.log("combinedRanges", combinedRanges);

    const xMin = Math.min(...coveredRanges.map(([min]) => min));
    const xMax = Math.max(...coveredRanges.map(([_, max]) => max));
    console.log(`xMin: ${xMin}, xMax: ${xMax}`);

    // //   Oops. Not possible to  use arrays because of large indexes
    //   const res = Array(xMax - xMin + 1).fill(false);
    //   console.log("res", res, "- len:", res.length);

    coveredRanges.forEach(([min, max]) => {
      const offsetMin = min + Math.abs(xMin);
      const offsetMax = max + Math.abs(xMin);
      console.log(`min: ${min}, max: ${max}`);
      console.log(`offsetMin: ${offsetMin}, offsetMax: ${offsetMax}`);
      // console.log("fill", ...Array(max - min + 1).fill(true));

      // res.splice(
      //   offsetMin,
      //   offsetMax - offsetMin + 1,
      //   ...Array(max - min + 1).fill(true)
      // );
      // console.log("res", res, "- len:", res.length);
    });

    return combinedRanges;
  };
}

function combineRanges(ranges: Range[]): Range[] {
  const sorted = ranges.sort((a, b) => a[0] - b[0]);
  return sorted.reduce(
    (acc, [min, max], i, arr) => {
      console.log("acc", acc);
      const last = acc.slice(-1)[0];
      if (min <= last[1]) {
        return [...acc.slice(0, -1), [last[0], Math.max(max, last[1])]];
      } else {
        return [...acc, [min, max]];
      }
    },
    [ranges[0]]
  );
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;
  console.time("run");
  await discoverCoverage();
  console.timeEnd("run");
})();

// for tests
export { combineRanges };
