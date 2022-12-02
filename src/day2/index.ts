import events from "events";
import fs from "fs";
import readline from "readline";
import { REAL_INPUT, TEST_INPUT } from "../utils";

async function rockPaperScissor() {
  let score = 0;

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(REAL_INPUT),
      crlfDelay: Infinity,
    });

    rl.on("line", (line) => {
      score += calculateScore(parseLine(line));
    });

    await events.once(rl, "close");

    // console.log("Reading file line by line with readline done.");
    // const used = process.memoryUsage().heapUsed / 1024 / 1024;
    // console.log(
    //   `The script uses approximately ${Math.round(used * 100) / 100} MB`
    // );
  } catch (err) {
    console.error(err);
  }
  console.log("score", score);
  return score;
}

type OpponentMoves = "A" | "B" | "C";

type PlayerMoves = "X" | "Y" | "Z";

// const OPPONENT_MOVES = {
//   A: "ROCK",
//   B: "PAPER",
//   C: "SCISSOR",
// };

// const PLAYER_MOVES = {
//   X: "ROCK",
//   Y: "PAPER",
//   Z: "SCISSOR",
// };

const MOVE_SCORE: Record<PlayerMoves, 1 | 2 | 3> = {
  X: 1,
  Y: 2,
  Z: 3,
};

// const RESULT_SCORE: Record<"WIN" | "DRAW" | "LOOSE", 0 | 3 | 6> = {
//   WIN: 6,
//   DRAW: 3,
//   LOOSE: 0,
// };

function calculateScore([opponent, player]: [
  OpponentMoves,
  PlayerMoves
]): number {
  let score = 0;

  score += MOVE_SCORE[player];
  score += isDraw(opponent, player) ? 3 : playerWin(opponent, player) ? 6 : 0;

  return score;
}

function parseLine(line: string): [OpponentMoves, PlayerMoves] {
  const moves = line.split(" ");
  return [moves[0] as OpponentMoves, moves[1] as PlayerMoves];
}

function isDraw(opponent: OpponentMoves, player: PlayerMoves): boolean {
  if (opponent === "A" && player === "X") return true;
  if (opponent === "B" && player === "Y") return true;
  if (opponent === "C" && player === "Z") return true;
  return false;
}

function playerWin(opponent: OpponentMoves, player: PlayerMoves): boolean {
  const playerOutcomeMap: Record<
    PlayerMoves,
    (move: OpponentMoves) => boolean
  > = {
    X: (m) => m === "C",
    Y: (m) => m === "A",
    Z: (m) => m === "B",
  };

  const getOutcome = playerOutcomeMap[player];

  return getOutcome(opponent);
}

(async function run() {
  await rockPaperScissor();
})();

// for tests
export { isDraw, playerWin, calculateScore };
