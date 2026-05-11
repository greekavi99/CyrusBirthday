import { useState, useMemo, useEffect, useCallback } from "react";
import type * as React from "react";
import { useNavigate } from "react-router-dom";
import { createScoreEntry, saveScore } from "./scoreStorage";
import "./PuzzleGame.css";

const TOTAL_PHOTOS = 5;
const PUZZLE_DIFFICULTY = 16; // 4x4 grid = 16 pieces

interface Piece {
  id: number;
  photoId: number;
  row: number;
  col: number;
  placed: boolean;
}

function generatePuzzlePieces(photoId: number): Piece[] {
  const gridSize = 4;
  const pieces: Piece[] = [];
  let id = 0;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      pieces.push({
        id: id++,
        photoId,
        row,
        col,
        placed: false,
      });
    }
  }

  // Shuffle pieces
  return pieces.sort(() => Math.random() - 0.5);
}

export default function PuzzleGame() {
  const navigate = useNavigate();
  const [photoId, setPhotoId] = useState<number>(() =>
    Math.floor(Math.random() * TOTAL_PHOTOS) + 1
  );
  const [pieces, setPieces] = useState<Piece[]>(() =>
    generatePuzzlePieces(Math.floor(Math.random() * TOTAL_PHOTOS) + 1)
  );
  const [draggedPiece, setDraggedPiece] = useState<Piece | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [started, setStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);

  const placedPieces = useMemo(
    () => pieces.filter((p) => p.placed).length,
    [pieces]
  );

  const isComplete = useMemo(
    () => placedPieces === PUZZLE_DIFFICULTY,
    [placedPieces]
  );

  // Timer effect
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTimeElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Check if game is complete
  useEffect(() => {
    if (isComplete && !gameOver) {
      setGameOver(true);
    }
  }, [isComplete, gameOver]);

  const handlePieceDragStart = useCallback(
    (piece: Piece) => {
      if (piece.placed || gameOver) return;
      setDraggedPiece(piece);
    },
    [gameOver]
  );

  const handlePieceDragEnd = useCallback(() => {
    setDraggedPiece(null);
  }, []);

  const handleGridDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleGridDragLeave = useCallback(() => {
    return;
  }, []);

  const handleGridDrop = useCallback(
    (row: number, col: number, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedPiece || gameOver) return;

      // Check if this position should have this piece
      const isCorrect = draggedPiece.row === row && draggedPiece.col === col;

      if (isCorrect) {
        setPieces((prev) =>
          prev.map((p) =>
            p.id === draggedPiece.id ? { ...p, placed: true } : p
          )
        );
      }

      setDraggedPiece(null);
    },
    [draggedPiece, gameOver]
  );

  const handleHint = useCallback(() => {
    setShowHint(!showHint);
  }, [showHint]);

  const puzzleScore = useMemo(() => Math.max(0, 1600 - timeElapsed * 10), [timeElapsed]);

  const handleRestart = useCallback(() => {
    const newPhotoId = Math.floor(Math.random() * TOTAL_PHOTOS) + 1;
    setPhotoId(newPhotoId);
    setPieces(generatePuzzlePieces(newPhotoId));
    setDraggedPiece(null);
    setGameOver(false);
    setTimeElapsed(0);
    setShowHint(false);
    setStarted(false);
    setPlayerName("");
    setScoreSaved(false);
  }, []);

  useEffect(() => {
    if (!gameOver || scoreSaved || !started) return;
    saveScore(
      createScoreEntry(
        playerName || "Guest",
        "Family Photo Puzzle",
        puzzleScore,
        1600,
        `${PUZZLE_DIFFICULTY} pieces in ${Math.floor(timeElapsed / 60)
          .toString()
          .padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`,
      ),
    );
    setScoreSaved(true);
  }, [gameOver, scoreSaved, started, playerName, puzzleScore, timeElapsed]);

  const unplacedPieces = pieces.filter((p) => !p.placed);
  const formattedTime = `${Math.floor(timeElapsed / 60)
    .toString()
    .padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`;

  if (!started) {
    return (
      <div className="puzzle-scene">
        <div className="start-card">
          <div className="puzzle-complete-emoji">🧩</div>
          <h1 className="puzzle-complete-title">Family Photo Puzzle</h1>
          <p className="puzzle-complete-time">Enter your name to begin.</p>
          <div className="score-save-section">
            <input
              className="score-input"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Your name"
            />
            <button
              className="btn-save"
              disabled={!playerName.trim()}
              onClick={() => setStarted(true)}
            >
              ▶ Start Puzzle
            </button>
          </div>
          <div className="puzzle-complete-actions">
            <button className="btn-back-home" onClick={() => navigate("/")}>
              🎂 Back to Birthday
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="puzzle-scene">
        <div className="puzzle-complete-card">
          <div className="puzzle-complete-emoji">🎉</div>
          <h1 className="puzzle-complete-title">Puzzle Complete!</h1>
          <div className="puzzle-complete-image-wrapper">
            <img
              src={`/photos/family-photo-${photoId}.jpg`}
              alt="Completed puzzle"
              className="puzzle-complete-image"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent && !parent.querySelector(".photo-placeholder")) {
                  const placeholder = document.createElement("div");
                  placeholder.className = "photo-placeholder";
                  placeholder.textContent = "📸";
                  parent.appendChild(placeholder);
                }
              }}
            />
          </div>
          <p className="puzzle-complete-time">
            ⏱️ Time: <span className="time-highlight">{formattedTime}</span>
          </p>
          <p className="puzzle-complete-score">
            💯 Score: <span className="score-highlight">{puzzleScore}</span>
          </p>
          <p className="score-saved-message">
            {scoreSaved ? "Score saved to the leaderboard!" : "Saving score..."}
          </p>
          <div className="puzzle-complete-actions">
            <button className="btn-play-again" onClick={handleRestart}>
              🔄 Another Puzzle
            </button>
            <button className="btn-back-home" onClick={() => navigate("/")}>
              🎂 Back to Birthday
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="puzzle-scene">
      {/* Header */}
      <div className="puzzle-header">
        <button className="btn-home" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1 className="puzzle-title">🧩 Family Photo Puzzle!</h1>
        <div className="puzzle-info">
          <span className="puzzle-timer">⏱️ {formattedTime}</span>
          <span className="puzzle-progress">
            {placedPieces} / {PUZZLE_DIFFICULTY}
          </span>
        </div>
      </div>

      <div className="puzzle-container">
        {/* Puzzle grid */}
        <div className="puzzle-main">
          <div
            className="puzzle-grid"
            style={{
              backgroundImage: showHint
                ? `url(/photos/family-photo-${photoId}.jpg)`
                : "none",
            }}
          >
            {Array.from({ length: 16 }).map((_, index) => {
              const row = Math.floor(index / 4);
              const col = index % 4;
              const piece = pieces.find(
                (p) => p.placed && p.row === row && p.col === col
              );

              return (
                <div
                  key={index}
                  className={`puzzle-slot ${piece ? "filled" : ""}`}
                  onDragOver={handleGridDragOver}
                  onDragLeave={handleGridDragLeave}
                  onDrop={(e) => handleGridDrop(row, col, e)}
                  style={{
                    backgroundImage: piece
                      ? `url(/photos/family-photo-${photoId}.jpg)`
                      : "none",
                    backgroundPosition: `${col * 25}% ${row * 25}%`,
                    backgroundSize: "400% 400%",
                  }}
                >
                  {!piece && (
                    <span className="slot-hint">?</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Hint button */}
          <button className="btn-hint" onClick={handleHint}>
            {showHint ? "🙈 Hide Hint" : "👀 Show Hint"}
          </button>
        </div>

        {/* Unplaced pieces */}
        <div className="puzzle-pieces-section">
          <h3 className="pieces-title">Available Pieces</h3>
          <div className="puzzle-pieces">
            {unplacedPieces.map((piece) => {
              const isDragging = draggedPiece?.id === piece.id;
              return (
                <div
                  key={piece.id}
                  className={`puzzle-piece ${isDragging ? "dragging" : ""}`}
                  draggable
                  onDragStart={() => handlePieceDragStart(piece)}
                  onDragEnd={handlePieceDragEnd}
                  style={{
                    backgroundImage: `url(/photos/family-photo-${photoId}.jpg)`,
                    backgroundPosition: `${piece.col * 25}% ${
                      piece.row * 25
                    }%`,
                    backgroundSize: "400% 400%",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
