import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Balloon from "./components/Balloon";
import ConfettiPiece from "./components/ConfettiPiece";
import Cake from "./components/Cake";
import Star from "./components/Star";
import PartyAnimals from "./components/PartyAnimals";
import "./Birthday.css";

const BALLOONS = Array.from({ length: 10 }, (_, i) => i);
const CONFETTI = Array.from({ length: 30 }, (_, i) => i);
const STARS = Array.from({ length: 15 }, (_, i) => i);

export default function Birthday() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showCake, setShowCake] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 500);
    const t2 = setTimeout(() => setShowCake(true), 1200);
    const t3 = setTimeout(() => setShowMessage(true), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="birthday-scene">
      {/* Background stars */}
      <div className="stars-layer">
        {STARS.map((i) => (
          <Star key={i} index={i} />
        ))}
      </div>

      {/* Confetti rain */}
      <div className="confetti-layer">
        {CONFETTI.map((i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </div>

      {/* Balloons floating up */}
      <div className="balloon-layer">
        {BALLOONS.map((i) => (
          <Balloon key={i} index={i} />
        ))}
      </div>

      {/* Main content */}
      <div className={`content ${showContent ? "visible" : ""}`}>
        {/* Top banner */}
        <div className="banner">
          <span className="banner-flag">🎉</span>
          <span className="banner-flag">🎈</span>
          <span className="banner-flag">🎊</span>
          <span className="banner-flag">🎁</span>
          <span className="banner-flag">🎉</span>
        </div>

        {/* Title */}
        <h1 className="title">
          <span className="title-line">Happy</span>
          <span className="big-one">
            1<sup>st</sup>
          </span>
          <span className="title-line">Birthday!</span>
        </h1>
        <h2 className="child-name">Adriel Cyrus</h2>

        {/* Cake */}
        <div className={`cake-section ${showCake ? "visible" : ""}`}>
          {!candleBlown && (
            <p className="blow-hint">🎂 Tap the cake to blow the candle!</p>
          )}
          <Cake blown={candleBlown} onBlow={() => setCandleBlown(true)} />
        </div>

        {/* Party animals */}
        <PartyAnimals />

        {/* Birthday message */}
        <div className={`message ${showMessage ? "visible" : ""}`}>
          <p className="wishes">
            🌟 Wishing you a magical day filled with
            <br />
            laughter, love & lots of cake! 🌟
          </p>
          <div className="age-badge">
            <span className="age-number">1</span>
            <span className="age-text">YEAR OLD</span>
            <span className="age-today">TODAY!</span>
          </div>
        </div>

        {/* Play the Month Game */}
        <button className="play-game-btn" onClick={() => navigate("/game")}>
          📸 Play "Guess the Month" Game!
        </button>

        {/* Play the Puzzle Game */}
        <button className="play-game-btn" onClick={() => navigate("/puzzle")}> 
          🧩 Piece Together Family Photos!
        </button>

        {/* Play the Pac-Man-style Game */}
        <button className="play-game-btn" onClick={() => navigate("/pacman")}>
          🟡 Play Family Pac-Run!
        </button>

        {/* View the Score Board */}
        <button className="play-game-btn" onClick={() => navigate("/scores")}>
          🏆 View Game Score Table
        </button>

        {/* Footer */}
        <div className="footer-hearts">
          {"❤️🧡💛💚💙💜"
            .split("")
            .filter((c) => c !== "\uFE0F")
            .map((heart, i) => (
              <span
                key={i}
                className="heart"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {heart}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
