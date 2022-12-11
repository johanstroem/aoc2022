import { REAL_INPUT, TEST_INPUT } from "../utils/globals";
import createLineProcessor from "../utils/lineProcessor";

async function countTailVisited(filename = REAL_INPUT) {
  const moves = await readInput(filename);

  return handleMoves(moves, 9);
}

async function readInput(
  filename: string
): Promise<ReturnType<typeof parseMove>[]> {
  const processor = await createLineProcessor(filename);
  let moves: ReturnType<typeof parseMove>[] = [];
  function callback(line: string | string[]) {
    if (typeof line !== "string") {
      throw new Error("oops");
    }
    moves.push(parseMove(line));
  }

  try {
    await processor({
      callback,
    });
  } catch (error) {
    console.error("error", error);
  } finally {
    return moves;
  }
}

// https://stackoverflow.com/questions/49729550/implicitly-create-a-tuple-in-typescript
const position = <T extends number[]>(xs: readonly [...T]): T => xs as T;

type Position = ReturnType<typeof position<[row: number, col: number]>>;
const START_POSITION: Position = position([0, 0]);

function handleMoves(
  moves: Awaited<ReturnType<typeof readInput>>,
  tailLength = 1
) {
  console.log("tailLength", tailLength);

  let headPosition = START_POSITION;
  //   let tailPosition = START_POSITION;
  let tail: Position[] = Array(tailLength).fill(START_POSITION);
  const tailTailIndex = tail.length - 1;
  console.log("tail", tail);

  //   let headVisited = [];
  let tailVisited: Position[] = [tail[tailTailIndex]];
  moves.forEach(([direction, n]) => {
    // console.log(`direction: ${direction}`);
    for (let i = 0; i < n; i++) {
      //   console.log(`i=${i}`);
      headPosition = moveHead(headPosition, direction);
      //   console.log("headPosition", headPosition);
      tail = tail
        .reduce(
          (acc, pos, j) => {
            // console.log(`acc[${j}]: ${acc[j]}, pos=${pos}`);

            if (shouldMove(pos, acc[j])) {
              // console.log(`Tail should move. j[${j}]`);
              const nextPos = moveTail(pos, acc[j]);
              if (j === tailTailIndex) {
                tailVisited.push(nextPos);
              }
              return [...acc, nextPos];
            } else {
              return [...acc, pos];
            }
          },
          [headPosition]
        )
        .slice(1);

      // console.log("head", headPosition);
      // console.log("tail", tail);
      // console.log("visited", tailVisited);

      //   if (shouldMove(tail[tailTailIndex], headPosition)) {
      //     // console.log("TAIL SHOULD MOVE");
      //     // tailPosition = moveTail(tailPosition, headPosition);
      //     tail = tail.map((pos) => moveTail(pos, headPosition));
      //     tailVisited.push(tail[tailTailIndex]);
      //   }
    }
  });
  console.log("visited", tailVisited);
  console.log("visited", tailVisited.length);
  const set = new Set(tailVisited.map((pos) => pos.toString()));
  console.log("set", set);
  console.log("set", set.size);

  //   return tailVisited;
  return set.size;
}

const DIRECTIONS = ["U", "D", "R", "L"] as const;
type Direction = typeof DIRECTIONS[number];

function parseMove(line: string): [direction: Direction, n: number] {
  const [direction, n] = line.split(" ");
  return [direction as Direction, Number(n)];
}

function moveHead([row, col]: Position, direction: Direction): Position {
  switch (direction) {
    case "U":
      return [row + 1, col];
    case "D":
      return [row - 1, col];
    case "R":
      return [row, col + 1];
    case "L":
      return [row, col - 1];
    default:
      return [row, col];
  }
}

function shouldMove([tRow, tCol]: Position, [hRow, hCol]: Position) {
  const deltaRow = hRow - tRow;
  const deltaCol = hCol - tCol;
  //   console.log("deltaRow", deltaRow < 0 ? deltaRow * -1 : deltaRow);
  //   console.log("deltaCol", deltaCol < 0 ? deltaCol * -1 : deltaCol);

  return (
    (deltaRow < 0 ? deltaRow * -1 : deltaRow) > 1 ||
    (deltaCol < 0 ? deltaCol * -1 : deltaCol) > 1
  );
}

function moveTail([tRow, tCol]: Position, [hRow, hCol]: Position): Position {
  const deltaRow = hRow - tRow;
  const deltaCol = hCol - tCol;
  //   console.log("deltaRow", deltaRow);
  //   console.log("deltaCol", deltaCol);

  if (deltaCol && deltaRow) {
    return [tRow + (deltaRow > 0 ? +1 : -1), tCol + (deltaCol > 0 ? +1 : -1)];
  } else if (deltaCol) {
    return [tRow, tCol + (deltaCol > 0 ? +1 : -1)];
  } else if (deltaRow) {
    return [tRow + (deltaRow > 0 ? +1 : -1), tCol];
  } else {
    return [tRow, tCol];
  }
}
(async function run() {
  if (process.env.NODE_ENV === "test") return;

  await countTailVisited();
})();

// for tests
export {
  readInput,
  handleMoves,
  moveHead,
  shouldMove as shouldTailMove,
  moveTail,
};
