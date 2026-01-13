import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

interface ConfettiProps {
  active: boolean;
  originX?: number;
  originY?: number;
}

const colors = [
  "#E30613",
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
];

export function Confetti({
  active,
  originX = 50,
  originY = 50,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) return;

    const newPieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: originX,
      y: originY,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      velocity: {
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * -15 - 5,
      },
    }));

    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 1500);
    return () => clearTimeout(timer);
  }, [active, originX, originY]);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={
            {
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg)`,
              borderRadius: Math.random() > 0.5 ? "50%" : "0",
              "--tx": `${piece.velocity.x * 10}px`,
              "--ty": `${piece.velocity.y * 10}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
