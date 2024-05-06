import { devtools } from "zustand/middleware";
import { Player } from "../utils/enums";
import {
  bestMoveForStrategy,
  generateAvailableMovesForPawn,
  generateInitialBoardState,
  hasPlayerWon,
} from "../utils/game-utils";
import { AiStrategy, Coord, Strategy, TypeTile } from "../utils/types";
import { create } from "zustand";
import { minimaxAlphaBetaStrategy } from "../utils/scripts";
import { CustomStrategy } from "../utils/strategies";

export interface InitialMoveStore {
  selectedPawn: Coord | null;
  availableMoves: Coord[];
}

export interface InitialGameStore extends InitialMoveStore {
  tiles: TypeTile[][];
  currentPlayer: Player;
  turn: Player;
  strategy: Strategy;
  botStrategy: AiStrategy;
  globalLoop: boolean;
  wonMessage: string | null;
}

const initialMoveStore: InitialMoveStore = {
  selectedPawn: null,
  availableMoves: [],
};

const initialGameStore: InitialGameStore = {
  currentPlayer: Player.PLAYER1,
  tiles: generateInitialBoardState(),
  turn: Player.PLAYER1,
  ...initialMoveStore,
  strategy: CustomStrategy,
  botStrategy: minimaxAlphaBetaStrategy,
  globalLoop: false,
  wonMessage: null,
};

export interface GameStore extends InitialGameStore {
  setSelectedPawn: (x: number, y: number) => void;
  deselectPawn: () => void;
  selectAmSelected: (x: number, y: number) => boolean;
  selectAmAllowed: (x: number, y: number) => boolean;
  movePawn: (x: number, y: number) => void;
  performAiMove: (loop?: boolean) => void;
}

export const useGameStore = create<GameStore, [["zustand/devtools", never]]>(
  devtools((set, get) => ({
    ...initialGameStore,
    setSelectedPawn(x, y) {
      const { tiles, selectedPawn, turn, currentPlayer } = get();
      if (turn != currentPlayer) return;
      if (selectedPawn != null) return;
      const tile = tiles[x][y];
      if (tile.player !== currentPlayer) return;

      const availableMoves = generateAvailableMovesForPawn(x, y, tiles);

      set(() => ({
        selectedPawn: [x, y],
        availableMoves,
      }));
    },
    deselectPawn() {
      const { selectedPawn } = get();
      if (selectedPawn == null) return;
      set(() => ({
        selectedPawn: null,
        availableMoves: [],
      }));
    },
    selectAmSelected(x, y) {
      const { selectedPawn } = get();
      if (selectedPawn == null) return false;
      return selectedPawn[0] === x && selectedPawn[1] === y;
    },
    selectAmAllowed(x, y) {
      const { availableMoves } = get();
      return availableMoves.some(([nx, ny]) => nx === x && ny === y);
    },
    movePawn(x, y) {
      const {
        selectedPawn,
        availableMoves,
        tiles,
        currentPlayer,
        turn,
        performAiMove,
      } = get();
      if (turn !== currentPlayer) return;
      if (selectedPawn == null) return;
      if (!availableMoves.some(([nx, ny]) => nx === x && ny === y)) return;

      const [sx, sy] = selectedPawn;
      const newTiles = tiles.map((row) =>
        row.map((tile) => {
          if (tile.x === sx && tile.y === sy) {
            return { ...tile, player: Player.NONE };
          }
          if (tile.x === x && tile.y === y) {
            return { ...tile, player: currentPlayer };
          }
          return tile;
        })
      );

      if (hasPlayerWon(newTiles, currentPlayer)) {
        set(() => ({ wonMessage: `Player ${currentPlayer} has won!` }));
        return;
      }

      set(() => ({
        tiles: newTiles,
        ...initialMoveStore,
        turn: Player.PLAYER2,
      }));

      performAiMove();
    },
    performAiMove(loop = false) {
      const { tiles, turn, botStrategy, strategy, performAiMove, globalLoop } =
        get();

      const newTiles =
        turn === Player.PLAYER1
          ? bestMoveForStrategy(tiles, turn, strategy).board
          : botStrategy(tiles, turn).board;

      if (hasPlayerWon(newTiles, turn)) {
        set(() => ({
          wonMessage: `Player ${turn} has won!`,
        }));
        return;
      }

      set(() => ({
        turn: turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1,
        tiles: newTiles,
        ...initialMoveStore,
      }));

      if (loop) {
        performAiMove(false || globalLoop);
      }
    },
  }))
);
