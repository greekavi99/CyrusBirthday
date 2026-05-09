import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./MonthGame.css";

const TOTAL_MONTHS = 12;

const MONTH_LABELS: Record<number, string> = {
  1: "1st Month",
  2: "2nd Month",
  3: "3rd Month",
  4: "4th Month",
  5: "5th Month",
  6: "6th Month",
  7: "7th Month",
  8: "8th Month",
  9: "9th Month",
  10: "10th Month",
  11: "11th Month",
  12: "12th Month",
};

const MONTH_EMOJIS: Record<number, string> = {
  1: "👶",
  2: "🍼",
  3: "🧸",
  4: "🎒",
  5: "🌟",
  6: "🎈",
  7: "🚀",
  8: "🐣",
  9: "🎵",
  10: "🧩",
  11: "🎨",
  12: "🎂",
};

interface PhotoCard {
  id: number;
  month: number;
  image: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(): PhotoCard[] {
  return shuffle(
    Array.from({ length: TOTAL_MONTHS }, (_, i) => ({
      id: i,
      month: i + 1,
      image: `/photos/month-${i + 1}.jpg`,
    })),
  );
}

export default function MonthGame() {
  const navigate = useNavigate();
  const [cards] = useState<PhotoCard[]>(buildCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const current = cards[currentIndex];

  // Generate 4 choices: correct + 3 random wrong ones
  const choices = useMemo(() => {
    const allMonths = Array.from({ length: TOTAL_MONTHS }, (_, i) => i + 1);
    const wrong = allMonths.filter((m) => m !== current.month);
    const shuffledWrong = shuffle(wrong).slice(0, 3);
    return shuffle([...shuffledWrong, current.month]);
  }, [current]);

  const handleGuess = useCallback(
    (month: number) => {
      if (showResult) return;
      setSelected(month);
      const correct = month === current.month;
      setIsCorrect(correct);
      if (correct) setScore((s) => s + 1);
      setShowResult(true);
      setAnswered((a) => a + 1);
    },
    [current.month, showResult],
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= cards.length) {
      setGameOver(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setShowResult(false);
    }
  }, [currentIndex, cards.length]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setAnswered(0);
    setShowResult(false);
    setIsCorrect(false);
    setGameOver(false);
  }, []);

  if (gameOver) {
    const pct = Math.round((score / 12) * 100);
    const emoji =
      pct === 100 ? "🏆" : pct >= 75 ? "🌟" : pct >= 50 ? "👍" : "💪";
    return (
      <div className="game-scene">
        <div className="game-over-card">
          <div className="game-over-emoji">{emoji}</div>
          <h1 className="game-over-title">Game Over!</h1>
          <p className="game-over-score">
            You got <span className="score-highlight">{score}</span> out of{" "}
            <span className="score-highlight">12</span> correct!
          </p>
          <div className="game-over-bar">
            <div className="game-over-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="game-over-pct">{pct}%</p>
          <div className="game-over-actions">
            <button className="btn-play" onClick={handleRestart}>
              🔄 Play Again
            </button>
            <button className="btn-back" onClick={() => navigate("/")}>
              🎂 Back to Birthday
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-scene">
      {/* Header */}
      <div className="game-header">
        <button className="btn-home" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1 className="game-title">📸 Guess the Month!</h1>
        <div className="game-progress">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Score bar */}
      <div className="score-bar">
        <span className="score-label">
          ⭐ Score: {score} / {answered}
        </span>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Photo card */}
      <div className="photo-container">
        <div className="photo-frame">
          <img
            src={current.image}
            alt="Guess which month this photo is from"
            className="photo-img"
            onError={(e) => {
              // Fallback gradient placeholder when no image file exists
              const target = e.currentTarget;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent && !parent.querySelector(".photo-placeholder")) {
                const placeholder = document.createElement("div");
                placeholder.className = "photo-placeholder";
                placeholder.textContent = MONTH_EMOJIS[current.month] || "📷";
                parent.appendChild(placeholder);
              }
            }}
          />
          {showResult && (
            <div className={`photo-overlay ${isCorrect ? "correct" : "wrong"}`}>
              <span className="overlay-icon">{isCorrect ? "✅" : "❌"}</span>
              <span className="overlay-text">
                {isCorrect
                  ? "Correct!"
                  : `It was the ${MONTH_LABELS[current.month]}!`}
              </span>
            </div>
          )}
        </div>
        <p className="photo-hint">How old is baby Adriel here?</p>
      </div>

      {/* Choices */}
      <div className="choices-grid">
        {choices.map((month) => {
          let cls = "choice-btn";
          if (showResult) {
            if (month === current.month) cls += " correct";
            else if (month === selected) cls += " wrong";
            else cls += " faded";
          }
          return (
            <button
              key={month}
              className={cls}
              onClick={() => handleGuess(month)}
            >
              <span className="choice-emoji">{MONTH_EMOJIS[month]}</span>
              <span className="choice-label">{MONTH_LABELS[month]}</span>
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {showResult && (
        <button className="btn-next" onClick={handleNext}>
          {currentIndex + 1 >= cards.length ? "See Results 🎉" : "Next Photo →"}
        </button>
      )}
    </div>
  );
}
