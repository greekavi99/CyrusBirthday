import { useState, useEffect } from "react";

const ANIMALS = [
  { emoji: "🧸", name: "Teddy" },
  { emoji: "🐰", name: "Bunny" },
  { emoji: "🦁", name: "Lion" },
  { emoji: "🐘", name: "Elephant" },
  { emoji: "🦒", name: "Giraffe" },
  { emoji: "🐵", name: "Monkey" },
];

export default function PartyAnimals() {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBounce((b) => !b);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="party-animals">
      {ANIMALS.map((animal, i) => (
        <span
          key={animal.name}
          className={`party-animal ${bounce && i % 2 === 0 ? "bounce-up" : ""} ${bounce && i % 2 === 1 ? "bounce-up" : ""}`}
          style={{
            animationDelay: `${i * 0.15}s`,
            fontSize: "2.5rem",
          }}
          title={animal.name}
        >
          {animal.emoji}
        </span>
      ))}
    </div>
  );
}
