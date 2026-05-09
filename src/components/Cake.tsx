interface CakeProps {
  blown: boolean;
  onBlow: () => void;
}

export default function Cake({ blown, onBlow }: CakeProps) {
  return (
    <div
      className="cake-container"
      onClick={onBlow}
      style={{ cursor: blown ? "default" : "pointer" }}
    >
      <svg viewBox="0 0 200 220" width="200" height="220" className="cake-svg">
        {/* Candle flame */}
        {!blown ? (
          <>
            <ellipse
              className="flame"
              cx="100"
              cy="36"
              rx="6"
              ry="10"
              fill="#FFA500"
            />
            <ellipse cx="100" cy="38" rx="3" ry="5" fill="#FFFF00" />
          </>
        ) : (
          <>
            {/* Smoke wisps */}
            <circle
              className="smoke smoke-1"
              cx="100"
              cy="40"
              r="3"
              fill="#ccc"
              opacity="0.6"
            />
            <circle
              className="smoke smoke-2"
              cx="97"
              cy="35"
              r="2"
              fill="#bbb"
              opacity="0.4"
            />
            <circle
              className="smoke smoke-3"
              cx="103"
              cy="32"
              r="2.5"
              fill="#aaa"
              opacity="0.3"
            />
          </>
        )}

        {/* Candle */}
        <rect x="96" y="45" width="8" height="35" rx="2" fill="#42a5f5" />
        <rect x="96" y="45" width="8" height="5" rx="1" fill="#90caf9" />

        {/* Number 1 */}
        <text
          x="100"
          y="70"
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill="white"
        >
          1
        </text>

        {/* Top frosting */}
        <path
          d="M 40 85 Q 55 70 70 85 Q 85 70 100 85 Q 115 70 130 85 Q 145 70 160 85 L 160 95 L 40 95 Z"
          fill="#64b5f6"
        />

        {/* Cake top layer */}
        <rect x="40" y="90" width="120" height="40" rx="5" fill="#F4A460" />
        <rect
          x="45"
          y="90"
          width="110"
          height="8"
          fill="#DEB887"
          opacity="0.5"
        />

        {/* Middle frosting */}
        <rect x="40" y="128" width="120" height="8" rx="2" fill="#42a5f5" />

        {/* Cake bottom layer */}
        <rect x="30" y="135" width="140" height="50" rx="5" fill="#F4A460" />
        <rect
          x="35"
          y="135"
          width="130"
          height="8"
          fill="#DEB887"
          opacity="0.5"
        />

        {/* Decorations - dots */}
        {[50, 75, 100, 125, 150].map((x, i) => (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={110}
            r="4"
            fill={["#42a5f5", "#90caf9", "#e3f2fd", "#64b5f6", "#bbdefb"][i]}
            className="cake-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}

        {/* Sprinkles on bottom layer */}
        {[45, 60, 80, 100, 120, 140, 155].map((x, i) => (
          <rect
            key={`sprinkle-${i}`}
            x={x}
            y={150 + (i % 3) * 8}
            width="6"
            height="3"
            rx="1"
            fill={
              [
                "#42a5f5",
                "#90caf9",
                "#e3f2fd",
                "#64b5f6",
                "#bbdefb",
                "#4fc3f7",
                "#81d4fa",
              ][i]
            }
            transform={`rotate(${(i * 30) % 90}, ${x + 3}, ${150 + (i % 3) * 8 + 1.5})`}
          />
        ))}

        {/* Cake plate */}
        <ellipse cx="100" cy="188" rx="85" ry="10" fill="#DDD" />
        <ellipse cx="100" cy="186" rx="85" ry="10" fill="#EEE" />
      </svg>
    </div>
  );
}
