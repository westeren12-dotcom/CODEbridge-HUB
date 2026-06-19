import React, { useState } from "react";
import { mathQuestions } from "../data/mathQuestions";
import QuizEngine from "../components/QuizEngine";
import GraphingCalculator from "../components/GraphingCalculator";
import { Calculator, BookOpen } from "lucide-react";

export default function MathPractice() {
  const [showCalc, setShowCalc] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">SAT Math Practice</h1>
            <p className="text-slate-400">Test your algebra, geometry, and data analysis skills.</p>
          </div>
          <button
            onClick={() => setShowCalc(p => !p)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showCalc ? "bg-violet-600 border-violet-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-violet-500/50"}`}
          >
            <Calculator size={16} /> {showCalc ? "Hide" : "Show"} Graphing Calculator
          </button>
        </div>

        {showCalc && (
          <div className="mb-8 animate-fade-in">
            <GraphingCalculator />
          </div>
        )}

        <QuizEngine questions={mathQuestions} title="SAT Math" type="math" />
      </div>
    </div>
  );
}