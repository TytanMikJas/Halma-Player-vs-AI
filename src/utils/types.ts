import { Player, TileColor } from "./enums";

export type TypeTile = {
  x: number;
  y: number;
  color: TileColor;
  player: Player;
};

export type Move = [number, number];

export type Strategy = (board: TypeTile[][], player: Player) => number;