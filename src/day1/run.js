import events from 'events'
import fs from 'fs'
import readline from 'readline'

async function processLineByLine(filename) {
    let elfcount = 1
    const elfs = {}

    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(filename),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            if (!line) {
                elfcount++
            } else {
                if (elfs[elfcount] !== undefined) {
                    elfs[elfcount] += +line
                } else {
                    elfs[elfcount] = +line
                }
            }
        });

        await events.once(rl, 'close');

        console.log('Reading file line by line with readline done.');
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        return elfs
    } catch (err) {
        console.error(err);
    }
}

async function calorieCount() {

    const elfs = await createCalorieObject()
    const values = Object.values(elfs)
    const sorted = values.sort((a, b) => b - a)

    const max = sorted[0]
    console.log(max);
    const top3 = sorted.slice(0, 3).reduce((tot, val) => tot += val, 0)
    console.log(top3)
}

async function createCalorieObject() {
    return processLineByLine('/Users/johanstrom/aoc2022/src/day1/input.txt')
}

async function run() {
    await calorieCount()
}

await run()
