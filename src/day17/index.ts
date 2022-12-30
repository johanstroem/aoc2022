import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

type Index = [x: number, y: number];
const SHAPES = {
  "-": {
    collision: ([bx, by]: Index, bottom: Index[]) => {
      // console.log("new pos", [bx, by], "bottom", bottom);

      // const expandedBottom = expandBottom(bottom);

      // console.log("expanded", expandedBottom, "length:", expandedBottom.length);

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
      // console.log("new pos", [bx, by], "bottom", bottom);
      // const expandedBottom = expandBottom(bottom);

      const left = bx < 0;
      const right = bx + 2 >= INITIAL_BOTTOM.length;

      const collided = [
        [bx, by],
        [bx + 1, by + 1],
        [bx + 1, by - 1],
        [bx + 2, by],
      ].some(([bbx, bby]) => bottom.some(([x, y]) => x === bbx && y === bby));
      // console.log("left +", left);
      // console.log("right +", right);
      // console.log("collided +", collided);
      return left || right || collided;
    },
  },
  L: {
    collision: ([bx, by]: Index, bottom: Index[]) => {
      const left = bx < 0;
      const right = bx + 2 >= INITIAL_BOTTOM.length;
      // const expandedBottom = expandBottom(bottom);

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
      // const expandedBottom = expandBottom(bottom);

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

// const INITIAL_BOTTOM = Array(7)
//   .fill(null)
//   .map((_, i) => [0, i]);

const INITIAL_BOTTOM = Array(7).fill(0);

// async function tetris(filename = REAL_INPUT, iterations = 2022) {
async function tetris({
  filename = REAL_INPUT,
  iterations = 2022,
  bottom = INITIAL_BOTTOM.map((v, i) => [i, v] as Index),
  offset = 0,
}): Promise<[bottom: Index[], offset: number]> {
  const input = await readInput(filename);

  console.log("============== START ===================");

  printBottom(bottom);

  // console.log("input", input, "len:", input.length);
  // console.log("max iterations:", 2022 * 3);

  //   INITIAL_BOTTOM[1] = 2;
  // console.log("INITIAL_BOTTOM", INITIAL_BOTTOM);

  // printBottom(INITIAL_BOTTOM);

  // const N = 2022; // Number of rocks
  const N = iterations;
  let charIndex = offset;
  let moves = offset;

  // let bottom = INITIAL_BOTTOM.map((v, i) => [i, v] as Index);

  for (let i = 0; i < N; i++) {
    // let shape = SHAPES["-"];

    // bottom = expandBottom(bottom);
    // const shapeChar = i % 2 === 0 ? "-" : "+";
    const shapeChar = getShape(i);
    let shape = SHAPES[shapeChar];

    let position = getStartPosition(shapeChar, bottom);
    // console.log(`InitialPosition: [${[position]}], shape: [${shapeChar}]`);
    // printBottom(
    //   // bottom.map((b) => b[1]),
    //   bottom,
    //   position
    // );

    for (let j = 0; j < 100000; j++) {
      // if (charIndex === 0 && i > 0) {
      //   console.log(
      //     `START NEW CHAR ITERATION @ N=${i}, j=${j}, char=${shapeChar}, moves=${moves}`
      //   );
      // }
      const move = input.charAt(charIndex) as Move;
      // console.log(`charAt(${charIndex}): [${move}]`);
      charIndex = charIndex + 1 >= input.length ? 0 : charIndex + 1;
      moves++;

      if (MOVES[move] === "RIGHT") {
        // console.log("try move right");

        const right = [position[0] + 1, position[1]] as Index;
        const collided = shape.collision(right, bottom);
        if (!collided) {
          position = right;
          // console.log("new position", position);
        }
      } else if (MOVES[move] === "LEFT") {
        // console.log("try move left");
        const left = [position[0] - 1, position[1]] as Index;
        const collided = shape.collision(left, bottom);

        if (!collided) {
          position = left;
          // console.log("new position", position);
        }
      }
      // Move down
      // console.log("try move down");

      const down = [position[0], position[1] - 1] as Index;
      const collided = shape.collision(down, bottom);
      if (!collided) {
        position = down;
        // console.log("new position", position);
      } else {
        // update bottom
        // console.log(`shape hit bottom (at rest):`, position);
        bottom = updateBottom(shapeChar, position, bottom);
        // console.log("bottom length", bottom.length);
        // printBottom(bottom.map((b) => b[1]));

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

      // if (j === 7) {
      //   bottom = updateBottom(shapeChar, position, bottom);
      //   break;
      // }
    }
  }
  // printBottom(bottom.map((b) => b[1]));
  printBottom(bottom);
  // printBottom(expandBottom(bottom));
  console.log("input.len:", input.length);
  console.log("total moves", moves);
  // console.log(`next char: [${input.charAt(charIndex)}], charIndex: [${charIndex}]`);
  console.log(
    `N: ${N}, shape N-1: ${getShape(N - 1)}, shape N: ${getShape(
      N
    )}, shape N+1: ${getShape(N + 1)}`
  );

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
  // console.log('bottom.length % X', bottom.length % X);

  // if (bottom.length % X !== 2) return bottom;
  return bottom.slice(X);
}

function expandBottom(bottom: Index[]): Index[] {
  const sorted = [...bottom].sort((a, b) => b[1] - a[1]);
  // console.log("sorted", sorted);

  const delta = sorted[0][1] - sorted[6][1];
  // console.log("delta", delta);
  const min = sorted[6][1];
  const expanded: Index[] = bottom.flatMap(([x, y], i) => {
    if (y === min) {
      // lowest
      return [[x, y] as Index];
    } else {
      const add = Array(y - min)
        .fill(x)
        .map((x, i) => {
          return [x, y - i - 1] as Index;
        });
      // console.log("add", add);
      return [[x, y] as Index, ...add] as Index[];
    }
  });

  // console.log("expanded", expanded, "length: ", expanded.length);
  return expanded;
}

function getStartPosition(shape: Shapes, bottom: Index[]): Index {
  const max = Math.max(...bottom.map((b) => b[1]));
  // console.log('max', max);

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
  // console.log(`posX: [${posX}], posY: [${posY}]`);

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

  console.log("     0 1 2 3 4 5 6");
}

(async function run() {
  if (process.env.NODE_ENV === "test") return;
  console.time("run");

  const INPUT = REAL_INPUT;

  // const nFullIterations = 22 + 35 * 3;

  // const [first, firstOffset] = await tetris({
  //   filename: INPUT,
  //   iterations: 440,
  // });

  // console.log('firstOffset', firstOffset);

  // const firstMax = Math.max(...first.map((b) => b[1]));
  // console.log(`height after initial full iteration (N=${440})`, firstMax);

  const nFullIteration = 1730;
  // console.log("nFullIteration", nFullIteration);

  // const [fullIteration, fullOffset] = await tetris({
  //   filename: INPUT,
  //   iterations: nFullIteration,
  //   bottom: first,
  //   offset: firstOffset
  // });

  // const fullIterationMax =
  //   Math.max(...fullIteration.map((b) => b[1])) - firstMax;
  // console.log("fullIterationMax", fullIterationMax);

  const N = 1_000_000_000_000; // Oh shit

  // const fullIterations = Math.floor((N - 440) / nFullIteration);

  // const [rest] = await tetris({
  //   filename: INPUT,
  //   iterations: N % nFullIteration,
  //   bottom: fullIteration,
  //   offset: fullOffset
  // });

  // const restMax =
  //   Math.max(...rest.map((b) => b[1])) - (fullIterationMax + firstMax);
  // console.log("restMax", restMax);

  // console.log(
  //   "total height =",
  //   firstMax + fullIterationMax * fullIterations + restMax
  // );

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
