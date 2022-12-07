import readline from "readline";
import { createReadStreamSafe, REAL_INPUT, TEST_INPUT } from "../utils";
import createLineProcessor from "../utils/lineProcessor";

async function processLineByLine(
  filename: string,
  callback?: (line: string) => any
) {
  const fileStream = await createReadStreamSafe(filename);

  const rl = readline.createInterface({
    input: fileStream as any,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (typeof callback === "function") {
      callback(line);
    }
  }
}

function getChar(line: string) {
  const middle = Math.floor(line.length / 2);

  const [first, second] = [line.substring(0, middle), line.substring(middle)];
  return first.split("").find((c) => {
    return second.indexOf(c) >= 0;
  }) as string;
}

function getPriority(line: string) {
  const char = getChar(line);
  return getCharValue(char);
}

function getCharValue(char: string) {
  const UPPERCASE_RANGE = [...Array(91).keys()].slice(65);
  const LOWERCASE_RANGE = [...Array(123).keys()].slice(97);

  const charCodeValue = char.charCodeAt(0);
  if (UPPERCASE_RANGE.includes(charCodeValue)) return charCodeValue - 38;
  if (LOWERCASE_RANGE.includes(charCodeValue)) return charCodeValue - 96;
  return 0;
}

function getItemType(lines: string[]) {
  const [elf1, elf2, elf3] = lines;

  const uniqueItem1 = elf1.split("").filter((c) => elf2.indexOf(c) >= 0);
  const uniqueItem2 = uniqueItem1.filter((c) => elf3.indexOf(c) >= 0);
  return uniqueItem2[0];
}

async function priorityCount(filename = REAL_INPUT) {
  let priorityCount = 0;

  function getPriorityCb(lines: string | string[]) {
    if (typeof lines === "string") {
      throw new Error("oopsie");
    }
    // priorityCount += getPriority(line);
    const char = getItemType(lines);

    priorityCount += getCharValue(char);
  }

  const processor = await createLineProcessor(filename);

  try {
    await processor({ callback: getPriorityCb, readNoLines: 3 });
  } catch (error) {
    console.error("error", error);
  }

  console.log("priorityCount", priorityCount);
  return priorityCount;
}

(async function run() {
  await priorityCount();
})();

// for tests
export { getPriority, getCharValue, priorityCount, getItemType };
