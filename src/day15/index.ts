import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

async function discoverCoverage(filename = REAL_INPUT) {
  const [sensors, beacons] = await readInput(filename);

  //   console.log("sensors", sensors);
  console.log("sensors.length", sensors.length);
  //   console.log("beacons", beacons);
  console.log("beacons.length", beacons.length);

  const rowCoverage = getRowCoverageFn(sensors);

  const cov10 = rowCoverage(10);
  const cov2000000 = rowCoverage(2000000);

  //   console.log("cov10", cov10);
  //   console.log("cov10 count", cov10.filter((i) => i).length);

  console.log("cov2000000", cov2000000);
  console.log("cov2000000 length", cov2000000[0][1] - cov2000000[0][0]); // should be + 1 but one beacon is at row 2000000 so it's correct anyway
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
        const distanceToRow = Math.abs(s.position[1] - row);
        return s.manhattanDistance >= distanceToRow;
      })
      .map((s) => {
        // console.log(
        //   `Sensor @ [${s.position[0]}, ${s.position[1]}], mDistance: ${s.manhattanDistance}`
        // );

        const distanceToRow = Math.abs(s.position[1] - row);
        // console.log("distance to row", distanceToRow);
        const xMinRowCoverage =
          s.position[0] - (s.manhattanDistance - distanceToRow);
        const xMaxRowCoverage =
          s.position[0] + (s.manhattanDistance - distanceToRow);
        // console.log(`range: [${xMinRowCoverage}, ${xMaxRowCoverage}]`);

        return [xMinRowCoverage, xMaxRowCoverage] as Range;
      });

    return combineRanges(coveredRanges);
  };
}

function combineRanges(ranges: Range[]): Range[] {
  const sorted = ranges.sort((a, b) => a[0] - b[0]);
  return sorted.reduce(
    (acc, [min, max]) => {
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
