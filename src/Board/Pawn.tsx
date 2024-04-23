import { PawnColor } from "../utils/enums";

interface PawnProps {
  color: PawnColor;
  onClick?: () => void;
}

export default function Pawn({ color, onClick }: PawnProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-full w-12 h-12 border-2 border-black ${
        color === PawnColor.WHITE ? "bg-slate-100" : "bg-gray-900"
      }`}
    />
  );
}
