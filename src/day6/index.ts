import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

function findMarker(line: string | string[], markerLength = 4) {
  if (typeof line !== "string") {
    throw new Error("oops");
  }

  // parse line using Array.reduce
  const marker = Array.from(line).reduce((prev, curr, _i, arr) => {
    if (prev.length < markerLength) {
      return prev + curr;
    }

    const next = prev.substring(1) + curr;

    if (new Set(next).size === next.length) {
      // All chars are unique. i.e. this is the marker
      arr.splice(1); // ugly break
      return next;
    }
    return next;
  }, "");

  console.log("marker", marker);
  const index = line.indexOf(marker);

  console.log("answer:", index + marker.length);
  return index + marker.length;
}

async function findStartMarkerIndex(filename: string) {
  const processor = await createLineProcessor(filename);

  try {
    
    await processor({
      callback: (line) => findMarker(line, 14),
    });

    return {
      initialState: [],
    };
  } catch (error) {
    console.error("error", error);
  }
}

async function getStartMarker(filename = REAL_INPUT) {
  await findStartMarkerIndex(filename);
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;
  await getStartMarker();
})();

// for tests
export { findMarker };
