import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

type Index = [x: number, y: number];

const SHAPES = {
  "-": {
    collision: ([bx, by]: Index, bottom: Index[]) => {
      const left = bx < 0;
      const right = bx + 3 >= INITIAL_BOTTOM.length;
      const collided = [
        [bx, by],
        [bx + 1, by],
        [bx + 2, by],
        [bx + 3, by],
      ].some(([bbx, bby]) => bottom.some(([x, y]) => x === bbx && y === bby));
      return left || right || collided; // ####
    },
  },
  "+": {
    collision: ([bx, by]: Index, bottom: Index[]) => {
      const left = bx < 0;
      const right = bx + 2 >= INITIAL_BOTTOM.length;
      const collided = [
        [bx, by],
        [bx + 1, by + 1],
        [bx + 1, by - 1],
        [bx + 2, by],
      ].some(([bbx, bby]) => bottom.some(([x, y]) => x === bbx && y === bby));
      return left || right || collided;
    },
  },
  L: {
    collision: ([bx, by]: Index, bottom: Index[]) => {
      const left = bx < 0;
      const right = bx + 2 >= INITIAL_BOTTOM.length;
      const collided = [
        [bx, by],
        [bx + 1, by],
        [bx + 2, by],
        [bx + 2, by + 1],
        [bx + 2, by + 2],
      ].some(([bbx, bby]) => bottom.some(([x, y]) => x === bbx && y === bby));
      return left || right || collided;
    },
  },
  I: {
    collision: ([bx, by]: Index, bottom: Index[]) => {
      const left = bx < 0;
      const right = bx >= INITIAL_BOTTOM.length;
      const collided = [
        [bx, by],
        [bx, by + 1],
        [bx, by + 2],
        [bx, by + 3],
      ].some(([bbx, bby]) => bottom.some(([x, y]) => x === bbx && y === bby));
      return left || right || collided;
    },
  },
  o: {
    collision: ([bx, by]: Index, bottom: Index[]) => {
      const left = bx < 0;
      const right = bx + 1 >= INITIAL_BOTTOM.length;
      // const expandedBottom = expandBottom(bottom);

      const collided = [
        [bx, by],
        [bx, by + 1],
        [bx + 1, by],
        [bx + 1, by + 1],
      ].some(([bbx, bby]) => bottom.some(([x, y]) => x === bbx && y === bby));
      return left || right || collided;
    },
  },
} as const;

type Shapes = keyof typeof SHAPES;

const DIRECTIONS = ["RIGHT", "LEFT", "DOWN"] as const;
const MOVE = [">", "<"] as const;
type Move = typeof MOVE[number];
const MOVES: Record<Move, typeof DIRECTIONS[number]> = {
  ">": DIRECTIONS[0],
  "<": DIRECTIONS[1],
};

const INITIAL_BOTTOM = Array(7).fill(0);

async function tetris({
  filename = REAL_INPUT,
  iterations = 2022,
  bottom = INITIAL_BOTTOM.map((v, i) => [i, v] as Index),
  offset = 0,
}): Promise<[bottom: Index[], offset: number]> {
  const input = await readInput(filename);

  console.log("============== START ===================");
  const N = iterations;
  let charIndex = offset;
  let moves = offset;

  for (let i = 0; i < N; i++) {
    const shapeChar = getShape(i);
    let shape = SHAPES[shapeChar];

    let position = getStartPosition(shapeChar, bottom);
    // console.log(`InitialPosition: [${[position]}], shape: [${shapeChar}]`);
    for (let j = 0; j < 100000; j++) {
      const move = input.charAt(charIndex) as Move;
      // console.log(`charAt(${charIndex}): [${move}]`);
      charIndex = charIndex + 1 >= input.length ? 0 : charIndex + 1;
      moves++;

      if (MOVES[move] === "RIGHT") {
        const right = [position[0] + 1, position[1]] as Index;
        if (!shape.collision(right, bottom)) {
          position = right;
        }
      } else if (MOVES[move] === "LEFT") {
        const left = [position[0] - 1, position[1]] as Index;
        if (!shape.collision(left, bottom)) {
          position = left;
        }
      }
      const down = [position[0], position[1] - 1] as Index;
      if (!shape.collision(down, bottom)) {
        position = down;
      } else {
        bottom = updateBottom(shapeChar, position, bottom);

        // Cycle finder
        const landIteration = 29;
        if (i > 0 && j === landIteration && shapeChar === "-") {
          console.log(
            `${shapeChar} shape landed @[${position}] N=${i}, j=${j}, char=${shapeChar}, moves=${moves}`
          );
        }
        if (i > 0 && j === landIteration && shapeChar === "+") {
          console.log(
            `${shapeChar} shape landed @[${position}] N=${i}, j=${j}, char=${shapeChar}, moves=${moves}`
          );
        }
        if (i > 0 && j === landIteration && shapeChar === "L") {
          console.log(
            `${shapeChar} shape landed @[${position}] N=${i}, j=${j}, char=${shapeChar}, moves=${moves}`
          );
        }
        if (i > 0 && j === landIteration && shapeChar === "I") {
          console.log(
            `${shapeChar} shape landed @[${position}] N=${i}, j=${j}, char=${shapeChar}, moves=${moves}`
          );
        }
        if (i > 0 && j === landIteration && shapeChar === "o") {
          console.log(
            `${shapeChar} shape landed @[${position}] N=${i}, j=${j}, char=${shapeChar}, moves=${moves}`
          );
        }

        break;
      }
    }
  }
  printBottom(bottom);

  return [bottom, charIndex];
}

