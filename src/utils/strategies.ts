import {
  PLAYER1_BASE,
  PLAYER1_CORNER,
  PLAYER2_BASE,
  PLAYER2_CORNER,
  weights,
} from "./constans";
import { Player } from "./enums";
import { generateAvailableMovesForPawn } from "./game-utils";
import { Strategy } from "./types";

// random move
export const RandomStrategy: Strategy = () => Math.random();

// number of pawns in enemy base
export const OccupyEnemyBaseStrategy: Strategy = (board, player) => {
  const enemyBase = player === Player.PLAYER1 ? PLAYER2_BASE : PLAYER1_BASE;
  return enemyBase.reduce(
    (acc, [x, y]) => (board[x][y].player === player ? acc + 1 : acc), 0
  );
};

// number of pawns in own base
export const PreventEnemyOccupationStrategy: Strategy = (board, player) => {
  const playerBase = player === Player.PLAYER1 ? PLAYER1_BASE : PLAYER2_BASE;
  const enemy = player === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
  return playerBase.reduce(
    (acc, [x, y]) => (board[x][y].player === enemy ? acc + 1 : acc), 0
  );
};

// euclidian distance to enemy base
export const DistanceToEnemyBaseStrategy: Strategy = (board, player) => {
  const playerTiles = board.flat().filter((tile) => tile.player === player);
  let distance = 0;
  const enemyBase = player === Player.PLAYER1 ? PLAYER2_CORNER : PLAYER1_CORNER;

  playerTiles.forEach(({ x, y }) => {
    distance += Math.sqrt((x - enemyBase[0]) ** 2 + (y - enemyBase[1]) ** 2);
  });

  return -distance;
};

// number of double jumps in the right way
export const DoubleJumpStrategy: Strategy = (board, player) => {
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
      doubleJumps += doulbeJumpMoves.filter(move => move[0] >= x && move[1] >= y).length;
    else 
      doubleJumps += doulbeJumpMoves.filter(move => move[0] <= x && move[1] <= y).length;
  });

  return doubleJumps;
};

// number of jumps in the right way
export const MobilityStrategy: Strategy = (board, player) => {
  const playerTiles = board.flat().filter((tile) => tile.player === player);
  let moves = 0;

  playerTiles.forEach(({ x, y }) => {
    const doulbeJumpMoves = generateAvailableMovesForPawn(
      x,
      y,
      board,
      [],
      false,
      new Set<string>()
    );

    if (player === Player.PLAYER1) 
      moves += doulbeJumpMoves.filter(move => move[0] >= x && move[1] >= y).length;
    else 
      moves += doulbeJumpMoves.filter(move => move[0] <= x && move[1] <= y).length;
  });

  return moves;
};

// decrease enemy mobility
export const DecreaseEnemyMobilityStrategy: Strategy = (board, player) => {
  return MobilityStrategy(board, player === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1) * -1;
};

// custom strategy based on all upper ones
export const CustomStrategy: Strategy = (board, player) => {
  const occupationScore = OccupyEnemyBaseStrategy(board, player);
  const defenseScore = PreventEnemyOccupationStrategy(board, player);
  const distanceScore = DistanceToEnemyBaseStrategy(board, player);
  const doubleJumpScore = DoubleJumpStrategy(board, player);
  const mobilityScore = MobilityStrategy(board, player);
  const enemyMobilityReductionScore = DecreaseEnemyMobilityStrategy(board, player);

  return (
    occupationScore * weights.occupationWeight +
    defenseScore * weights.defenseWeight +
    distanceScore * weights.distanceWeight + 
    doubleJumpScore * weights.doubleJumpWeight +
    mobilityScore * weights.mobilityWeight +
    enemyMobilityReductionScore * weights.enemyMobilityReductionWeight
  );
};

