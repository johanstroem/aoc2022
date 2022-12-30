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

async function tetris(filename = REAL_INPUT) {
  const input = await readInput(filename);

  console.log("input", input, "len:", input.length);
  console.log("max iterations:", 2022 * 3);

  //   INITIAL_BOTTOM[1] = 2;
  console.log("INITIAL_BOTTOM", INITIAL_BOTTOM);

  // printBottom(INITIAL_BOTTOM);

  const N = 1_000_000_000_000 // Oh shit
  // const N = 2022; // Number of rocks
  // const N = 11;
  let charIndex = 0;

  let bottom = INITIAL_BOTTOM.map((v, i) => [i, v] as Index);

  for (let i = 0; i < N; i++) {
    // let shape = SHAPES["-"];

    // bottom = expandBottom(bottom);
    // const shapeChar = i % 2 === 0 ? "-" : "+";
    const shapeChar = getShape(i);
    let shape = SHAPES[shapeChar];

    let position = getStartPosition(shapeChar, bottom);
    console.log(`InitialPosition: [${[position]}], shape: [${shapeChar}]`);
    // printBottom(
    //   // bottom.map((b) => b[1]),
    //   bottom,
    //   position
    // );

    for (let j = 0; j < 100000; j++) {
      const move = input.charAt(charIndex) as Move;
      // console.log(`charAt(${charIndex}): [${move}]`);
      charIndex = charIndex + 1 >= input.length ? 0 : charIndex + 1;

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
        console.log('bottom length', bottom.length);
        
        // printBottom(bottom.map((b) => b[1]));
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
  const max = Math.max(...bottom.map((b) => b[1]));

  console.log("max", max);

  const result = [];
}

function updateBottom(shape: Shapes, [x, y]: Index, bottom: Index[]): Index[] {

  // need to filter unneeded bottom indexes, e.g. rows below any full row
  // ... or just cut any lines > X lines below?
  switch (shape) {
    case "-": {
      return [
        // ...bottom.slice(0, x),
        ...bottom,
        [x, y],
        [x + 1, y],
        [x + 2, y],
        [x + 3, y],
        // ...bottom.slice(x + 4),
      ];
    }
    case "+": {
      return [
        // ...bottom.slice(0, x),
        ...bottom,
        [x, y],
        [x + 1, y],
        [x + 1, y - 1],
        [x + 1, y + 1],
        [x + 2, y],
        // ...bottom.slice(x + 3),
      ];
    }
    case "L": {
      return [
        // ...bottom.slice(0, x),
        ...bottom,
        [x, y],
        [x + 1, y],
        [x + 2, y],
        [x + 2, y + 1],
        [x + 2, y + 2],
        // ...bottom.slice(x + 3),
      ];
    }
    case "I": {
      return [
        // ...bottom.slice(0, x),
        ...bottom,
        [x, y],
        [x, y + 1],
        [x, y + 2],
        [x, y + 3],
        //  ...bottom.slice(x + 1)
      ];
    }
    case "o": {
      return [
        // ...bottom.slice(0, x),
        ...bottom,
        [x, y],
        [x + 1, y],
        [x, y + 1],
        [x + 1, y + 1],
        // ...bottom.slice(x + 2),
      ];
    }
    default: {
      return bottom;
    }
  }
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
  await tetris();
  console.timeEnd("run");
})();

// for tests
export { updateBottom, printBottom, getShape };
