import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, Clock, ChevronRight, RotateCcw, Trophy, Target, BookOpen } from "lucide-react";
import { useProgress } from "../hooks/useProgress";

export default function QuizEngine({ questions, title, type }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timedMode, setTimedMode] = useState(false);
  const [difficulty, setDifficulty] = useState("All");
  const [shuffled, setShuffled] = useState([]);
  const { saveTestResult } = useProgress();

  const difficultyLevels = ["All", "Easy", "Medium", "Hard"];
  const choiceLabels = ["A", "B", "C", "D"];

  const shuffle = useCallback((arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);

  const initQuiz = useCallback(() => {
    const filtered = difficulty === "All"
      ? questions
      : questions.filter((q) => q.difficulty === difficulty);
    const pool = shuffle(filtered).slice(0, 15);
    setShuffled(pool);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setFinished(false);
    setTimeLeft(timedMode ? 15 * 60 : null);
  }, [questions, difficulty, shuffle, timedMode]);

  useEffect(() => { initQuiz(); }, [initQuiz]);

  // Timer countdown
  useEffect(() => {
    if (!timedMode || timeLeft === null || finished) return;
    if (timeLeft === 0) { setFinished(true); return; }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timedMode, timeLeft, finished]);

  const handleSelect = (choice) => {
    if (revealed) return;
    setSelected(choice);
  };

  const handleReveal = () => {
    if (!selected) return;
    setRevealed(true);
    setAnswers((prev) => [
      ...prev,
      { questionId: shuffled[current].id, selected, correct: shuffled[current].answer },
    ]);
  };

  const handleNext = () => {
    if (current >= shuffled.length - 1) {
      const score = answers.filter((a) => a.selected === a.correct).length + (selected === shuffled[current].answer ? 1 : 0);
      const total = shuffled.length;
      saveTestResult({ type, score, total, difficulty, timedMode });
      setFinished(true);
    } else {
      setCurrent((p) => p + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const score = answers.filter((a) => a.selected === a.correct).length;
  const pct = shuffled.length > 0 ? Math.round((score / shuffled.length) * 100) : 0;

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (shuffled.length === 0) return <div className="text-slate-400 text-center py-10">Loading questions...</div>;

  if (finished) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center mb-6">
          <Trophy size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Test Complete!</h2>
        <p className="text-slate-400 mb-8">Here's how you did on {title}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <p className="text-3xl font-bold text-blue-400">{score}</p>
            <p className="text-slate-400 text-sm mt-1">Correct</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <p className="text-3xl font-bold text-white">{shuffled.length}</p>
            <p className="text-slate-400 text-sm mt-1">Total</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <p className={`text-3xl font-bold ${pct >= 70 ? "text-green-400" : "text-red-400"}`}>{pct}%</p>
            <p className="text-slate-400 text-sm mt-1">Score</p>
          </div>
        </div>

        {/* Score gauge */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Performance</span>
            <span className={`text-sm font-medium ${pct >= 80 ? "text-green-400" : pct >= 60 ? "text-amber-400" : "text-red-400"}`}>
              {pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : "Needs Work"}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full">
            <div
              className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-green-400" : pct >= 60 ? "bg-amber-400" : "bg-red-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {type === "math" && (
            <p className="text-slate-400 text-sm mt-3">
              Estimated SAT Math Score: <span className="text-blue-400 font-bold">{Math.round(200 + (pct / 100) * 600)}/800</span>
            </p>
          )}
          {type === "english" && (
            <p className="text-slate-400 text-sm mt-3">
              Estimated SAT EBRW Score: <span className="text-blue-400 font-bold">{Math.round(200 + (pct / 100) * 600)}/800</span>
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={initQuiz}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
          >
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const q = shuffled[current];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Config bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
          {difficultyLevels.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${difficulty === d ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          onClick={() => setTimedMode((p) => !p)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${timedMode ? "bg-amber-600/20 border-amber-500/50 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"}`}
        >
          <Clock size={14} /> {timedMode ? "Timed ON" : "Timed OFF"}
        </button>
        {timedMode && timeLeft !== null && (
          <span className={`ml-auto text-lg font-bold tabular-nums ${timeLeft < 60 ? "text-red-400" : "text-amber-400"}`}>
            ⏱ {formatTime(timeLeft)}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-blue-400" />
          <span className="text-slate-400 text-sm">Question {current + 1} of {shuffled.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            q.difficulty === "Easy" ? "bg-green-500/20 text-green-400" :
            q.difficulty === "Medium" ? "bg-amber-500/20 text-amber-400" :
            "bg-red-500/20 text-red-400"
          }`}>{q.difficulty}</span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{q.topic}</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((current + 1) / shuffled.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 mb-5">
        <p className="text-white text-lg leading-relaxed font-medium">{q.question}</p>
      </div>

      {/* Choices */}
      <div className="space-y-3 mb-6">
        {q.choices.map((choice, i) => {
          const label = choiceLabels[i];
          const isSelected = selected === label;
          const isCorrect = q.answer === label;
          let style = "bg-slate-800/60 border-slate-700 text-slate-300 hover:border-blue-500/60 hover:bg-slate-800";
          if (revealed) {
            if (isCorrect) style = "bg-green-500/15 border-green-500 text-white";
            else if (isSelected && !isCorrect) style = "bg-red-500/15 border-red-500 text-white";
            else style = "bg-slate-800/40 border-slate-700 text-slate-500";
          } else if (isSelected) {
            style = "bg-blue-600/20 border-blue-500 text-white";
          }

          return (
            <button
              key={label}
              onClick={() => handleSelect(label)}
              disabled={revealed}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all ${style} ${!revealed ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-sm font-bold ${isSelected && !revealed ? "bg-blue-500 text-white" : revealed && isCorrect ? "bg-green-500 text-white" : revealed && isSelected ? "bg-red-500 text-white" : "bg-slate-700 text-slate-400"}`}>
                {label}
              </span>
              <span className="flex-1">{choice}</span>
              {revealed && isCorrect && <CheckCircle size={18} className="text-green-400 flex-shrink-0" />}
              {revealed && isSelected && !isCorrect && <XCircle size={18} className="text-red-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className="bg-slate-800/60 border border-blue-500/30 rounded-xl p-4 mb-5 animate-fade-in">
          <p className="text-blue-400 font-medium text-sm mb-1 flex items-center gap-1">
            <Target size={14} /> Explanation
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={!selected}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${selected ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors"
          >
            {current >= shuffled.length - 1 ? "See Results" : "Next Question"}
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}