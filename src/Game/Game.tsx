import Board from "../Board/Board";
import { useGameStore } from "../store/game-store";

export default function Game() {
  const {
    selectedPawn,
    deselectPawn,
    currentPlayer,
    turn,
    performAiMove,
    wonMessage,
  } = useGameStore();
  const YOUR_TURN = currentPlayer === turn;
  const handleLocalLoop = () => {
    performAiMove(true);
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-700 py-4">
      {wonMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-blue-600 bg-opacity-80 text-black rounded p-5">
          <div className="text-3xl">{wonMessage}</div>
        </div>
      )}
      <Board />
      <div className="flex space-x-8">
        {selectedPawn && (
          <button
            className="border-gray-500 shadow-md border-2 rounded-lg bg-gray-300 text-3xl px-1 py-1 my-4"
            onClick={deselectPawn}
          >
            Unselect current Pawn
          </button>
        )}
        {YOUR_TURN && !selectedPawn && (
          <button
            className="border-gray-500 shadow-md border-2 rounded-lg bg-gray-300 text-3xl px-1 py-1 my-4"
            onClick={handleLocalLoop}
          >
            Strategy Move
          </button>
        )}
      </div>
    </div>
  );
}
