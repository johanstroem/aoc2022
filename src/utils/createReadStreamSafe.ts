import fs from "fs";

async function createReadStreamSafe(filename: string, options?: any) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filename, options);
    fileStream.on("error", reject).on("open", () => {
      resolve(fileStream);
    });
  });
}

export default createReadStreamSafe;
