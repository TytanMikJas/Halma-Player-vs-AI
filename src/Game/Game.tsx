import Board from "../Board/Board";
import { useGameStore } from "../store/game-store";

export default function Game() {

  const { selectedPawn, deselectPawn } = useGameStore();
  
  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-700 py-4">
      <Board />
      {selectedPawn && (
        <button
          className="border-gray-500 shadow-md border-2 rounded-lg bg-gray-300 text-3xl px-1 py-1 my-4"
          onClick={deselectPawn}
        >
          Unselect current Pawn
        </button>
      )}
    </div>
  );
}
