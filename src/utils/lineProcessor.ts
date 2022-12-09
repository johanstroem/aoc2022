// import events from "events";
import readline, { Interface } from "readline";
import createReadStreamSafe from "./createReadStreamSafe";

type LineProcessor = (
  args: Omit<Options, "rl">
) => ReturnType<typeof processNLines>;

async function createLineProcessor(filename: string): Promise<LineProcessor> {
  const fileStream = await createReadStreamSafe(filename);
  const rl = readline.createInterface({
    input: fileStream as any,
    crlfDelay: Infinity,
  });

  return (args) =>
    processNLines({
      ...args,
      rl,
    });
}

type Options = {
  callback: (lines: string[] | string) => any;
  readNoLines?: number;
  startLine?: number;
  returnCondition?: (line: string) => boolean;
  rl: Interface;
};

async function processNLines({
  callback,
  rl,
  readNoLines = 1,
  startLine = 0,
  returnCondition = undefined,
}: Options): Promise<null | {
  lines: ReturnType<Options["callback"]>;
  nextLine: number;
}> {
  let lineNo = 0;
  let counter = 0;
  const lines: string[] = [];

  for await (const line of rl) {
    lineNo++;
    counter++;

    if (counter < startLine) continue;

    if (typeof returnCondition === "function" && returnCondition(line)) {
      return {
        lines: callback(lines.length === 1 ? lines[0] : lines),
        nextLine: counter + 1,
      };
    }

    lines.push(line);

    // replace with modulo operation
    if (counter > readNoLines - 1) {
      callback(lines.length === 1 ? lines[0] : lines);
      lines.splice(0, readNoLines);
      counter = startLine;
    }
  }

  if (lines.length > 0) {
    // throw if lines contains unprocessed lines
    new Error("processNLines did now process all lines");
  }
  return null;
}

export default createLineProcessor;
