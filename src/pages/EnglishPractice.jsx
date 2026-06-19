import React from "react";
import { englishQuestions } from "../data/englishQuestions";
import QuizEngine from "../components/QuizEngine";

export default function EnglishPractice() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-1">SAT English Practice</h1>
          <p className="text-slate-400">Sharpen your grammar, reading, writing, and vocabulary skills.</p>
        </div>
        <QuizEngine questions={englishQuestions} title="SAT English" type="english" />
      </div>
    </div>
  );
}
