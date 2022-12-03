import events from "events";
import fs from "fs";
import readline, { Interface } from "readline";
import { REAL_INPUT, TEST_INPUT } from "../utils";

async function rockPaperScissor(rl: Interface) {
  let score = 0;

  try {
    rl.on("line", (line) => {
      const mappedMove = calculateMove(parseLine(line));
      score += calculateScore(mappedMove);
    });

    await events.once(rl, "close");
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

const PLAYER_DESIRED_OUTCOME = {
  X: "LOSE",
  Y: "DRAW",
  Z: "WIN",
};

type PlayerDesiredOutcome = keyof typeof PLAYER_DESIRED_OUTCOME;

const MOVE_SCORE: Record<PlayerMoves, 1 | 2 | 3> = {
  X: 1,
  Y: 2,
  Z: 3,
};

// const RESULT_SCORE: Record<"WIN" | "DRAW" | "LOSE", 0 | 3 | 6> = {
//   WIN: 6,
//   DRAW: 3,
//   LOSE: 0,
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

function calculateMove([opponent, playerDesiredOutcome]: [
  OpponentMoves,
  PlayerDesiredOutcome
]): [OpponentMoves, PlayerMoves] {
  // const playerDesiredOutcomeMap: Record<
  // PlayerDesiredOutcome, (o: OpponentMoves) => PlayerMoves > = {
  //   'X': (o)
  // }

  if (PLAYER_DESIRED_OUTCOME[playerDesiredOutcome] === "WIN")
    return [opponent, win(opponent)];
  if (PLAYER_DESIRED_OUTCOME[playerDesiredOutcome] === "DRAW")
    return [opponent, draw(opponent)];
  if (PLAYER_DESIRED_OUTCOME[playerDesiredOutcome] === "LOSE")
    return [opponent, lose(opponent)];

  throw Error("nope");
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

function draw(opponent: OpponentMoves): PlayerMoves {
  if (opponent === "A") return "X";
  if (opponent === "B") return "Y";
  if (opponent === "C") return "Z";

  // nope
  throw Error("nope");
}

function win(opponent: OpponentMoves): PlayerMoves {
  if (opponent === "A") return "Y";
  if (opponent === "B") return "Z";
  if (opponent === "C") return "X";

  // nope
  throw Error("nope");
}

function lose(opponent: OpponentMoves): PlayerMoves {
  if (opponent === "A") return "Z";
  if (opponent === "B") return "X";
  if (opponent === "C") return "Y";

  // nope
  throw Error("nope");
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
  const rl = readline.createInterface({
    input: fs.createReadStream(TEST_INPUT),
    crlfDelay: Infinity,
  });
  await rockPaperScissor(rl);
})();

// for tests
export { isDraw, playerWin, calculateScore, rockPaperScissor };
