import { BOARD_SIZE } from "./constans";
import { Player, TileColor } from "./enums";
import { TypeTile } from "./types";

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
  if (
    (i <= 1 && j <= 4) ||
    (i == 2 && j <= 3) ||
    (i == 3 && j <= 2) ||
    (i == 4 && j <= 1) ||
    (i == 11 && j >= 14) ||
    (i == 12 && j >= 13) ||
    (i == 13 && j >= 12) ||
    (i >= 14 && j >= 11)
  ) {
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

      if (
        (i <= 1 && j <= 4) ||
        (i == 2 && j <= 3) ||
        (i == 3 && j <= 2) ||
        (i == 4 && j <= 1)
      ) {
        player = Player.PLAYER1;
      }
      if (
        (i == 11 && j >= 14) ||
        (i == 12 && j >= 13) ||
        (i == 13 && j >= 12) ||
        (i >= 14 && j >= 11)
      ) {
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
  board: TypeTile[][]
): [number, number, boolean][] {
  const moves: [number, number, boolean][] = [];
  directions.forEach(({ dx, dy }) => {
    let nx = x + dx;
    let ny = y + dy;
    if (
      nx >= 0 &&
      nx < board.length &&
      ny >= 0 &&
      ny < board[nx].length &&
      board[nx][ny].player === Player.NONE
    ) {
      moves.push([nx, ny, false]);
    }
    if (board[nx] && board[nx][ny] && board[nx][ny].player !== Player.NONE) {
      nx += dx;
      ny += dy;
      if (
        nx >= 0 &&
        nx < board.length &&
        ny >= 0 &&
        ny < board[nx].length &&
        board[nx][ny].player === Player.NONE
      ) {
        moves.push([nx, ny, true]);
      }
    }
  });
  return moves;
}
