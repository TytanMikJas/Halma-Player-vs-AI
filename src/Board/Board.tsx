import { useGameStore } from "../store/game-store";
import Tile from "./Tile";

export default function Board() {
  const { tiles } = useGameStore();

  return (
    <div className="flex flex-col">
      {tiles.map((row, i) => (
        <div className="flex">
          {row.map((tile, j) => (
            <Tile
              key={`${i}-${j}`}
              color={tile.color}
              player={tile.player}
              x={i}
              y={j}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
