import {
  PLAYER1_BASE,
  PLAYER1_CORNER,
  PLAYER2_BASE,
  PLAYER2_CORNER,
  weights,
} from "./constans";
import { Player } from "./enums";
import { generateAvailableMovesForPawn } from "./game-utils";
import { Strategy, TypeTile } from "./types";

// random move
export const RandomStrategy: Strategy = () => Math.random();

// number of pawns in enemy base
function OccupyEnemyBaseStrategy(board: TypeTile[][], player: Player): number {
  const enemyBase = player === Player.PLAYER1 ? PLAYER2_BASE : PLAYER1_BASE;
  return enemyBase.reduce(
    (acc, [x, y]) => (board[x][y].player === player ? acc + 1 : acc),
    0
  );
}

export const OccupyBaseStrategy: Strategy = (board) => {
  return (
    OccupyEnemyBaseStrategy(board, Player.PLAYER1) -
    OccupyEnemyBaseStrategy(board, Player.PLAYER2)
  );
};

// number of pawns in own base
function PreventEnemyOccupationStrategy(
  board: TypeTile[][],
  player: Player
): number {
  const playerBase = player === Player.PLAYER1 ? PLAYER1_BASE : PLAYER2_BASE;
  const enemy = player === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
  return playerBase.reduce(
    (acc, [x, y]) => (board[x][y].player === enemy ? acc - 1 : acc),
    0
  );
}

export const PreventOccupationStrategy: Strategy = (board) => {
  return (
    PreventEnemyOccupationStrategy(board, Player.PLAYER1) -
    PreventEnemyOccupationStrategy(board, Player.PLAYER2)
  );
};

// euclidian distance to enemy base
function DistanceToEnemyBaseStrategy(
  board: TypeTile[][],
  player: Player
): number {
  const playerTiles = board.flat().filter((tile) => tile.player === player);
  let distance = 0;
  const enemyBase = player === Player.PLAYER1 ? PLAYER2_CORNER : PLAYER1_CORNER;

  playerTiles.forEach(({ x, y }) => {
    distance += Math.sqrt((x - enemyBase[0]) ** 2 + (y - enemyBase[1]) ** 2);
  });

  return -distance;
}

export const DistanceToBaseStrategy: Strategy = (board) => {
  return (
    DistanceToEnemyBaseStrategy(board, Player.PLAYER1) -
    DistanceToEnemyBaseStrategy(board, Player.PLAYER2)
  );
};

// number of double jumps in the right way
function DoubleJumpToEnemyStrategy(
  board: TypeTile[][],
  player: Player
): number {
  const playerTiles = board.flat().filter((tile) => tile.player === player);
  let doubleJumps = 0;

  playerTiles.forEach(({ x, y }) => {
    const doulbeJumpMoves = generateAvailableMovesForPawn(
      x,
      y,
      board,
      [],
      true,
      new Set<string>()
    );

    if (player === Player.PLAYER1)
      doubleJumps += doulbeJumpMoves.filter(
        (move) => move[0] >= x && move[1] >= y
      ).length;
    else
      doubleJumps += doulbeJumpMoves.filter(
        (move) => move[0] <= x && move[1] <= y
      ).length;
  });

  return doubleJumps;
}

export const DoubleJumpStrategy: Strategy = (board) => {
  return (
    DoubleJumpToEnemyStrategy(board, Player.PLAYER1) -
    DoubleJumpToEnemyStrategy(board, Player.PLAYER2)
  );
};

// number of jumps in the right way
function MobilityToBaseStrategy(board: TypeTile[][], player: Player): number {
  const playerTiles = board.flat().filter((tile) => tile.player === player);
  let moves = 0;

  playerTiles.forEach(({ x, y }) => {
    const availableMoves = generateAvailableMovesForPawn(
      x,
      y,
      board,
      [],
      false,
      new Set<string>()
    );

    if (player === Player.PLAYER1)
      moves += availableMoves.filter(
        (move) => move[0] >= x && move[1] >= y
      ).length;
    else
      moves += availableMoves.filter(
        (move) => move[0] <= x && move[1] <= y
      ).length;
  });

  return moves;
}

export const MobilityStrategy: Strategy = (board) => {
  return (
    MobilityToBaseStrategy(board, Player.PLAYER1) -
    MobilityToBaseStrategy(board, Player.PLAYER2)
  );
};

// custom strategy based on all upper ones
export const CustomStrategy: Strategy = (board) => {
  const occupationScore = OccupyBaseStrategy(board);
  const defenseScore = PreventOccupationStrategy(board);
  const distanceScore = DistanceToBaseStrategy(board);
  const doubleJumpScore = DoubleJumpStrategy(board);
  const mobilityScore = MobilityStrategy(board);

  return (
    occupationScore * weights.occupationWeight +
    defenseScore * weights.defenseWeight +
    distanceScore * weights.distanceWeight +
    doubleJumpScore * weights.doubleJumpWeight +
    mobilityScore * weights.mobilityWeight
  );
};
