import type { CSSProperties } from "react";

const COLORS = [
  "#42a5f5",
  "#64b5f6",
  "#90caf9",
  "#1e88e5",
  "#4fc3f7",
  "#81d4fa",
  "#29b6f6",
  "#039be5",
  "#b3e5fc",
  "#0288d1",
];

interface BalloonProps {
  index: number;
}

export default function Balloon({ index }: BalloonProps) {
  const color = COLORS[index % COLORS.length];
  const left = 5 + ((index * 9.5) % 90);
  const delay = (index * 0.7) % 5;
  const duration = 4 + (index % 3);
  const size = 50 + (index % 3) * 15;

  const style: CSSProperties = {
    position: "absolute",
    left: `${left}%`,
    bottom: "-120px",
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };

  return (
    <div className="balloon-wrapper" style={style}>
      <svg width={size} height={size * 1.4} viewBox="0 0 50 70">
        <defs>
          <radialGradient id={`grad-${index}`} cx="35%" cy="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
        </defs>
        <ellipse cx="25" cy="25" rx="22" ry="25" fill={`url(#grad-${index})`} />
        <polygon points="25,50 21,55 29,55" fill={color} />
        <line x1="25" y1="55" x2="25" y2="70" stroke={color} strokeWidth="1" />
      </svg>
    </div>
  );
}
