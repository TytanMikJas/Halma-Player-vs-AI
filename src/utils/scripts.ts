import { Player } from "./enums";
import { getChildren, hasPlayerWon } from "./game-utils";
import { CustomStrategy } from "./strategies";
import { AiStrategy, Move, TypeTile } from "./types";

export const minimaxStrategy: AiStrategy = (board, player) => {
  return minimax(board, 2, player);
};

export const minimaxAlphaBetaStrategy: AiStrategy = (board, player) => {
  return minimaxAlphaBeta(board, 2, player, -Infinity, Infinity);
};

function minimax(board: TypeTile[][], depth: number, player: Player): Move {
  if (
    depth === 0 ||
    hasPlayerWon(board, Player.PLAYER1) ||
    hasPlayerWon(board, Player.PLAYER2)
  ) {
    return { value: CustomStrategy(board), board: board };
  }

  let bestMove: Move = {
    value: player === Player.PLAYER1 ? -Infinity : Infinity,
    board: board,
  };

  if (player === Player.PLAYER1) {
    for (const child of getChildren(board, player)) {
      const childEval = minimax(child, depth - 1, Player.PLAYER2);
      if (childEval.value > bestMove.value) {
        bestMove = { value: childEval.value, board: child };
      }
    }
  } else {
    for (const child of getChildren(board, player)) {
      const childEval = minimax(child, depth - 1, Player.PLAYER1);
      if (childEval.value < bestMove.value) {
        bestMove = { value: childEval.value, board: child };
      }
    }
  }

  return bestMove;
}

function minimaxAlphaBeta(
  board: TypeTile[][],
  depth: number,
  player: Player,
  alpha: number,
  beta: number
): Move {
  if (
    depth === 0 ||
    hasPlayerWon(board, Player.PLAYER1) ||
    hasPlayerWon(board, Player.PLAYER2)
  ) {
    return { value: CustomStrategy(board), board: board };
  }

  let bestMove: Move = {
    value: player === Player.PLAYER1 ? -Infinity : Infinity,
    board: board,
  };

  if (player === Player.PLAYER1) {
    for (const child of getChildren(board, player)) {
      const childEval = minimaxAlphaBeta(
        child,
        depth - 1,
        Player.PLAYER2,
        alpha,
        beta
      );
      if (childEval.value > bestMove.value) {
        bestMove = { value: childEval.value, board: child };
      }
      alpha = Math.max(alpha, childEval.value);
      if (beta <= alpha) {
        break;
      }
    }
  } else {
    for (const child of getChildren(board, player)) {
      const childEval = minimaxAlphaBeta(
        child,
        depth - 1,
        Player.PLAYER1,
        alpha,
        beta
      );
      if (childEval.value < bestMove.value) {
        bestMove = { value: childEval.value, board: child };
      }
      beta = Math.min(beta, childEval.value);
      if (beta <= alpha) {
        break;
      }
    }
  }

  return bestMove;
}
