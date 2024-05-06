import { Player } from "./enums";
import { calculateMoves } from "./game-utils";
import { CustomStrategy } from "./strategies";
import { Strategy, TypeTile } from "./types";

export class Node {
  constructor(
    public value: number,
    public max: boolean,
    public board: TypeTile[][],
    public children: Node[] = []
  ) {}
}

export function createRoot(
  board: TypeTile[][],
  player: Player,
  depth: number
): Node {
  const minmaxStrategy = CustomStrategy;

  const root = new Node(
    minmaxStrategy(board),
    true,
    board,
    createChildren(
      player === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1,
      minmaxStrategy,
      board,
      false
    )
  );

  if (depth === 2) {
    root.children.forEach((child) => {
      child.children = createChildren(player, minmaxStrategy, child.board, true);
    });
  }

  return root;
}

const createChildren = (
  player: Player,
  strategy: Strategy,
  board: TypeTile[][],
  max: boolean
): Node[] => {
  const moves = calculateMoves(board, player, strategy);
  return Object.keys(moves)
    .map((key) => {
      const entity = moves[key];
      return entity.moves.map((move) => {
        return new Node(move.value, max, move.board, []);
      });
    })
    .flat();
};
