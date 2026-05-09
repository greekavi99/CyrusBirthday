import type { CSSProperties } from "react";

const STAR_COLORS = ["#90caf9", "#64b5f6", "#e3f2fd", "#bbdefb", "#b3e5fc"];

interface StarProps {
  index: number;
}

export default function Star({ index }: StarProps) {
  const color = STAR_COLORS[index % STAR_COLORS.length];
  const left = (index * 13.7) % 95;
  const top = (index * 19.3) % 85;
  const delay = (index * 0.8) % 5;
  const size = 12 + (index % 4) * 6;

  const style: CSSProperties = {
    position: "absolute",
    left: `${left}%`,
    top: `${top}%`,
    animationDelay: `${delay}s`,
    fontSize: `${size}px`,
    color,
  };

  return (
    <span className="star" style={style}>
      ★
    </span>
  );
}
