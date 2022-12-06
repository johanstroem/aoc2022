import readline from "readline";
import createReadStreamSafe from "./createReadStreamSafe";

type Options = {
  filename: string;
  callback: (nLines: string[] | string) => any;
  n?: number;
  startLine?: number;
  returnCondition?: (line: string) => boolean;
};

async function processNLines({
  filename,
  callback,
  n = 1,
  startLine = 0,
  returnCondition = undefined,
}: Options): Promise<void | {
  lines: ReturnType<Options["callback"]>;
  endLine: number;
}> {
  const fileStream = await createReadStreamSafe(filename);
  const rl = readline.createInterface({
    input: fileStream as any,
    crlfDelay: Infinity,
  });
  let i = 0;
  const nLines: string[] = [];

  for await (const line of rl) {
    i++;

    if (i < startLine) continue;

    if (typeof returnCondition === "function" && returnCondition(line)) {
      return {
        lines: callback(nLines.length === 1 ? nLines[0] : nLines),
        endLine: i,
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

  // run callback on odd lines left?
  if (nLines.length > 0) {
    typeof callback === "function" && callback(nLines);
  }
}

export default processNLines;
