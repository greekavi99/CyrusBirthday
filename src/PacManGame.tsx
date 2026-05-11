import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createScoreEntry, saveScore } from "./scoreStorage";
import "./PacManGame.css";

type Position = { row: number; col: number };

type CellType = "wall" | "dot" | "empty";

const initialBoard: CellType[][] = [
  ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
  ["wall", "dot", "dot", "dot", "dot", "dot", "dot", "dot", "dot", "dot", "dot", "dot", "wall"],
  ["wall", "dot", "wall", "wall", "dot", "wall", "wall", "wall", "wall", "dot", "wall", "dot", "wall"],
  ["wall", "dot", "wall", "wall", "dot", "dot", "dot", "dot", "wall", "dot", "wall", "dot", "wall"],
  ["wall", "dot", "dot", "dot", "dot", "wall", "wall", "dot", "dot", "dot", "dot", "dot", "wall"],
  ["wall", "dot", "wall", "wall", "dot", "dot", "dot", "dot", "wall", "wall", "dot", "dot", "wall"],
  ["wall", "dot", "dot", "dot", "dot", "wall", "empty", "dot", "dot", "dot", "dot", "dot", "wall"],
  ["wall", "dot", "wall", "wall", "dot", "dot", "dot", "dot", "wall", "wall", "dot", "dot", "wall"],
  ["wall", "dot", "dot", "dot", "dot", "wall", "wall", "dot", "dot", "dot", "dot", "dot", "wall"],
  ["wall", "dot", "wall", "wall", "dot", "dot", "dot", "dot", "wall", "dot", "wall", "dot", "wall"],
  ["wall", "dot", "wall", "wall", "dot", "wall", "wall", "wall", "wall", "dot", "wall", "dot", "wall"],
  ["wall", "dot", "dot", "dot", "dot", "dot", "dot", "dot", "dot", "dot", "dot", "dot", "wall"],
  ["wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall", "wall"],
];

const START_PLAYER: Position = { row: 1, col: 1 };
const START_GHOST: Position = { row: 11, col: 11 };

const DIRECTIONS: Record<string, Position> = {
  ArrowUp: { row: -1, col: 0 },
  ArrowDown: { row: 1, col: 0 },
  ArrowLeft: { row: 0, col: -1 },
  ArrowRight: { row: 0, col: 1 },
};

function isWall(board: CellType[][], pos: Position) {
  return board[pos.row][pos.col] === "wall";
}

function getPossibleGhostMoves(board: CellType[][], pos: Position) {
  return Object.values(DIRECTIONS).filter((dir) => {
    const next = { row: pos.row + dir.row, col: pos.col + dir.col };
    return !isWall(board, next);
  });
}

function moveGhost(board: CellType[][], ghost: Position, player: Position): Position {
  const moves = getPossibleGhostMoves(board, ghost);
  if (moves.length === 0) return ghost;

  const sorted = moves.sort((a, b) => {
    const aDist = Math.abs(player.row - (ghost.row + a.row)) + Math.abs(player.col - (ghost.col + a.col));
    const bDist = Math.abs(player.row - (ghost.row + b.row)) + Math.abs(player.col - (ghost.col + b.col));
    return aDist - bDist;
  });

  if (Math.random() < 0.65) {
    const best = sorted[0];
    return { row: ghost.row + best.row, col: ghost.col + best.col };
  }

  const randomIndex = Math.floor(Math.random() * moves.length);
  const randomMove = moves[randomIndex];
  return { row: ghost.row + randomMove.row, col: ghost.col + randomMove.col };
}

