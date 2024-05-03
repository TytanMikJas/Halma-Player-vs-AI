import { BOARD_SIZE } from "./constans";
import { Player, TileColor } from "./enums";
import { Move, TypeTile } from "./types";

const directions = [
  { dx: -1, dy: -1 },
  { dx: -1, dy: 0 },
  { dx: -1, dy: 1 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 1, dy: 1 },
];

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
  moves: Move[] = [],
  doubleJump: boolean = false,
  visited: Set<string> = new Set<string>()
): Move[] {
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
  return board.every(row => {
    return row.every(tile => {
      if (tile.player !== player) {
        return true;
      } else {
        return player === Player.PLAYER1 ? Player2Base(tile.x, tile.y) : Player1Base(tile.x, tile.y);
      }
    });
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
