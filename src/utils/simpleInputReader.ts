import createLineProcessor from "./lineProcessor";

async function simpleInputReader<T extends any>(
  filename: string,
  parser: (line: string) => T
): Promise<T[]> {
  const processor = await createLineProcessor(filename);
  let lines: T[] = [];
  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error("oops");
    }
    lines.push(parser(line));
  }

  try {
    await processor({
      callback,
    });
  } catch (error) {
    console.error("error", error);
  } finally {
    return lines;
  }
}

export default simpleInputReader;
