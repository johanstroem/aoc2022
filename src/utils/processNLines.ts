import readline from "readline";
import createReadStreamSafe from "./createReadStreamSafe";

async function processNLines(
  filename: string,
  callback: (nLines: string[]) => any,
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
      typeof callback === "function" && callback(nLines);
      nLines.splice(0, n);
      i = 0;
    }
  }
}

export default processNLines;
