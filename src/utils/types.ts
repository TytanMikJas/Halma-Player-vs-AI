import { Player, TileColor } from "./enums";

export type TypeTile = {
  x: number;
  y: number;
  color: TileColor;
  player: Player;
};

export type Coord = [number, number];

export type Move = {
  value: number;
  board: TypeTile[][];
}

export type Strategy = (board: TypeTile[][], player: Player) => number;
export type AiStrategy = (board: TypeTile[][], player: Player) => Move;

export type TileMoves = {
  [key: string]: {
      tile: TypeTile,
      moves: Move[]
  }
}