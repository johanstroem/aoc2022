import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import processNLines from "../utils/processNLines";

function findMarker(line: string | string[]) {
  if (typeof line !== "string") {
    throw new Error("oops");
  }

  console.log("line", Array.from(line));
  console.log("line.length", Array.from(line).length);

  // parse line using Array.reduce
  const marker = Array.from(line).reduce((prev, curr, index, arr) => {
    console.log("curr", curr);

    if (prev.length < 4) {
      return prev + curr;
    }

    console.log("next", prev.substring(1) + curr);
    const next = prev.substring(1) + curr;

    if (new Set(next).size === next.length) {
      // All chars are unique. i.e. this is the marker
      console.log("found marker", next);
      arr.splice(1);
      return next;
    }
    return next;
  }, "");

  console.log("marker", marker);

  const index = line.indexOf(marker);
  console.log("index", index);

  console.log("answer:", index + marker.length)

  return index + marker.length;
}

async function findStartMarkerIndex(filename: string) {
  try {
    await processNLines({
      filename,
      callback: findMarker,
      n: 1,
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
  await getStartMarker();
})();

// for tests
export { findMarker };
