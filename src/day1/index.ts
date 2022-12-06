import events from "events";
import fs from "fs";
import readline from "readline";
import { REAL_INPUT } from "../utils";

async function calorieCount(filename = REAL_INPUT) {
  const elfs = await createCalorieObject(filename);
  const sorted: number[] = Object.values(elfs).sort((a, b) => b - a);

  const max = sorted[0];
  // Elf with highest calorie count
  console.log(max);
  const top3 = sorted
    .slice(0, 3)
    .reduce((tot: number, val: number) => (tot += val), 0);
  // Combined calorie count of the top 3 elves
  console.log(top3);
  return [max, top3];
}

async function createCalorieObject(filename: string) {
  let elfcount = 1;
  const elfs: Record<string, number> = {};

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(filename),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      if (!line) {
        elfcount++;
      } else {
        if (elfs[elfcount] !== undefined) {
          elfs[elfcount] += +line;
        } else {
          elfs[elfcount] = +line;
        }
      }
    });

    await events.once(rl, "close");

    console.log("Reading file line by line with readline done.");
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(
      `The script uses approximately ${Math.round(used * 100) / 100} MB`
    );
    return elfs;
  } catch (err) {
    console.error(err);
  }
  return elfs;
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;
  await calorieCount();
})();

// for tests
export { calorieCount };
