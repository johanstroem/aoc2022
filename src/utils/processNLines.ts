import readline from "readline";
import createReadStreamSafe from "./createReadStreamSafe";

async function processNLines(
  filename: string,
  callback: (nLines: string[] | string) => any,
  n = 1
) {
  const fileStream = await createReadStreamSafe(filename);
  const rl = readline.createInterface({
    input: fileStream as any,
    crlfDelay: Infinity,
  });
  let i = 0;
  const nLines: string[] = [];
  for await (const line of rl) {
    nLines.push(line);
    i++;

    if (i > n - 1) {
      typeof callback === "function" &&
        callback(nLines.length === 1 ? nLines[0] : nLines);
      nLines.splice(0, n);
      i = 0;
    }
  }
}

export default processNLines;
