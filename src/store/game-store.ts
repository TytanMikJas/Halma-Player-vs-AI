import { devtools } from "zustand/middleware";
import { Player } from "../utils/enums";
import {
  generateAvailableMovesForPawn,
  generateInitialBoardState,
} from "../utils/game-utils";
import { Coord, TypeTile } from "../utils/types";
import { create } from "zustand";

export interface GameStoreData {
  tiles: TypeTile[][];
  currentPlayer: Player;
  turn: Player;
  selectedPawn: [number, number] | null;
  availableMoves: Coord[];
}

const initialGameStore: GameStoreData = {
  currentPlayer: Player.PLAYER1,
  tiles: generateInitialBoardState(),
  turn: Player.PLAYER1,
  selectedPawn: null,
  availableMoves: [],
};

export interface GameStore extends GameStoreData {
  setSelectedPawn: (x: number, y: number) => void;
  deselectPawn: () => void;
  selectAmSelected: (x: number, y: number) => boolean;
  selectAmAllowed: (x: number, y: number) => boolean;
  movePawn: (x: number, y: number) => void;
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
      const { selectedPawn, availableMoves, tiles, currentPlayer, turn } =
        get();
      if (turn !== currentPlayer) return;
      if (selectedPawn == null) return;
      if (!availableMoves.some(([nx, ny]) => nx === x && ny === y)) return;

      const [sx, sy] = selectedPawn;
      const newTiles = tiles.map((row) =>
        row.map((tile) => {
          if (tile.x === sx && tile.y === sy) {
            return { ...tile, player: Player.NONE};
          }
          if (tile.x === x && tile.y === y) {
            return { ...tile, player: currentPlayer };
          }
          return tile;
        })
      );

      set(() => ({
        tiles: newTiles,
        selectedPawn: null,
        availableMoves: [],
      }));
    },
  }))
);
