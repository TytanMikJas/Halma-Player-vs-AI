import { useGameStore } from "../store/game-store";
import { PawnColor, Player, TileColor } from "../utils/enums";
import Pawn from "./Pawn";

interface TileProps {
  x: number;
  y: number;
  color: TileColor;
  player: Player;
}

export default function Tile({ x, y, color, player }: TileProps) {
  const {
    setSelectedPawn,
    selectAmSelected,
    currentPlayer,
    turn,
    selectAmAllowed,
    movePawn,
  } = useGameStore();

  const handlePawnSelect = () => {
    setSelectedPawn(x, y);
  };

  const selected = selectAmSelected(x, y);
  const allowed = selectAmAllowed(x, y);
  const canHighlight = currentPlayer === turn && allowed;

  const onClick = () => {
    if (allowed) {
      movePawn(x, y);
      return;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`w-14 h-14 border-2 border-black flex items-center justify-center ${
        color === TileColor.GREEN
          ? "bg-green-700"
          : color === TileColor.LIGHT_ORANGE
          ? "bg-orange-400"
          : "bg-orange-800"
      }
      ${selected && "bg-green-300"}
      ${canHighlight && 'hover:bg-blue-300 hover:bg-opacity-50 duration-1'}
      ${allowed && '!bg-violet-300 cursor-pointer'}
      `}
    >
      {player !== Player.NONE &&
        (player === Player.PLAYER1 ? (
          <Pawn color={PawnColor.WHITE} onClick={handlePawnSelect} />
        ) : (
          <Pawn color={PawnColor.BLACK} onClick={handlePawnSelect} />
        ))}
    </div>
  );
}