function updateBottom(shape: Shapes, [x, y]: Index, bottom: Index[]): Index[] {
  // need to filter unneeded bottom indexes, e.g. rows below any full row
  // ... or just cut any lines > X lines below?
  switch (shape) {
    case "-": {
      return cutBottom([...bottom, [x, y], [x + 1, y], [x + 2, y], [x + 3, y]]);
    }
    case "+": {
      return cutBottom([
        ...bottom,
        [x, y],
        [x + 1, y],
        [x + 1, y - 1],
        [x + 1, y + 1],
        [x + 2, y],
      ]);
    }
    case "L": {
      return cutBottom([
        ...bottom,
        [x, y],
        [x + 1, y],
        [x + 2, y],
        [x + 2, y + 1],
        [x + 2, y + 2],
      ]);
    }
    case "I": {
      return cutBottom([...bottom, [x, y], [x, y + 1], [x, y + 2], [x, y + 3]]);
    }
    case "o": {
      return cutBottom([
        ...bottom,
        [x, y],
        [x + 1, y],
        [x, y + 1],
        [x + 1, y + 1],
      ]);
    }
    default: {
      return bottom;
    }
  }
}

function cutBottom(bottom: Index[]): Index[] {
  const X = 200;
  if (bottom.length < X * 2) return bottom;
  return bottom.slice(X);
}

function getStartPosition(shape: Shapes, bottom: Index[]): Index {
  const max = Math.max(...bottom.map((b) => b[1]));
  switch (shape) {
    case "-":
    case "L":
    case "I":
    case "o": {
      return [2, max + 4];
    }
    case "+": {
      return [2, max + 5];
    }
    default: {
      return [2, max + 4];
    }
  }
}

function getShape(n: number): Shapes {
  if (n % 5 === 1) return "+";
  if (n % 5 === 2) return "L";
  if (n % 5 === 3) return "I";
  if (n % 5 === 4) return "o";
  return "-";
}

async function readInput(filename: string): Promise<string> {
  const processor = await createLineProcessor(filename);
  let input = "";
  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error(`Oops, lines: ${line}`);
    }
    input += line;
  }

  try {
    await processor({
      callback,
    });
  } catch (error) {
    console.error("error", error);
  }
  return input;
}

function printBottom(bottom: Index[], pos?: Index) {
  const max = Math.max(...bottom.map(([_, y]) => y));
  const min = Math.min(...bottom.map(([_, y]) => y));
  let line = "";
  const [posX, posY] = pos || [null, null];

  for (let k = max + 5; k > max; k--) {
    if (posY === k) {
      const row = Array(7).fill(". ");
      row.splice(posX, 1, "@ ");

      console.log(`${k.toString().padStart(3)}: ${row.join("")}`);
    } else {
      console.log(`${k.toString().padStart(3)}: . . . . . . .`);
    }
  }

  for (let i = max; i >= Math.max(min - 30, 0); i--) {
    const atRow = bottom.filter(([_x, y]) => y === i);

    for (let j = 0; j <= 6; j++) {
      line += atRow.findIndex(([x, _y]) => x === j) >= 0 ? "# " : ". ";
    }
    console.log(`${i + 0}:`.padStart(4), line.trim());

    line = "";
  }

  console.log("      0 1 2 3 4 5 6");
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;
  console.time("run");

  const INPUT = REAL_INPUT;
  const nFullIteration = 1730;
  const N = 1_000_000_000_000;

  const [first, firstOffset] = await tetris({
    filename: INPUT,
    iterations: nFullIteration,
  });

  const firstMax = Math.max(...first.map((b) => b[1]));

  const [second, secondOffset] = await tetris({
    filename: INPUT,
    iterations: nFullIteration,
    bottom: first,
    offset: firstOffset,
  });

  const secondMax = Math.max(...second.map((b) => b[1])) - firstMax;

  const [third] = await tetris({
    filename: INPUT,
    iterations: N % nFullIteration,
    bottom: second,
    offset: secondOffset,
  });
  const thirdMax = Math.max(...third.map((b) => b[1])) - (secondMax + firstMax);

  const fullIterations = Math.floor(N / nFullIteration);
  console.log("full iteration cycles", fullIterations);
  console.log("leftover iterations", N % nFullIteration);

  console.log(
    `firstMax: ${firstMax}, secondMax: ${secondMax}, thirdMax: ${thirdMax}`
  );

  console.log("total:", firstMax + secondMax * (fullIterations - 1) + thirdMax);

  console.timeEnd("run");
})();

// for tests
export { updateBottom, printBottom, getShape };