export default function PacManGame() {
  const navigate = useNavigate();
  const [board, setBoard] = useState<CellType[][]>(() => initialBoard.map((row) => [...row]));
  const [player, setPlayer] = useState<Position>(START_PLAYER);
  const [ghost, setGhost] = useState<Position>(START_GHOST);
  const [direction, setDirection] = useState<Position>({ row: 0, col: 0 });
  const [dotsRemaining, setDotsRemaining] = useState<number>(() =>
    initialBoard.flat().filter((cell) => cell === "dot").length
  );
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);
  const [photoVisible, setPhotoVisible] = useState(true);

  const resetGame = useCallback(() => {
    setBoard(initialBoard.map((row) => [...row]));
    setPlayer(START_PLAYER);
    setGhost(START_GHOST);
    setDirection({ row: 0, col: 0 });
    setDotsRemaining(initialBoard.flat().filter((cell) => cell === "dot").length);
    setGameStatus("playing");
    setScore(0);
    setStarted(false);
    setPlayerName("");
    setScoreSaved(false);
    setPhotoVisible(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!started || gameStatus !== "playing") return;
      const move = DIRECTIONS[event.key];
      if (move) {
        setDirection(move);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStatus]);

  useEffect(() => {
    if (!started || gameStatus !== "playing") return;
    const interval = window.setInterval(() => {
      setPlayer((currentPlayer) => {
        const next = { row: currentPlayer.row + direction.row, col: currentPlayer.col + direction.col };
        if (isWall(board, next)) return currentPlayer;
        return next;
      });
    }, 280);

    return () => window.clearInterval(interval);
  }, [direction, board, gameStatus, started]);

  useEffect(() => {
    if (!started || gameStatus !== "playing") return;
    const interval = window.setInterval(() => {
      setGhost((currentGhost) => moveGhost(board, currentGhost, player));
    }, 380);
    return () => window.clearInterval(interval);
  }, [board, player, gameStatus, started]);

  useEffect(() => {
    if (!started || gameStatus !== "playing") return;
    if (player.row === ghost.row && player.col === ghost.col) {
      setGameStatus("lost");
      return;
    }

    const currentCell = board[player.row][player.col];
    if (currentCell === "dot") {
      setBoard((prev) => {
        const nextBoard = prev.map((row) => [...row]);
        nextBoard[player.row][player.col] = "empty";
        return nextBoard;
      });
      setDotsRemaining((dots) => dots - 1);
      setScore((value) => value + 10);
    }
  }, [player, ghost, board, gameStatus, started]);

  useEffect(() => {
    if (!started || gameStatus !== "playing") return;
    if (dotsRemaining === 0) {
      setGameStatus("won");
    }
  }, [dotsRemaining, gameStatus, started]);

  useEffect(() => {
    if (!started || gameStatus === "playing" || scoreSaved) return;
    saveScore(
      createScoreEntry(
        playerName || "Guest",
        "Family Pac-Run",
        score,
        undefined,
        gameStatus === "won" ? "Finished the maze" : "Caught by the ghost",
      ),
    );
    setScoreSaved(true);
  }, [gameStatus, score, playerName, started, scoreSaved]);

  const boardRows = useMemo(() => board, [board]);

  if (!started) {
    return (
      <div className="pacman-scene">
        <div className="start-card">
          <div className="pacman-title">🟡 Family Pac-Run</div>
          <p className="pacman-subtitle">Enter your name to begin the maze.</p>
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
              ▶ Start Game
            </button>
          </div>
          <div className="pacman-actions">
            <button onClick={() => navigate("/")}>Back Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pacman-scene">
      <div className="pacman-header">
        <button className="btn-home" onClick={() => navigate("/")}>
          ← Back
        </button>
        <div>
          <h1 className="pacman-title">🟡 Family Pac-Run!</h1>
          <p className="pacman-subtitle">Collect all dots, avoid the ghost, and finish the maze!</p>
        </div>
        <div className="pacman-stats">
          <span>Score: {score}</span>
          <span>Dots left: {dotsRemaining}</span>
        </div>
      </div>

      <div className="pacman-board-wrapper">
        <div className="pacman-board">
          {boardRows.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isPlayer = player.row === rowIndex && player.col === colIndex;
              const isGhost = ghost.row === rowIndex && ghost.col === colIndex;
              return (
                <div
                  className={`board-cell ${cell} ${isPlayer ? "player" : ""} ${isGhost ? "ghost" : ""}`}
                  key={`${rowIndex}-${colIndex}`}
                >
                  {isPlayer ? (
                    <div className="player-icon">
                      <img
                        src="/photos/son-photo.jpg"
                        alt="Son"
                        className="son-photo"
                        onLoad={() => setPhotoVisible(true)}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          setPhotoVisible(false);
                        }}
                      />
                      {!photoVisible && <span className="son-photo-fallback">👦</span>}
                    </div>
                  ) : isGhost ? (
                    <span className="ghost-icon">👻</span>
                  ) : cell === "dot" ? (
                    <span className="dot-icon">•</span>
                  ) : null}
                </div>
              );
            }),
          )}
        </div>
      </div>

      <div className="pacman-controls">
        <button onClick={() => setDirection(DIRECTIONS.ArrowUp)}>↑</button>
        <div>
          <button onClick={() => setDirection(DIRECTIONS.ArrowLeft)}>←</button>
          <button onClick={() => setDirection(DIRECTIONS.ArrowDown)}>↓</button>
          <button onClick={() => setDirection(DIRECTIONS.ArrowRight)}>→</button>
        </div>
      </div>

      {gameStatus !== "playing" && (
        <div className="pacman-overlay">
          <div className="pacman-end-card">
            <h2>{gameStatus === "won" ? "You Won!" : "Game Over"}</h2>
            <p>{gameStatus === "won" ? "You gobbled all the dots!" : "The ghost caught you!"}</p>
            <p>Score: {score}</p>
            <p className="score-saved-message">
              {scoreSaved ? "Score saved to the leaderboard!" : "Saving score..."}
            </p>
            <div className="pacman-actions">
              <button onClick={resetGame}>Play Again</button>
              <button onClick={() => navigate("/")}>Back Home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
