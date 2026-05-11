import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadScores } from "./scoreStorage";
import type { ScoreEntry } from "./scoreStorage";
import "./ScoreBoard.css";

export default function ScoreBoard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setScores(loadScores());
  }, []);

  const sortedScores = [...scores].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="scoreboard-scene">
      <div className="scoreboard-header">
        <button className="btn-home" onClick={() => navigate("/")}>
          ← Back
        </button>
        <div>
          <h1 className="scoreboard-title">🏆 Game Score Table</h1>
          <p className="scoreboard-subtitle">Anyone can view the scores for all three games.</p>
        </div>
      </div>

      <div className="scoreboard-info">
        <span>{scores.length} score entries saved</span>
      </div>

      <div className="scoreboard-table-wrapper">
        <table className="scoreboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Game</th>
              <th>Score</th>
              <th>Details</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedScores.length === 0 ? (
              <tr>
                <td colSpan={5} className="scoreboard-empty">
                  No scores recorded yet.
                </td>
              </tr>
            ) : (
              sortedScores.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.name}</td>
                  <td>{entry.game}</td>
                  <td>
                    {entry.score}
                    {entry.maxScore ? ` / ${entry.maxScore}` : ""}
                  </td>
                  <td>{entry.details || "—"}</td>
                  <td>{new Date(entry.date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
