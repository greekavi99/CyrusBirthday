import type { CSSProperties } from "react";

const SHAPES = ["circle", "square", "triangle"] as const;
const COLORS = [
  "#42a5f5",
  "#90caf9",
  "#e3f2fd",
  "#64b5f6",
  "#bbdefb",
  "#1e88e5",
  "#4fc3f7",
  "#81d4fa",
  "#29b6f6",
  "#b3e5fc",
];

interface ConfettiPieceProps {
  index: number;
}

export default function ConfettiPiece({ index }: ConfettiPieceProps) {
  const color = COLORS[index % COLORS.length];
  const shape = SHAPES[index % SHAPES.length];
  const left = (index * 7.3) % 100;
  const delay = (index * 0.3) % 6;
  const duration = 3 + (index % 4);
  const size = 8 + (index % 6);
  const rotation = (index * 47) % 360;

  const style: CSSProperties = {
    position: "absolute",
    left: `${left}%`,
    top: "-20px",
    width: `${size}px`,
    height: shape === "triangle" ? "0px" : `${size}px`,
    backgroundColor: shape === "triangle" ? "transparent" : color,
    borderRadius: shape === "circle" ? "50%" : "2px",
    borderLeft:
      shape === "triangle" ? `${size / 2}px solid transparent` : undefined,
    borderRight:
      shape === "triangle" ? `${size / 2}px solid transparent` : undefined,
    borderBottom: shape === "triangle" ? `${size}px solid ${color}` : undefined,
    transform: `rotate(${rotation}deg)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };

  return <div className="confetti-piece" style={style} />;
}
