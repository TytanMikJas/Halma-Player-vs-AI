import { Player } from "./enums";
import { hasPlayerWon } from "./game-utils";
import { createRoot, Node } from "./Node";
import { AiStrategy, Move } from "./types";

export const MinmaxStrategy: AiStrategy = (board, player): Move => {
  const depth = 2;

  const root = createRoot(board, player, depth);

  return minmax(root, depth);
};

export const AlphaBetaStrategy: AiStrategy = (board, player): Move => {
  const depth = 2;

  const root = createRoot(board, player, depth);

  return minimaxAlphaBeta(root, depth, -Infinity, Infinity);
};

function minmax(node: Node, depth: number): Move {
  if (
    depth === 0 ||
    hasPlayerWon(node.board, Player.PLAYER1) ||
    hasPlayerWon(node.board, Player.PLAYER2) ||
    node.children.length === 0
  ) {
    return { value: node.value, board: node.board };
  }

  let bestMove = node.children[0].board;

  if (node.max) {
    let maxVal = -Infinity;
    for (const child of node.children) {
      const childEval = minmax(child, depth - 1);
      if (childEval.value > maxVal) {
        bestMove = childEval.board;
        maxVal = childEval.value;
      }
    }
    return {value: maxVal, board: bestMove};
  } else {
    let minVal = Infinity;
    for (const child of node.children) {
      const childEval = minmax(child, depth - 1);
      if (childEval.value < minVal) {
        bestMove = childEval.board;
        minVal = childEval.value;
      }
    }
    return {value: minVal, board: bestMove};
  }
}

function minimaxAlphaBeta(
  node: Node,
  depth: number,
  alpha: number,
  beta: number
): Move {
  if (
    depth === 0 ||
    node.children.length === 0 ||
    hasPlayerWon(node.board, Player.PLAYER1) ||
    hasPlayerWon(node.board, Player.PLAYER2)
  ) {
    return { value: node.value, board: node.board };
  }

  let bestMove = node.children[0].board;

  if (node.max) {
    let maxVal = -Infinity;
    for (const child of node.children) {
      const childEval = minimaxAlphaBeta(child, depth - 1, alpha, beta);
      if (childEval.value > maxVal) {
        bestMove = childEval.board;
        maxVal = childEval.value;
      }
      alpha = Math.max(alpha, maxVal);

      if (beta <= alpha) {
        break;
      }
    }
    return {value: maxVal, board: bestMove};

  } else {
    let minVal = Infinity;
    for (const child of node.children) {
      const childEval = minimaxAlphaBeta(child, depth - 1, alpha, beta);
      if (childEval.value < minVal) {
        bestMove = childEval.board;
        minVal = childEval.value;
      }
      beta = Math.min(beta, minVal);

      if (beta <= alpha) {
        break;
      }
    }
    return {value: minVal, board: bestMove};
  }
}
