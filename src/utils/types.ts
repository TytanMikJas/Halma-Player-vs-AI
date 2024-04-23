import { Player, TileColor } from "./enums";

export type TypeTile = {
    x: number;
    y: number;
    color: TileColor;
    player: Player;
}