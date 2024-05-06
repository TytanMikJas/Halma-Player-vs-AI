import { BOARD_SIZE, directions, PLAYER1_BASE, PLAYER2_BASE } from "./constans";
import { Player, TileColor } from "./enums";
import { Coord, Move, Strategy, TileMoves, TypeTile } from "./types";
import { cloneDeep } from "lodash";

const getColor = (i: number, j: number) => {
  if (Player1Base(i, j) || Player2Base(i, j)) {
    return TileColor.GREEN;
  } else if ((i + j) % 2 === 0) {
    return TileColor.LIGHT_ORANGE;
  } else {
    return TileColor.DARK_ORANGE;
  }
};

export function generateInitialBoardState(): TypeTile[][] {
  const boardState: TypeTile[][] = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    const row: TypeTile[] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      const color = getColor(i, j);
      let player: Player = Player.NONE;

      if (Player1Base(i, j)) {
        player = Player.PLAYER1;
      } else if (Player2Base(i, j)) {
        player = Player.PLAYER2;
      }

      row.push({ x: i, y: j, color, player });
    }
    boardState.push(row);
  }
  return boardState;
}

export function generateAvailableMovesForPawn(
  x: number,
  y: number,
  board: TypeTile[][],
  moves: Coord[] = [],
  doubleJump: boolean = false,
  visited: Set<string> = new Set<string>()
): Coord[] {
  for (const { dx, dy } of directions) {
    const nx = x + dx;
    const ny = y + dy;

    if (!isValidMove(nx, ny)) continue;

    const newTile = board[nx][ny];
    const visitedKey = `${nx}-${ny}`;

    if (
      newTile.player === Player.NONE &&
      !doubleJump &&
      !visited.has(visitedKey)
    ) {
      moves.push([nx, ny]);
      visited.add(visitedKey);
    } else if (newTile.player !== Player.NONE) {
      const nx2 = nx + dx;
      const ny2 = ny + dy;

      if (!isValidMove(nx2, ny2)) continue;

      const jumpTile = board[nx2][ny2];
      const visitedKeyJump = `${nx2}-${ny2}`;

      if (jumpTile.player === Player.NONE && !visited.has(visitedKeyJump)) {
        moves.push([nx2, ny2]);
        visited.add(visitedKeyJump);
        generateAvailableMovesForPawn(nx2, ny2, board, moves, true, visited);
      }
    }
  }

  return moves;
}

function isValidMove(x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE;
}

export function hasPlayerWon(board: TypeTile[][], player: Player): boolean {
  const enemyBase = player === Player.PLAYER1 ? PLAYER2_BASE : PLAYER1_BASE;
  return enemyBase.every(([x, y]) => {
    return board[x][y].player === player;
  });
}

function Player1Base(x: number, y: number) {
  return (
    (x <= 1 && y <= 4) ||
    (x == 2 && y <= 3) ||
    (x == 3 && y <= 2) ||
    (x == 4 && y <= 1)
  );
}

function Player2Base(x: number, y: number) {
  return (
    (x == 11 && y >= 14) ||
    (x == 12 && y >= 13) ||
    (x == 13 && y >= 12) ||
    (x >= 14 && y >= 11)
  );
}

export const calculateMoves = (
  board: TypeTile[][],
  player: Player,
  strategy: Strategy
): TileMoves => {
  const availablePawns = board.flat().filter((t) => t.player === player);
  const moves: TileMoves = {};
  availablePawns.forEach((tile) => {
    const movesForTile = generateAvailableMovesForPawn(tile.x, tile.y, board);
    const evaluatedMoves = evaluateBoard(
      tile.x,
      tile.y,
      movesForTile,
      board,
      player,
      strategy
    );
    moves[`${tile.x}-${tile.y}`] = { tile, moves: evaluatedMoves };
  });

  return moves;
};

export const evaluateBoard = (
  x: number,
  y: number,
  moves: Coord[],
  board: TypeTile[][],
  player: Player,
  strategy: Strategy
): Move[] => {
  return moves.map((move) => {
    const newBoard = cloneDeep(board);
    newBoard[x][y].player = Player.NONE;
    newBoard[move[0]][move[1]].player = player;
    return {
      value: strategy(newBoard),
      board: newBoard,
    };
  });
};
