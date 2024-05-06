import { Strategy } from "./types";
import { Player } from "./enums";
import { hasPlayerWon } from "./game-utils";
import { createRoot, Node } from "./Node";

export const MinmaxStrategy: Strategy = (board, player): number => {
  const depth = 2;

  const root = createRoot(board, player, depth);

  return minmax(root, depth);
};

export const AlphaBetaStrategy: Strategy = (board, player): number => {
  const depth = 2;

  const root = createRoot(board, player, depth);

  return minimaxAlphaBeta(root, depth, -Infinity, Infinity);
};

function minmax(node: Node, depth: number): number {
  if (
    depth === 0 ||
    hasPlayerWon(node.board, Player.PLAYER1) ||
    hasPlayerWon(node.board, Player.PLAYER2) ||
    node.children.length === 0
  ) {
    return node.value;
  }

  if (node.max) {
    let maxVal = -Infinity;
    node.children.forEach((child) => {
      const val = minmax(child, depth - 1);
      maxVal = Math.max(maxVal, val);
    });
    return maxVal;
  } else {
    let minVal = Infinity;
    node.children.forEach((child) => {
      const val = minmax(child, depth - 1);
      minVal = Math.min(minVal, val);
    });
    return minVal;
  }
}

function minimaxAlphaBeta(
  node: Node,
  depth: number,
  alpha: number,
  beta: number
): number {
  if (
    depth === 0 ||
    node.children.length === 0 ||
    hasPlayerWon(node.board, Player.PLAYER1) ||
    hasPlayerWon(node.board, Player.PLAYER2)
  ) {
    return node.value;
  }

  if (node.max) {
    let maxVal = -Infinity;
    for (const child of node.children) {
      const val = minimaxAlphaBeta(child, depth - 1, alpha, beta);
      maxVal = Math.max(maxVal, val);
      alpha = Math.max(alpha, maxVal);

      if (beta <= alpha) {
        break;
      }
    }
    return maxVal;

  } else {
    let minVal = Infinity;
    for (const child of node.children) {
      const val = minimaxAlphaBeta(child, depth - 1, alpha, beta);
      minVal = Math.min(minVal, val);
      beta = Math.min(beta, minVal);

      if (beta <= alpha) {
        break;
      }
    }
    return minVal;
  }
}
