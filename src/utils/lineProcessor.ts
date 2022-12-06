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
  callback: (nLines: string[] | string) => any;
  n?: number;
  startLine?: number;
  returnCondition?: (line: string) => boolean;
  rl: Interface;
};

async function processNLines({
  callback,
  rl,
  n = 1,
  startLine = 0,
  returnCondition = undefined,
}: Options): Promise<null | {
  lines: ReturnType<Options["callback"]>;
  nextLine: number;
}> {
  let i = 0;
  const nLines: string[] = [];

  for await (const line of rl) {
    i++;

    if (i < startLine) continue;

    if (typeof returnCondition === "function" && returnCondition(line)) {
      return {
        lines: callback(nLines.length === 1 ? nLines[0] : nLines),
        nextLine: i + 1,
      };
    }

    nLines.push(line);

    // replace with modulo operation
    if (i > n - 1) {
      callback(nLines.length === 1 ? nLines[0] : nLines);
      nLines.splice(0, n);
      i = startLine;
    }
  }

  // const closed = await events.once(rl, "close");
  // console.log('closed', closed);

  if (nLines.length > 0) {
    // throw if nLines contains unprocessed lines
    new Error("processNLines did now process all lines");
  }
  return null;
}

export default createLineProcessor;
